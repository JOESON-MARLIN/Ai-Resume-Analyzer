import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-flash';

// Utility to clean up markdown code block formatting from Gemini responses
const cleanJsonOutput = (text) => {
    return text.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();
};

/**
 * AI Parsing: Takes raw resume text and extracts structured JSON.
 * Analyzes ATS score, skills, metrics, and generates actionable improvements.
 */
export const parseResume = async (resumeText) => {
    const prompt = `
        You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
        Analyze the following resume text and extract the information into a strict JSON format.
        
        Fields required in the JSON:
        - "score": integer 0-100 indicating ATS readiness and quality.
        - "wordCount": estimated word count.
        - "sectionsFound": array of strings (e.g., ["Summary", "Experience", "Skills"]).
        - "sectionsMissing": array of strings (important sections that are missing).
        - "skillsFound": array of all technical and soft skills found.
        - "verbsUsed": array of strong action verbs found.
        - "hasMetrics": boolean indicating if they used quantifiable numbers (% or $ or counts).
        - "metricCount": integer of how many distinct metrics were found.
        - "improvements": array of objects { "priority": "High"|"Medium"|"Low", "text": "Suggestion here" }.
        
        Resume Text:
        """${resumeText}"""
        
        Return ONLY valid JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        const rawResponse = response.text;
        return JSON.parse(cleanJsonOutput(rawResponse));
    } catch (error) {
        console.error('AI parseResume error:', error);
        throw new Error('Failed to parse resume with AI');
    }
};

/**
 * AI Matching: Compares parsed resume text against a Job Description.
 */
export const matchJob = async (resumeText, jobDescription) => {
    const prompt = `
        You are an expert ATS matching engine. 
        Compare candidate's resume against the provided Job Description.
        
        Resume:
        """${resumeText}"""
        
        Job Description:
        """${jobDescription}"""
        
        Output a strict JSON object with:
        - "matchPercent": integer 0-100.
        - "matchedSkills": array of strings (skills present in both).
        - "missingSkills": array of strings (skills required/preferred in JD but missing in resume).
        - "feedback": short 2-sentence summary of fit.
        
        Return ONLY valid JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        return JSON.parse(cleanJsonOutput(response.text));
    } catch (error) {
        console.error('AI matchJob error:', error);
        throw new Error('Failed to match job with AI');
    }
};

/**
 * AI Rewriting: Improves weak bullets.
 */
export const rewriteBullets = async (bulletsText, style = 'metrics') => {
    const styleInstruction = 
        style === 'metrics' ? 'Add highly realistic quantifiable metrics (percentages, dollars, hours saved) that fit the context.' :
        style === 'impact' ? 'Rewrite to emphasize business impact, stakeholder alignment, and leadership.' :
        'Make the bullet extremely concise and hard-hitting, max 12 words per bullet.';

    const prompt = `
        You are a top-tier executive resume writer.
        Rewrite the following resume bullet points based on this style: ${styleInstruction}
        
        Bullets:
        """
        ${bulletsText}
        """
        
        Return ONLY a strict JSON array of objects. Each object must have:
        - "original" (string format)
        - "rewritten" (the primary rewrite)
        - "alt" (an alternative rewrite focusing slightly differently)
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        return JSON.parse(cleanJsonOutput(response.text));
    } catch (error) {
        console.error('AI rewriteBullets error:', error);
        throw new Error('Failed to rewrite bullets with AI');
    }
};
