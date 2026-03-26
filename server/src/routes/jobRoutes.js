// jobRoutes.js
import { Router } from "express";
import { prisma } from "../server.js";

const router = Router();

// GET /api/jobs?userId=xxx  — list all job postings for a user
router.get("/", async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const jobs = await prisma.jobPosting.findMany({
        where: { userId, isArchived: false },
        orderBy: { createdAt: "desc" },
        select: {
            id: true, jobTitle: true, company: true,
            jobUrl: true, createdAt: true,
            _count: { select: { tailoredResumes: true } },
        },
    });
    res.json(jobs);
});

// DELETE /api/jobs/:id  — archive a job posting
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.jobPosting.update({ where: { id }, data: { isArchived: true } });
    res.json({ success: true });
});

export default router;