// profileController.js
// Handles PDF upload → MasterProfile save (Hackathon bypasses LLM extraction)
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import { prisma } from "../server.js";

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
            return res.status(422).json({ error: "PDF appears to be empty or image-only." });
        }

        // 2. Upsert user
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId, email: `${userId}@placeholder.local` },
        });

        // 3. Hackathon shortcut: Save raw text directly as COMPLETE, skip LLM structured parse
        const profile = await prisma.masterProfile.upsert({
            where: { userId },
            update: { status: "COMPLETE", rawText, originalFileName: req.file.originalname },
            create: { userId, status: "COMPLETE", rawText, originalFileName: req.file.originalname },
        });

        // Respond immediately
        res.status(200).json({
            profileId: profile.id,
            status: "COMPLETE",
            message: "Resume saved! Proceeding to dashboard.",
            fullName: userId
        });

        console.log(`[Profile] Saved OK userId=${userId}`);
    } catch (err) {
        console.error("[Profile] Save error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        await fs.unlink(filePath).catch(() => { });
    }
}

export async function getProfile(req, res) {
    const { userId } = req.params;
    const profile = await prisma.masterProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: "No profile found for this user." });
    res.json(profile);
}