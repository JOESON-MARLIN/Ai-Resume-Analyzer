// profileController.js
// Handles PDF upload → LLM extraction → MasterProfile save
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../server.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PARSE_SYSTEM_PROMPT = `
You are a resume parser. Extract all information from the resume text and return ONLY a valid JSON object with NO markdown fences, no explanation.

The JSON structure must be exactly:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedinUrl": "string | null",
  "githubUrl": "string | null",
  "portfolioUrl": "string | null",
  "summary": "string | null",
  "skills": [{ "category": "string", "items": ["string"] }],
  "experience": [{
    "id": "unique short string like exp_1",
    "company": "string",
    "title": "string",
    "startDate": "string",
    "endDate": "string | null",
    "isCurrent": false,
    "location": "string",
    "bullets": ["string"],
    "technologies": ["string"]
  }],
  "education": [{
    "institution": "string",
    "degree": "string",
    "field": "string",
    "startYear": 2020,
    "endYear": 2024,
    "gpa": "string | null",
    "honors": ["string"]
  }],
  "certifications": [{ "name": "string", "issuer": "string", "date": "string", "url": null }],
  "projects": [{
    "name": "string",
    "description": "string",
    "url": "string | null",
    "bullets": ["string"],
    "technologies": ["string"]
  }]
}
`.trim();

export async function uploadAndParseProfile(req, res) {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required." });

    const filePath = req.file.path;

    try {
        // 1. Parse PDF to raw text
        const fileBuffer = await fs.readFile(filePath);
        const { text: rawText } = await pdfParse(fileBuffer);

        if (!rawText || rawText.trim().length < 100) {
            return res.status(422).json({ error: "PDF appears to be empty or image-only (non-parseable)." });
        }

        // 2. Upsert user (create if first time)
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId, email: `${userId}@placeholder.local` },
        });

        // 3. Create a DRAFT profile immediately so the client can poll
        const draft = await prisma.masterProfile.upsert({
            where: { userId },
            update: { status: "DRAFT", rawText, originalFileName: req.file.originalname },
            create: { userId, status: "DRAFT", rawText, originalFileName: req.file.originalname },
        });

        // Respond fast — parsing happens async
        res.status(202).json({
            profileId: draft.id,
            message: "PDF received. Parsing in progress.",
        });

        // 4. Call LLM to extract structured JSON
        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            system: PARSE_SYSTEM_PROMPT,
            messages: [{ role: "user", content: `RESUME TEXT:\n\n${rawText}` }],
        });

        const raw = response.content
            .filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("");

        const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        const parsed = JSON.parse(clean);

        // 5. Persist structured profile
        await prisma.masterProfile.update({
            where: { userId },
            data: {
                status: "COMPLETE",
                fullName: parsed.fullName ?? null,
                email: parsed.email ?? null,
                phone: parsed.phone ?? null,
                location: parsed.location ?? null,
                linkedinUrl: parsed.linkedinUrl ?? null,
                githubUrl: parsed.githubUrl ?? null,
                portfolioUrl: parsed.portfolioUrl ?? null,
                summary: parsed.summary ?? null,
                skills: parsed.skills ?? [],
                experience: parsed.experience ?? [],
                education: parsed.education ?? [],
                certifications: parsed.certifications ?? [],
                projects: parsed.projects ?? [],
            },
        });

        console.log(`[Profile] Parsed OK userId=${userId}`);
    } catch (err) {
        console.error("[Profile] Parse error:", err);
        // Mark profile as failed so UI can show error
        await prisma.masterProfile
            .update({ where: { userId }, data: { status: "DRAFT" } })
            .catch(() => { });
    } finally {
        // Always clean up the temp upload
        await fs.unlink(filePath).catch(() => { });
    }
}

export async function getProfile(req, res) {
    const { userId } = req.params;
    const profile = await prisma.masterProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: "No profile found for this user." });
    res.json(profile);
}