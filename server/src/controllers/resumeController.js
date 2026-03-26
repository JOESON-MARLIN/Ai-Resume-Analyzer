import { parseResume, matchJob, rewriteBullets } from '../services/aiService.js';
import pdfParse from 'pdf-parse';

// @desc    Parse resume from PDF file buffer or raw text to get ATS Score & JSON
// @route   POST /api/resume/parse
// @access  Private
export const parseResumeText = async (req, res) => {
    try {
        let text = req.body.text; // Support testing raw text directly if sent
        
        // If the user uploaded a file natively, extract it
        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                const pdfData = await pdfParse(req.file.buffer);
                text = pdfData.text;
            } else {
                // Fallback for .txt or markdown disguised
                text = req.file.buffer.toString('utf-8');
            }
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'No resume content provided or PDF was empty.' });
        }

        // Call Gemini Service
        const analysis = await parseResume(text);
        
        // Return both the AI Analysis JSON + the cleanly extracted string text so the frontend textarea can show it
        res.status(200).json({ analysis, textExtracted: text });
    } catch (error) {
        console.error('parseResume Error:', error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
};

// @desc    Compare resume JSON vs job description for match score
// @route   POST /api/resume/match
// @access  Private
export const matchToJob = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'Need both resume and job description text' });
        }

        const match = await matchJob(resumeText, jobDescription);
        res.status(200).json(match);
    } catch (error) {
        console.error('matchToJob Error:', error);
        res.status(500).json({ error: 'Failed to match job' });
    }
};

// @desc    Rewrite user resume bullets into stronger metric-based bullets
// @route   POST /api/resume/rewrite
// @access  Private
export const rewriteUserBullets = async (req, res) => {
    try {
        const { bullets, style } = req.body;

        if (!bullets) {
            return res.status(400).json({ error: 'Need bullets to rewrite' });
        }

        const rewrites = await rewriteBullets(bullets, style);
        res.status(200).json({ results: rewrites });
    } catch (error) {
        console.error('rewriteUserBullets Error:', error);
        res.status(500).json({ error: 'Failed to rewrite bullets' });
    }
};
