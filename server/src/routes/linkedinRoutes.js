import { Router } from "express";
import { Anthropic } from "@anthropic-ai/sdk";

const router = Router();
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

router.post("/optimize", async (req, res) => {
    const { profileText, targetRole } = req.body;
    
    if (!profileText) return res.status(400).json({ error: "Profile text is required" });

    try {
        const prompt = `
You are an elite Tech Recruiter and LinkedIn Optimization Expert.
Analyze the following LinkedIn profile raw text and optimize it for a candidate aiming for a "${targetRole || 'Tech'}" role.

OUTPUT FORMAT — You MUST respond with ONLY a valid JSON object. No markdown fences, no preamble, no explanation.
{
  "newHeadline": "string (impactful, SEO optimized)",
  "aboutSection": "string (compelling 3-paragraph story)",
  "keySkillsToAdd": ["string"],
  "improvements": ["string (why you made these changes)"]
}

PROFILE RAW TEXT:
${profileText}
`;

        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307", // using Haiku for speed/cost in hackathon
            max_tokens: 1500,
            messages: [{ role: "user", content: prompt }],
        });

        // Clean JSON
        let text = response.content[0].text.trim();
        if (text.startsWith("```json")) text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        else if (text.startsWith("```")) text = text.replace(/```/g, "").trim();

        const data = JSON.parse(text);
        res.json(data);
    } catch (error) {
        console.error("[LinkedIn API]", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
