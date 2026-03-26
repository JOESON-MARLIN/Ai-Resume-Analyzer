import { useState, useRef } from "react";
import { useCareer } from "../CareerContext.jsx";
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ─── Job Database ────────────────────────────────────────────────────────────
const JOB_DATABASE = [
    { id: 1, title: "Frontend Engineer", company: "Google", salary: "$140k-$180k", type: "Remote", skills: ["react", "javascript", "typescript", "css", "html", "webpack", "node", "git", "testing", "responsive", "api", "performance"] },
    { id: 2, title: "Backend Engineer", company: "Amazon", salary: "$150k-$200k", type: "Hybrid", skills: ["python", "java", "aws", "docker", "kubernetes", "sql", "nosql", "microservices", "api", "ci/cd", "linux", "scalability"] },
    { id: 3, title: "Full Stack Developer", company: "Meta", salary: "$160k-$210k", type: "Remote", skills: ["react", "node", "javascript", "typescript", "python", "sql", "mongodb", "docker", "git", "api", "graphql", "testing"] },
    { id: 4, title: "Data Scientist", company: "Netflix", salary: "$170k-$230k", type: "Onsite", skills: ["python", "machine learning", "tensorflow", "sql", "statistics", "pandas", "numpy", "visualization", "deep learning", "r", "a/b testing"] },
    { id: 5, title: "DevOps Engineer", company: "Stripe", salary: "$145k-$190k", type: "Remote", skills: ["docker", "kubernetes", "aws", "terraform", "ci/cd", "linux", "python", "monitoring", "jenkins", "ansible", "git", "scripting"] },
    { id: 6, title: "Mobile Developer", company: "Spotify", salary: "$135k-$175k", type: "Hybrid", skills: ["react native", "swift", "kotlin", "ios", "android", "javascript", "typescript", "api", "firebase", "git", "testing"] },
    { id: 7, title: "Product Manager", company: "Airbnb", salary: "$155k-$210k", type: "Hybrid", skills: ["product strategy", "user research", "a/b testing", "sql", "roadmap", "stakeholder", "analytics", "agile", "jira", "data analysis"] },
    { id: 8, title: "ML Engineer", company: "OpenAI", salary: "$200k-$350k", type: "Onsite", skills: ["python", "pytorch", "tensorflow", "deep learning", "nlp", "computer vision", "distributed", "cuda", "transformers", "mathematics"] },
    { id: 9, title: "UI/UX Designer", company: "Apple", salary: "$130k-$175k", type: "Onsite", skills: ["figma", "sketch", "design systems", "prototyping", "user research", "wireframing", "typography", "accessibility", "css", "responsive"] },
    { id: 10, title: "Cloud Architect", company: "Microsoft", salary: "$180k-$250k", type: "Hybrid", skills: ["aws", "azure", "gcp", "terraform", "networking", "security", "kubernetes", "serverless", "microservices", "architecture"] },
];

// ─── Resume Sections to Check ────────────────────────────────────────────────
const EXPECTED_SECTIONS = [
    { name: "Contact Information", keywords: ["email", "phone", "linkedin", "github", "address", "portfolio", "@"] },
    { name: "Professional Summary", keywords: ["summary", "objective", "about", "profile", "overview"] },
    { name: "Work Experience", keywords: ["experience", "work history", "employment", "professional experience"] },
    { name: "Education", keywords: ["education", "university", "college", "degree", "bachelor", "master", "phd", "school"] },
    { name: "Skills", keywords: ["skills", "technical skills", "technologies", "competencies", "proficiencies"] },
    { name: "Projects", keywords: ["projects", "portfolio", "personal projects", "open source"] },
    { name: "Certifications", keywords: ["certifications", "certificates", "certified", "license"] },
];

// ─── Analysis Engine ─────────────────────────────────────────────────────────
function analyzeResume(text) {
    const lower = text.toLowerCase();
    const words = lower.match(/\b\w{3,}\b/g) || [];
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // Detect sections
    const sectionsFound = EXPECTED_SECTIONS.filter(s =>
        s.keywords.some(kw => lower.includes(kw))
    ).map(s => s.name);

    const sectionsMissing = EXPECTED_SECTIONS.filter(s =>
        !s.keywords.some(kw => lower.includes(kw))
    ).map(s => s.name);

    // Extract skills from resume
    const allSkills = ["react", "javascript", "typescript", "python", "java", "c++", "node", "express", "sql", "nosql", "mongodb", "postgresql", "docker", "kubernetes", "aws", "azure", "gcp", "git", "linux", "html", "css", "sass", "tailwind", "bootstrap", "webpack", "vite", "graphql", "rest", "api", "testing", "jest", "cypress", "figma", "sketch", "agile", "scrum", "jira", "ci/cd", "jenkins", "terraform", "redis", "firebase", "swift", "kotlin", "react native", "flutter", "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "nlp", "computer vision", "statistics", "r", "matlab", "tableau", "power bi", "excel", "communication", "leadership", "teamwork", "problem solving", "angular", "vue", "next.js", "django", "flask", "spring", "go", "rust", "php", "ruby", "rails"];

    const skillsFound = allSkills.filter(s => lower.includes(s));

    // Check for action verbs
    const actionVerbs = ["developed", "built", "designed", "implemented", "managed", "led", "created", "improved", "optimized", "reduced", "increased", "launched", "delivered", "architected", "automated", "mentored", "collaborated", "analyzed", "deployed", "integrated", "migrated", "refactored", "scaled", "streamlined"];
    const verbsUsed = actionVerbs.filter(v => lower.includes(v));

    // Check for metrics/numbers
    const hasMetrics = /\d+%|\$\d+|\d+\+|\d+x|\d+ users|\d+ team|\d+ million|\d+ thousand/i.test(text);
    const metricCount = (text.match(/\d+%|\$[\d,]+|\d+\+|\d+x/g) || []).length;

    // Scoring
    let score = 0;
    // Sections (30 pts)
    score += Math.min(30, sectionsFound.length * (30 / EXPECTED_SECTIONS.length));
    // Skills (25 pts)
    score += Math.min(25, skillsFound.length * 2.5);
    // Action verbs (15 pts)
    score += Math.min(15, verbsUsed.length * 2);
    // Metrics (15 pts)
    score += hasMetrics ? Math.min(15, metricCount * 5) : 0;
    // Length (10 pts) - 300-800 words is ideal
    if (wordCount >= 300 && wordCount <= 800) score += 10;
    else if (wordCount >= 200 && wordCount <= 1000) score += 7;
    else if (wordCount >= 100) score += 4;
    // Formatting (5 pts)
    score += text.includes("•") || text.includes("-") || text.includes("●") ? 5 : 2;

    score = Math.round(Math.min(100, score));

    // Generate improvements
    const improvements = [];
    if (!hasMetrics) improvements.push({ priority: "High", text: "Add quantifiable metrics to your achievements (e.g. 'Reduced load time by 40%', 'Managed $2M budget')" });
    if (verbsUsed.length < 5) improvements.push({ priority: "High", text: "Use more action verbs to start your bullet points (Developed, Architected, Optimized, Led, etc.)" });
    if (sectionsMissing.includes("Professional Summary")) improvements.push({ priority: "High", text: "Add a Professional Summary section at the top — recruiters spend 6 seconds scanning" });
    if (sectionsMissing.includes("Projects")) improvements.push({ priority: "Medium", text: "Add a Projects section to showcase hands-on work and technical depth" });
    if (sectionsMissing.includes("Certifications")) improvements.push({ priority: "Low", text: "Consider adding relevant certifications (AWS, Google, etc.) to boost credibility" });
    if (skillsFound.length < 5) improvements.push({ priority: "High", text: "List more technical skills — ATS systems scan for specific keywords" });
    if (wordCount < 200) improvements.push({ priority: "Medium", text: "Your resume seems short. Aim for 300-600 words for a strong 1-page resume" });
    if (wordCount > 1000) improvements.push({ priority: "Medium", text: "Your resume may be too long. Consider trimming to 1-2 pages for better readability" });
    if (!lower.includes("linkedin")) improvements.push({ priority: "Low", text: "Add your LinkedIn profile URL in the contact section" });
    if (!lower.includes("github") && skillsFound.some(s => ["react", "python", "javascript", "java", "node"].includes(s))) {
        improvements.push({ priority: "Medium", text: "Add a GitHub link to showcase your code — recruiters love seeing active repositories" });
    }

    // Job matching
    const jobMatches = JOB_DATABASE.map(job => {
        const matchedSkills = job.skills.filter(s => lower.includes(s));
        const matchPercent = Math.round((matchedSkills.length / job.skills.length) * 100);
        return { ...job, matchPercent, matchedSkills, missingSkills: job.skills.filter(s => !lower.includes(s)) };
    }).sort((a, b) => b.matchPercent - a.matchPercent);

    return {
        score,
        wordCount,
        sectionsFound,
        sectionsMissing,
        skillsFound,
        verbsUsed,
        hasMetrics,
        metricCount,
        improvements,
        jobMatches,
    };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedJob, setSelectedJob] = useState(null);
    const fileRef = useRef(null);
    const { saveResumeData } = useCareer();

    function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setSelectedFile(file);
        setResumeText(""); // clear manual text so file takes precedence
    }

    async function handleAnalyze() {
        if (!resumeText.trim() && !selectedFile) return;
        setAnalyzing(true);
        setAnalysis(null);
        setSelectedJob(null);

        try {
            let config = { headers: {} };
            let payload;

            if (selectedFile) {
                // Send raw binary file to backend for extraction
                payload = new FormData();
                payload.append('file', selectedFile);
                config.headers['Content-Type'] = 'multipart/form-data';
            } else {
                // Send manual text string
                payload = { text: resumeText };
            }

            const { data } = await axios.post(`${API_BASE}/api/resume/parse`, payload, config);
            const result = data.analysis;
            const extracted = data.textExtracted;
            
            // Re-hydrate the textarea with the beautiful extracted text!
            if (extracted) {
                setResumeText(extracted);
                setSelectedFile(null); // Clear file so next time it runs off the text box natively
            }
            
            // Re-shape backend response if needed to match frontend expectations
            const frontEndAnalysis = {
                score: result.score || 75,
                wordCount: result.wordCount || 0,
                sectionsFound: result.sectionsFound || [],
                sectionsMissing: result.sectionsMissing || [],
                skillsFound: result.skillsFound || [],
                verbsUsed: result.verbsUsed || [],
                hasMetrics: result.hasMetrics || false,
                metricCount: result.metricCount || 0,
                improvements: result.improvements || [],
                jobMatches: result.jobMatches || [],
            };

            setAnalysis(frontEndAnalysis);
            setActiveTab("overview");
            
            // Save to shared context so other features can use it
            saveResumeData(frontEndAnalysis.skillsFound, frontEndAnalysis.score, resumeText);
        } catch (error) {
            console.error("Analysis Error:", error);
            alert("Failed to analyze resume via AI API.");
        } finally {
            setAnalyzing(false);
        }
    }
    const getScoreLabel = (s) => {
        if (s >= 80) return { label: "Excellent", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
        if (s >= 60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
        if (s >= 40) return { label: "Needs Work", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
        return { label: "Weak", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "improvements", label: "Improvements", icon: "💡" },
        { id: "jobs", label: "Job Matches", icon: "🎯" },
        { id: "skills", label: "Skills Found", icon: "🏷️" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">🔬</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">Resume Analyzer</h1>
                    </div>
                    <p className="text-white/80 text-lg font-medium max-w-2xl">Upload your resume, get an instant score, see job matches, and get actionable suggestions to improve.</p>
                </div>
            </header>

            {/* Upload Section */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* File Upload */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 rounded-xl p-8 cursor-pointer transition group"
                    >
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📁</span>
                        <p className="text-sm font-bold text-blue-600">
                            {fileName || "Click to upload your resume"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">.txt, .doc, .pdf (text extraction)</p>
                        <input ref={fileRef} type="file" accept=".txt,.doc,.docx,.pdf,.rtf,.md" onChange={handleFile} className="hidden" />
                    </div>

                    {/* Or paste text */}
                    <div className="text-center text-slate-400 font-bold text-xs self-center px-2">OR</div>

                    <div className="flex-1">
                        <textarea
                            value={resumeText}
                            onChange={e => setResumeText(e.target.value)}
                            placeholder="Paste your resume text here..."
                            className="w-full h-full min-h-[140px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                        />
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={!resumeText.trim()}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                    {analysis ? "🔄 Re-Analyze Resume" : "🔬 Analyze My Resume"}
                </button>
            </div>

            {/* Results */}
            {analysis && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Score Banner */}
                    <div className={`${getScoreLabel(analysis.score).bg} border ${getScoreLabel(analysis.score).border} rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8`}>
                        {/* Donut */}
                        <div className="text-center shrink-0">
                            <div className="relative w-36 h-36 mx-auto">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="72" cy="72" r="62" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                                    <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" fill="none"
                                        className={getScoreLabel(analysis.score).color}
                                        strokeDasharray={389.6}
                                        strokeDashoffset={389.6 - (389.6 * analysis.score) / 100}
                                        strokeLinecap="round"
                                        style={{ transition: "stroke-dashoffset 1s ease" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-4xl font-black ${getScoreLabel(analysis.score).color}`}>{analysis.score}</span>
                                    <span className="text-xs font-bold text-slate-400">/ 100</span>
                                </div>
                            </div>
                            <p className={`text-sm font-bold mt-2 ${getScoreLabel(analysis.score).color}`}>{getScoreLabel(analysis.score).label}</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                            {[
                                { label: "Words", value: analysis.wordCount, icon: "📝" },
                                { label: "Skills", value: analysis.skillsFound.length, icon: "🏷️" },
                                { label: "Sections", value: `${analysis.sectionsFound.length}/${EXPECTED_SECTIONS.length}`, icon: "📋" },
                                { label: "Metrics", value: analysis.metricCount, icon: "📊" },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                                    <span className="text-lg">{stat.icon}</span>
                                    <p className="text-xl font-black text-slate-800">{stat.value}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex border-b border-slate-200/60 overflow-x-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
                                        activeTab === tab.id
                                            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                            : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    <span>{tab.icon}</span> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {/* Overview Tab */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    {/* Sections Found */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Sections Detected</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.sectionsFound.map(s => (
                                                <span key={s} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold">✓ {s}</span>
                                            ))}
                                            {analysis.sectionsMissing.map(s => (
                                                <span key={s} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full text-xs font-bold">✗ {s}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Verbs */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Action Verbs Used ({analysis.verbsUsed.length})</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.verbsUsed.map(v => (
                                                <span key={v} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold capitalize">{v}</span>
                                            ))}
                                            {analysis.verbsUsed.length === 0 && <p className="text-sm text-slate-400 italic">No strong action verbs detected. Start your bullets with verbs like "Developed", "Led", "Optimized".</p>}
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div className={`p-4 rounded-xl border ${analysis.hasMetrics ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}`}>
                                        <p className={`text-sm font-bold ${analysis.hasMetrics ? "text-blue-700" : "text-yellow-700"}`}>
                                            {analysis.hasMetrics
                                                ? `✅ Great! ${analysis.metricCount} quantifiable metric(s) found in your resume.`
                                                : "⚠️ No quantifiable metrics found. Resumes with numbers get 40% more interviews."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Improvements Tab */}
                            {activeTab === "improvements" && (
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-500 mb-4">{analysis.improvements.length} improvement suggestions based on your resume analysis.</p>
                                    {analysis.improvements.map((imp, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full h-fit shrink-0 ${
                                                imp.priority === "High" ? "bg-red-50 text-red-600 border border-red-200"
                                                    : imp.priority === "Medium" ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                                        : "bg-blue-50 text-blue-600 border border-blue-200"
                                            }`}>{imp.priority}</span>
                                            <p className="text-sm text-slate-700 font-medium">{imp.text}</p>
                                        </div>
                                    ))}
                                    {analysis.improvements.length === 0 && (
                                        <div className="text-center py-10">
                                            <span className="text-5xl block mb-3">🎉</span>
                                            <p className="text-lg font-bold text-blue-600">Your resume looks great!</p>
                                            <p className="text-sm text-slate-400">No major improvements needed.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Jobs Tab */}
                            {activeTab === "jobs" && (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500 mb-4">Your resume matched against {JOB_DATABASE.length} open positions. Click a job for detailed match analysis.</p>
                                    {analysis.jobMatches.map(job => (
                                        <div key={job.id}>
                                            <div
                                                onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                                                    selectedJob?.id === job.id ? "bg-blue-50 border-blue-300 shadow-md" : "bg-white border-slate-200 hover:border-blue-300"
                                                }`}
                                            >
                                                {/* Match Circle */}
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                                                    job.matchPercent >= 70 ? "bg-green-100 text-green-700 border-2 border-green-300"
                                                        : job.matchPercent >= 40 ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                                                            : "bg-slate-100 text-slate-500 border-2 border-slate-200"
                                                }`}>
                                                    {job.matchPercent}%
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-slate-800">{job.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                                        <span>{job.company}</span>
                                                        <span>•</span>
                                                        <span>{job.salary}</span>
                                                        <span>•</span>
                                                        <span>{job.type}</span>
                                                    </div>
                                                </div>

                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                    job.matchPercent >= 70 ? "bg-green-50 text-green-600 border border-green-200"
                                                        : job.matchPercent >= 40 ? "bg-blue-50 text-blue-600 border border-blue-200"
                                                            : "bg-slate-100 text-slate-500 border border-slate-200"
                                                }`}>
                                                    {job.matchPercent >= 70 ? "Strong Fit" : job.matchPercent >= 40 ? "Possible" : "Gap"}
                                                </span>
                                            </div>

                                            {/* Expanded Detail */}
                                            {selectedJob?.id === job.id && (
                                                <div className="mt-2 ml-4 p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                                                    <div>
                                                        <p className="text-xs font-bold text-blue-600 uppercase mb-2">Skills You Have ({job.matchedSkills.length})</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {job.matchedSkills.map(s => (
                                                                <span key={s} className="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold">✓ {s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-red-600 uppercase mb-2">Skills to Develop ({job.missingSkills.length})</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {job.missingSkills.map(s => (
                                                                <span key={s} className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">+ {s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-slate-500 italic">
                                                        {job.matchPercent >= 70
                                                            ? "🟢 Your resume is a strong match. Apply with confidence!"
                                                            : job.matchPercent >= 40
                                                                ? "🟡 You have a solid foundation. Add the missing skills to boost your chances."
                                                                : "🔴 Consider gaining more experience in this area before applying."}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === "skills" && (
                                <div>
                                    <p className="text-sm text-slate-500 mb-4">{analysis.skillsFound.length} technical skills detected in your resume.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.skillsFound.map(s => (
                                            <span key={s} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold capitalize">{s}</span>
                                        ))}
                                    </div>
                                    {analysis.skillsFound.length < 5 && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700 font-medium">
                                            ⚠️ Only {analysis.skillsFound.length} skills detected. Most competitive resumes list 8-15 relevant technical skills.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!analysis && !resumeText && (
                <div className="text-center py-16">
                    <span className="text-6xl mb-4 block">🔬</span>
                    <p className="text-lg font-bold text-slate-400">Upload or paste your resume to get started</p>
                    <p className="text-sm text-slate-400 mt-1">We'll score it, match it to jobs, and suggest improvements</p>
                </div>
            )}
        </div>
    );
}
