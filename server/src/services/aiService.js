import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Utility to clean up markdown code block formatting responses
const cleanJsonOutput = (text) => {
    return text.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();
};

/**
 * AI Parsing: Takes raw resume text and extracts structured JSON.
 */
export const parseResume = async (resumeText) => {
    const prompt = `
        You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
        Analyze the following resume text.
        
        Resume Text:
        """${resumeText}"""
        
        Return ONLY a strict JSON object with these exact keys:
        - "score": integer 0-100 indicating ATS readiness and quality.
        - "wordCount": estimated word count.
        - "sectionsFound": array of strings (e.g., ["Summary", "Experience", "Skills"]).
        - "sectionsMissing": array of strings (important sections that are missing).
        - "skillsFound": array of all technical and soft skills found.
        - "verbsUsed": array of action verbs found.
        - "hasMetrics": boolean indicating if they used quantifiable numbers.
        - "metricCount": integer of how many distinct metrics were found.
        - "improvements": array of objects { "priority": "High"|"Medium"|"Low", "text": "Suggestion here" }.
        
        Do not include any other text except valid JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an ATS parser that exclusively outputs raw JSON without markdown formatting."
            }
        });
        
        return JSON.parse(cleanJsonOutput(response.text));
    } catch (error) {
        console.error('AI parseResume error:', error);
        throw new Error(`Gemini AI Error: ${error.message}`);
    }
};

/**
 * AI Matching: Compares parsed resume text against a Job Description.
 */
export const matchJob = async (resumeText, jobDescription) => {
    const prompt = `
        Compare candidate's resume against the Job Description.
        
        Resume:
        """${resumeText}"""
        
        Job Description:
        """${jobDescription}"""
        
        Output ONLY a strict JSON object with:
        - "matchPercent": integer 0-100.
        - "matchedSkills": array of strings (skills present in both).
        - "missingSkills": array of strings (skills required/preferred in JD but missing in resume).
        - "feedback": short 2-sentence summary of fit.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an AI matching engine. Only return valid JSON."
            }
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
        style === 'metrics' ? 'Add highly realistic quantifiable metrics (percentages, dollars) that fit the context.' :
        style === 'impact' ? 'Rewrite to emphasize business impact, stakeholder alignment, and leadership.' :
        'Make the bullet extremely concise and hard-hitting, max 12 words per bullet.';

    const prompt = `
        Rewrite the following resume bullet points based on this style: ${styleInstruction}
        
        Bullets:
        """
        ${bulletsText}
        """
        
        Return ONLY a strict JSON array of objects. Each object must have:
        - "original": the exact original bullet text
        - "rewritten": the primary rewrite
        - "alt": an alternative rewrite focusing slightly differently
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an executive resume writer. Return only valid JSON arrays."
            }
        });
        
        return JSON.parse(cleanJsonOutput(response.text));
    } catch (error) {
        console.error('AI rewriteBullets error:', error);
        throw new Error('Failed to rewrite bullets with AI');
    }
};
