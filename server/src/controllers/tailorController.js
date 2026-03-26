// tailorController.js
// Career Copilot — 1-Click Tailor workflow
// ─────────────────────────────────────────────────────────────────────────────
// Flow:
//   1. Validate request (userId, jobPostingId OR rawDescription)
//   2. Load MasterProfile from DB
//   3. Upsert JobPosting record
//   4. Create TailoredResume row (PENDING)
//   5. Emit real-time status events via Socket.io room user:{userId}
//   6. Call Anthropic API — structured JSON response
//   7. Persist tailored resume + scores
//   8. Emit final result back to client
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../server.js";

// ─── Anthropic client ─────────────────────────────────────────────────────────
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Emit helper — sends to the user's private Socket.io room ─────────────────
function emitStatus(io, userId, event, payload) {
    io.to(`user:${userId}`).emit(event, {
        ts: Date.now(),
        ...payload,
    });
}

// ─── System Prompt ────────────────────────────────────────────────────────────
// This is the core IP of the product. It instructs the LLM to act as a
// professional resume writer and return a deterministic JSON structure.
const TAILOR_SYSTEM_PROMPT = `
You are an elite technical resume writer and ATS (Applicant Tracking System) optimization specialist with 15+ years of experience placing engineers, PMs, and data professionals at FAANG-tier companies.

Your task is to tailor a candidate's master resume profile (given as raw text or structured data) to a specific job description. You must:

1. **Analyze the Job Description**: Extract the top 10–15 keywords, required skills, and core responsibilities.
2. **Authenticity Check**: Detect if the resume details seem fake, exaggerated, or logically inconsistent.
3. **Rewrite Experience Bullets**: Lead with strong action verbs. Use the CAR formula (Context → Action → Result). Front-load JD-matching keywords. Keep bullets 1-2 lines.
4. **Format Assessment**: Grade the resume format and structure conceptually based on the raw text.
5. **Role Suggestions**: Suggest 2-3 current roles that match, and 2-3 stretch roles.
6. **Score the Match**: Provide a match score (0–100) based on ATS weightage.

OUTPUT FORMAT — You MUST respond with ONLY a valid JSON object. No markdown fences. The structure must be exactly:

{
  "authenticityCheck": {
    "isRealistic": true,
    "reasoning": "string"
  },
  "score": 0,
  "formatAssessment": "string",
  "suggestedRoles": ["string"],
  "stretchRoles": ["string"],
  "skills": ["string"],
  "missingSkills": ["string"],
  "tailoredSummary": "string",
  "tailoredExperience": [
    {
      "id": "string",
      "company": "string",
      "title": "string",
      "startDate": "string",
      "endDate": "string | null",
      "isCurrent": true,
      "location": "string",
      "bullets": ["string"],
      "technologies": ["string"]
    }
  ],
  "tailoredSkills": [
    { "category": "string", "items": ["string"] }
  ],
  "tailoredProjects": [
    {
      "name": "string",
      "description": "string",
      "url": "string | null",
      "bullets": ["string"],
      "technologies": ["string"]
    }
  ],
  "matchScore": 0,
  "scoreBreakdown": {
    "skills": 0,
    "experience": 0,
    "keywords": 0
  },
  "keywordsMatched": ["string"],
  "keywordsMissed": ["string"],
  "extractedJdData": {
    "requiredSkills": ["string"],
    "preferredSkills": ["string"],
    "seniorityLevel": "string",
    "topKeywords": ["string"]
  }
}
`.trim();

// ─── Controller ───────────────────────────────────────────────────────────────
export async function tailorResume(req, res) {
    const io = req.app.get("io");
    const { userId, jobDescription, jobTitle, company, jobUrl } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────────
    if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "userId is required" });
    }
    if (!jobDescription || jobDescription.trim().length < 50) {
        return res.status(400).json({ error: "jobDescription must be at least 50 characters" });
    }

    const startMs = Date.now();
    let tailoredResumeId = null;

    try {
        // ── Step 1: Load MasterProfile ───────────────────────────────────────────
        emitStatus(io, userId, "tailor:status", {
            step: "loading_profile",
            message: "Loading your master profile…",
            progress: 5,
        });

        const masterProfile = await prisma.masterProfile.findUnique({
            where: { userId },
        });

        if (!masterProfile) {
            return res.status(404).json({
                error: "No master profile found. Please upload your resume first.",
            });
        }

        if (masterProfile.status === "DRAFT") {
            return res.status(422).json({
                error: "Master profile is still being processed. Please wait.",
            });
        }

        // ── Step 2: Upsert JobPosting ─────────────────────────────────────────────
        emitStatus(io, userId, "tailor:status", {
            step: "saving_job",
            message: "Saving job posting…",
            progress: 10,
        });

        const jobPosting = await prisma.jobPosting.create({
            data: {
                userId,
                rawDescription: jobDescription.trim(),
                jobTitle: jobTitle ?? null,
                company: company ?? null,
                jobUrl: jobUrl ?? null,
            },
        });

        // ── Step 3: Create TailoredResume record (PENDING) ────────────────────────
        const tailoredResume = await prisma.tailoredResume.create({
            data: {
                userId,
                masterProfileId: masterProfile.id,
                jobPostingId: jobPosting.id,
                status: "PROCESSING",
            },
        });

        tailoredResumeId = tailoredResume.id;

        // Respond immediately so the client has the tailoredResumeId to track
        // the job. The rest of the work happens async, pushed via Socket.io.
        res.status(202).json({
            tailoredResumeId,
            jobPostingId: jobPosting.id,
            message: "Tailoring in progress. Listen for tailor:complete on your socket.",
        });

        // ── Step 4: Build LLM user message ────────────────────────────────────────
        emitStatus(io, userId, "tailor:status", {
            step: "reading_jd",
            message: "Reading and analyzing the job description…",
            progress: 20,
        });

        // Pass the raw document to the LLM directly
        const userMessage = `
## MASTER PROFILE
${masterProfile.rawText}

## TARGET JOB DESCRIPTION
${jobDescription.trim()}

## INSTRUCTIONS
Tailor the master profile for this specific job description. Follow every rule in the system prompt exactly. Return ONLY the JSON object.
    `.trim();

        // ── Step 5: Call Anthropic API ────────────────────────────────────────────
        emitStatus(io, userId, "tailor:status", {
            step: "ai_processing",
            message: "AI is rewriting your experience bullets…",
            progress: 40,
        });

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            system: TAILOR_SYSTEM_PROMPT,
            messages: [{ role: "user", content: userMessage }],
        });

        emitStatus(io, userId, "tailor:status", {
            step: "parsing_result",
            message: "Parsing and scoring your tailored resume…",
            progress: 80,
        });

        // ── Step 6: Parse LLM response ────────────────────────────────────────────
        const rawContent = response.content
            .filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("");

        // Strip any accidental markdown fences the model may add
        const cleanJson = rawContent
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleanJson);
        } catch (parseErr) {
            throw new Error(`LLM returned invalid JSON: ${parseErr.message}\n\nRaw:\n${rawContent.slice(0, 500)}`);
        }

        // ── Step 7: Persist final result ──────────────────────────────────────────
        emitStatus(io, userId, "tailor:status", {
            step: "saving",
            message: "Saving your tailored resume…",
            progress: 90,
        });

        const processingMs = Date.now() - startMs;

        const finalResume = await prisma.tailoredResume.update({
            where: { id: tailoredResumeId },
            data: {
                status: "COMPLETED",
                tailoredSummary: parsed.tailoredSummary ?? null,
                tailoredExperience: parsed.tailoredExperience ?? [],
                tailoredSkills: parsed.tailoredSkills ?? [],
                tailoredProjects: parsed.tailoredProjects ?? [],
                matchScore: typeof parsed.matchScore === "number" ? parsed.matchScore : null,
                scoreBreakdown: parsed.scoreBreakdown ?? null,
                keywordsMatched: parsed.keywordsMatched ?? [],
                keywordsMissed: parsed.keywordsMissed ?? [],
                modelUsed: response.model,
                promptTokens: response.usage?.input_tokens ?? null,
                completionTokens: response.usage?.output_tokens ?? null,
                processingMs,
            },
        });

        // Also back-fill the JD's extracted metadata
        if (parsed.extractedJdData) {
            await prisma.jobPosting.update({
                where: { id: jobPosting.id },
                data: { extractedData: parsed.extractedJdData },
            });
        }

        // ── Step 8: Emit completion ───────────────────────────────────────────────
        emitStatus(io, userId, "tailor:complete", {
            tailoredResumeId: finalResume.id,
            matchScore: finalResume.matchScore,
            scoreBreakdown: finalResume.scoreBreakdown,
            keywordsMatched: finalResume.keywordsMatched,
            keywordsMissed: finalResume.keywordsMissed,
            tailoredSummary: finalResume.tailoredSummary,
            tailoredExperience: finalResume.tailoredExperience,
            tailoredSkills: finalResume.tailoredSkills,
            tailoredProjects: finalResume.tailoredProjects,
            authenticityCheck: parsed.authenticityCheck,
            score: parsed.score,
            formatAssessment: parsed.formatAssessment,
            suggestedRoles: parsed.suggestedRoles,
            stretchRoles: parsed.stretchRoles,
            skills: parsed.skills,
            missingSkills: parsed.missingSkills,
            processingMs,
            message: "Your tailored resume is ready!",
            progress: 100,
        });

        console.log(
            `[Tailor] DONE userId=${userId} resumeId=${tailoredResumeId} ` +
            `score=${finalResume.matchScore} ms=${processingMs}`
        );
    } catch (err) {
        console.error(`[Tailor] ERROR userId=${userId}`, err);

        // Persist failure so the UI can show an error state
        if (tailoredResumeId) {
            await prisma.tailoredResume
                .update({
                    where: { id: tailoredResumeId },
                    data: {
                        status: "FAILED",
                        errorMessage: err.message,
                    },
                })
                .catch(() => { }); // best-effort; don't let DB error mask original error
        }

        emitStatus(io, userId, "tailor:error", {
            tailoredResumeId,
            message: "Something went wrong while tailoring your resume.",
            detail: process.env.NODE_ENV === "development" ? err.message : undefined,
        });

        // Response was already sent (202) — can't send another.
        // Error is communicated via socket.
    }
}

// ── GET /api/tailor/:id — Fetch a completed tailored resume by ID ─────────────
export async function getTailoredResume(req, res) {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ error: "userId query param required" });

    const resume = await prisma.tailoredResume.findFirst({
        where: { id, userId },
        include: {
            jobPosting: {
                select: { jobTitle: true, company: true, jobUrl: true, rawDescription: true },
            },
        },
    });

    if (!resume) return res.status(404).json({ error: "Tailored resume not found" });

    res.json(resume);
}
