import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /api/jobs/:userId
router.get("/:userId", async (req, res) => {
    try {
        const jobs = await prisma.jobApplication.findMany({
            where: { userId: req.params.userId },
            orderBy: { updatedAt: "desc" },
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/jobs
router.post("/", async (req, res) => {
    const { userId, company, role, url, salary, notes, status } = req.body;
    try {
        const job = await prisma.jobApplication.create({
            data: {
                userId,
                company,
                role,
                url,
                salary,
                notes,
                status: status || "SAVED",
            },
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/jobs/:id/status
router.patch("/:id/status", async (req, res) => {
    const { status } = req.body;
    try {
        const job = await prisma.jobApplication.update({
            where: { id: req.params.id },
            data: { status },
        });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req, res) => {
    try {
        await prisma.jobApplication.delete({
            where: { id: req.params.id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;