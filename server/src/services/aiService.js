// aiService.js
// Completely local, deterministic fallback scanning engine that requires 0 API keys.
// Guarantees 100% uptime for presentations and demos.

export const parseResume = async (resumeText) => {
    try {
        const lower = (resumeText || "").toLowerCase();
        const wordCount = lower.split(/\s+/).filter(Boolean).length;
        
        // Find Sections
        const expectedSections = ["Experience", "Education", "Skills", "Projects", "Summary"];
        const sectionsFound = expectedSections.filter(s => lower.includes(s.toLowerCase()));
        const sectionsMissing = expectedSections.filter(s => !lower.includes(s.toLowerCase()));

        // Find Skills
        const allSkills = ["react", "javascript", "python", "node", "sql", "aws", "docker", "typescript", "git", "html", "css", "mongodb"];
        const skillsFound = allSkills.filter(s => lower.includes(s));

        // Action Verbs
        const verbs = ["developed", "managed", "designed", "optimized", "led", "created", "reduced"];
        const verbsUsed = verbs.filter(v => lower.includes(v));

        // Metrics
        const hasMetrics = /\d+%|\d+\+|\$|million|thousand/i.test(lower);
        
        // Calculate Fake Score
        let score = 50;
        score += (skillsFound.length * 4);
        score += (sectionsFound.length * 3);
        if (hasMetrics) score += 15;
        score = Math.min(100, Math.max(0, score));

        return {
            score,
            wordCount,
            sectionsFound,
            sectionsMissing,
            skillsFound,
            verbsUsed,
            hasMetrics,
            metricCount: hasMetrics ? 3 : 0,
            improvements: [
                { priority: "High", text: "Add more quantifiable numbers (e.g., 'Improved performance by 25%')." },
                { priority: "Medium", text: "Include more hard technical skills relevant to the job." },
                { priority: "Low", text: "Ensure your LinkedIn URL is clearly visible." }
            ]
        };
    } catch (error) {
        console.error('Local Engine Error:', error);
        throw new Error(`Local Engine Error: ${error.message}`);
    }
};

export const matchJob = async (resumeText, jobDescription) => {
    try {
        const resLower = (resumeText || "").toLowerCase();
        const jdLower = (jobDescription || "").toLowerCase();
        
        const allSkills = ["react", "javascript", "python", "node", "sql", "aws", "docker", "kubernetes", "typescript", "git", "css"];
        
        const jobSkills = allSkills.filter(s => jdLower.includes(s));
        const matchedSkills = jobSkills.filter(s => resLower.includes(s));
        const missingSkills = jobSkills.filter(s => !resLower.includes(s));

        const matchPercent = jobSkills.length === 0 ? 65 : Math.round((matchedSkills.length / jobSkills.length) * 100);

        return {
            matchPercent,
            matchedSkills,
            missingSkills,
            feedback: "This is a local heuristics match based on keyword overlap. You are a decent fit but could improve your technical stack."
        };
    } catch (error) {
        console.error('Local Engine Match Error:', error);
        throw new Error(`Match Error: ${error.message}`);
    }
};

export const rewriteBullets = async (bulletsText, style = 'metrics') => {
    try {
        const bullet = (bulletsText || "").trim();
        return [
            {
                original: bullet,
                rewritten: `Spearheaded initiatives by ${style === 'metrics' ? 'increasing efficiency by 40%' : 'aligning cross-functional teams'}, originally stating: ${bullet.slice(0, 30)}...`,
                alt: `Optimized operations by deploying modern frameworks, resolving legacy bottlenecks.`
            }
        ];
    } catch (error) {
        console.error('Local Engine Rewrite Error:', error);
        throw new Error(`Rewrite Error: ${error.message}`);
    }
};
