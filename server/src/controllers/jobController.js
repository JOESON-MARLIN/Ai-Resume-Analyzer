import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock API for Job Search (Matches the robust dataset requested)
const MOCK_JOBS = [
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

// @desc    Get Jobs from external/mock API
// @route   GET /api/jobs/search
// @access  Private
export const searchJobs = async (req, res) => {
    try {
        const { query, location, remoteOnly, salaryMin } = req.query;
        let filtered = [...MOCK_JOBS];

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(j => 
                j.role.toLowerCase().includes(q) || 
                j.company.toLowerCase().includes(q) || 
                j.skills.some(s => s.toLowerCase().includes(q))
            );
        }

        if (location) {
            filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
        }

        if (remoteOnly === 'true') {
            filtered = filtered.filter(j => j.type === 'Remote');
        }

        if (salaryMin) {
            filtered = filtered.filter(j => j.salary >= Number(salaryMin));
        }

        res.status(200).json(filtered);
    } catch (error) {
        console.error('searchJobs Error:', error);
        res.status(500).json({ error: 'Failed to search jobs' });
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res) => {
    try {
        const job = MOCK_JOBS.find(j => j.id === req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job' });
    }
};
