import { parseResume, rewriteBullets, matchJob } from '../services/aiService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Parse uploaded resume text via AI
// @route   POST /api/resume/parse
// @access  Private
export const parseResumeText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Resume text is required' });

        // Call Gemini
        const analysis = await parseResume(text);

        // Save to Database (Upsert MasterProfile)
        const profile = await prisma.masterProfile.upsert({
            where: { userId: req.user.id },
            update: {
                rawText: text,
                skills: analysis.skillsFound || [],
                status: 'PARSED',
            },
            create: {
                userId: req.user.id,
                rawText: text,
                skills: analysis.skillsFound || [],
                status: 'PARSED',
            }
        });

        res.status(200).json({ analysis, profileId: profile.id });
    } catch (error) {
        console.error('parseResumeText Error:', error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
};

// @desc    Rewrite bullets using AI
// @route   POST /api/resume/rewrite
// @access  Private
export const rewriteUserBullets = async (req, res) => {
    try {
        const { bullets, style } = req.body;
        if (!bullets) return res.status(400).json({ error: 'Bullets are required' });

        const rewritten = await rewriteBullets(bullets, style);
        res.status(200).json({ results: rewritten });
    } catch (error) {
        console.error('rewriteUserBullets Error:', error);
        res.status(500).json({ error: 'Failed to rewrite bullets' });
    }
};

// @desc    Match resume to job
// @route   POST /api/resume/match
// @access  Private
export const matchToJob = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'Resume text and Job description are required' });
        }

        const matchResults = await matchJob(resumeText, jobDescription);
        res.status(200).json(matchResults);
    } catch (error) {
        console.error('matchToJob Error:', error);
        res.status(500).json({ error: 'Failed to match job' });
    }
};
