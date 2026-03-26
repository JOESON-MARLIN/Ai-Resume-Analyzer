import { createContext, useContext, useState, useCallback } from "react";

// ─── Job Database (shared across components) ─────────────────────────────────
export const JOB_DATABASE = [
    { id: "j1", company: "Google", role: "Frontend Engineer", location: "Remote", salary: 160, type: "Full-time", skills: ["react", "javascript", "typescript", "css", "html", "performance", "testing", "git"], logo: "🔵", posted: "2d" },
    { id: "j2", company: "Stripe", role: "Software Engineer, Dashboard", location: "San Francisco, CA", salary: 185, type: "Hybrid", skills: ["react", "node.js", "graphql", "typescript", "testing", "api", "sql"], logo: "🟣", posted: "1d" },
    { id: "j3", company: "Spotify", role: "Web Developer", location: "New York, NY", salary: 145, type: "Remote", skills: ["javascript", "css", "html", "react", "api", "responsive"], logo: "🟢", posted: "3d" },
    { id: "j4", company: "Netflix", role: "Senior UI Engineer", location: "Los Gatos, CA", salary: 250, type: "Onsite", skills: ["react", "performance", "javascript", "typescript", "css", "testing", "webpack"], logo: "🔴", posted: "1d" },
    { id: "j5", company: "Meta", role: "React Native Developer", location: "Remote", salary: 170, type: "Remote", skills: ["react native", "ios", "android", "javascript", "typescript"], logo: "🔵", posted: "5d" },
    { id: "j6", company: "Apple", role: "Full Stack Engineer", location: "Cupertino, CA", salary: 215, type: "Onsite", skills: ["swift", "react", "node.js", "python", "sql", "api"], logo: "⚪", posted: "2d" },
    { id: "j7", company: "Amazon", role: "Backend Engineer", location: "Seattle, WA", salary: 195, type: "Hybrid", skills: ["java", "aws", "microservices", "docker", "kubernetes", "sql", "ci/cd"], logo: "🟠", posted: "4d" },
    { id: "j8", company: "Microsoft", role: "Cloud Solutions Architect", location: "Remote", salary: 220, type: "Remote", skills: ["azure", "terraform", "kubernetes", "networking", "security", "python"], logo: "🔵", posted: "1d" },
    { id: "j9", company: "OpenAI", role: "ML Engineer", location: "San Francisco, CA", salary: 300, type: "Onsite", skills: ["python", "pytorch", "tensorflow", "deep learning", "nlp", "transformers", "mathematics"], logo: "🟢", posted: "2d" },
    { id: "j10", company: "Airbnb", role: "Product Manager", location: "Remote", salary: 180, type: "Remote", skills: ["product strategy", "analytics", "a/b testing", "sql", "roadmap", "user research"], logo: "🔴", posted: "3d" },
    { id: "j11", company: "Tesla", role: "Embedded Systems Engineer", location: "Austin, TX", salary: 175, type: "Onsite", skills: ["c++", "rtos", "hardware", "python", "linux"], logo: "🔴", posted: "6d" },
    { id: "j12", company: "Shopify", role: "Senior Full Stack Developer", location: "Remote", salary: 190, type: "Remote", skills: ["ruby", "react", "graphql", "node.js", "sql", "testing"], logo: "🟢", posted: "1d" },
    { id: "j13", company: "Figma", role: "UI/UX Designer", location: "Remote", salary: 155, type: "Remote", skills: ["figma", "design systems", "css", "prototyping", "user research"], logo: "🟣", posted: "4d" },
    { id: "j14", company: "Databricks", role: "Data Engineer", location: "San Francisco, CA", salary: 210, type: "Hybrid", skills: ["spark", "python", "sql", "aws", "data pipelines", "kafka"], logo: "🔵", posted: "2d" },
    { id: "j15", company: "Coinbase", role: "Blockchain Engineer", location: "Remote", salary: 230, type: "Remote", skills: ["solidity", "web3", "typescript", "javascript", "smart contracts"], logo: "🔵", posted: "5d" },
];

// ─── Skill → Learning Mapping ─────────────────────────────────────────────────
export const SKILL_COURSES = {
    "react": { name: "React", course: "React Official Tutorial", url: "https://react.dev/learn", track: "Frontend" },
    "typescript": { name: "TypeScript", course: "TypeScript Handbook", url: "https://typescriptlang.org/docs", track: "Frontend" },
    "python": { name: "Python", course: "Python.org Tutorial", url: "https://python.org/about/gettingstarted", track: "Backend" },
    "node.js": { name: "Node.js", course: "Node.js Learn", url: "https://nodejs.org/en/learn", track: "Backend" },
    "aws": { name: "AWS", course: "AWS Training", url: "https://aws.amazon.com/training", track: "Cloud" },
    "docker": { name: "Docker", course: "Docker Get Started", url: "https://docs.docker.com/get-started", track: "DevOps" },
    "kubernetes": { name: "Kubernetes", course: "K8s Basics", url: "https://kubernetes.io/docs/tutorials", track: "DevOps" },
    "sql": { name: "SQL", course: "SQLBolt", url: "https://sqlbolt.com", track: "Data" },
    "graphql": { name: "GraphQL", course: "GraphQL.org Learn", url: "https://graphql.org/learn", track: "Backend" },
    "java": { name: "Java", course: "Java Tutorials", url: "https://dev.java/learn", track: "Backend" },
    "tensorflow": { name: "TensorFlow", course: "TF Tutorials", url: "https://tensorflow.org/tutorials", track: "ML" },
    "pytorch": { name: "PyTorch", course: "PyTorch Tutorials", url: "https://pytorch.org/tutorials", track: "ML" },
    "figma": { name: "Figma", course: "Figma Learn", url: "https://help.figma.com", track: "Design" },
    "testing": { name: "Testing", course: "Testing Library", url: "https://testing-library.com", track: "QA" },
    "css": { name: "CSS", course: "web.dev CSS", url: "https://web.dev/learn/css", track: "Frontend" },
    "javascript": { name: "JavaScript", course: "MDN JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", track: "Frontend" },
    "git": { name: "Git", course: "Git Handbook", url: "https://guides.github.com/introduction/git-handbook", track: "Tools" },
    "ci/cd": { name: "CI/CD", course: "GitHub Actions", url: "https://docs.github.com/en/actions", track: "DevOps" },
    "deep learning": { name: "Deep Learning", course: "fast.ai", url: "https://fast.ai", track: "ML" },
    "nlp": { name: "NLP", course: "Hugging Face Course", url: "https://huggingface.co/learn/nlp-course", track: "ML" },
};

// ─── Context ──────────────────────────────────────────────────────────────────
const CareerContext = createContext(null);

export function CareerProvider({ children }) {
    const [resumeSkills, setResumeSkills] = useState([]);
    const [resumeScore, setResumeScore] = useState(0);
    const [resumeText, setResumeText] = useState("");
    const [hasResume, setHasResume] = useState(false);

    // Save resume analysis results
    const saveResumeData = useCallback((skills, score, text) => {
        setResumeSkills(skills);
        setResumeScore(score);
        setResumeText(text);
        setHasResume(true);
    }, []);

    // Get job matches based on stored resume skills
    const getJobMatches = useCallback(() => {
        if (!hasResume || resumeSkills.length === 0) return [];
        const lowerSkills = resumeSkills.map(s => s.toLowerCase());
        return JOB_DATABASE.map(job => {
            const matched = job.skills.filter(s => lowerSkills.includes(s));
            const missing = job.skills.filter(s => !lowerSkills.includes(s));
            const matchPct = Math.round((matched.length / job.skills.length) * 100);
            return { ...job, matchPct, matchedSkills: matched, missingSkills: missing };
        }).sort((a, b) => b.matchPct - a.matchPct);
    }, [hasResume, resumeSkills]);

    // Get skill gaps (skills needed but not on resume)
    const getSkillGaps = useCallback(() => {
        if (!hasResume) return [];
        const lowerSkills = resumeSkills.map(s => s.toLowerCase());
        const allNeeded = new Map();
        JOB_DATABASE.forEach(job => {
            job.skills.forEach(skill => {
                if (!lowerSkills.includes(skill)) {
                    allNeeded.set(skill, (allNeeded.get(skill) || 0) + 1);
                }
            });
        });
        return [...allNeeded.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill, demandCount]) => ({
                skill,
                demandCount,
                course: SKILL_COURSES[skill] || null,
            }));
    }, [hasResume, resumeSkills]);

    // Career readiness score
    const getReadinessScore = useCallback(() => {
        if (!hasResume) return 0;
        const matches = getJobMatches();
        const avgMatch = matches.length > 0 ? matches.slice(0, 5).reduce((a, b) => a + b.matchPct, 0) / 5 : 0;
        return Math.round((resumeScore * 0.6) + (avgMatch * 0.4));
    }, [hasResume, resumeScore, getJobMatches]);

    return (
        <CareerContext.Provider value={{
            resumeSkills, resumeScore, resumeText, hasResume,
            saveResumeData, getJobMatches, getSkillGaps, getReadinessScore,
        }}>
            {children}
        </CareerContext.Provider>
    );
}

export function useCareer() {
    const ctx = useContext(CareerContext);
    if (!ctx) throw new Error("useCareer must be used within CareerProvider");
    return ctx;
}
