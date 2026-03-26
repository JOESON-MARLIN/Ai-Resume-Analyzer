import { useState } from "react";

const ROLE_DATA = {
    "Frontend Engineer": {
        skills: ["React", "TypeScript", "CSS Architecture", "Webpack/Vite", "REST APIs", "Testing (Jest/Cypress)", "Git", "Responsive Design"],
        sections: ["Professional Summary", "Technical Skills", "Work Experience", "Projects", "Education"],
        tips: [
            "Lead every bullet with a measurable impact (e.g. 'Reduced load time by 40%')",
            "Highlight component libraries you've built or contributed to",
            "Mention cross-browser compatibility and accessibility (a11y) experience",
            "Include bundle size optimizations and performance metrics",
            "Show collaboration with designers using Figma/Sketch"
        ],
        resources: [
            { name: "React Official Docs", url: "https://react.dev", type: "Documentation" },
            { name: "Frontend Interview Handbook", url: "https://frontendinterviewhandbook.com", type: "Interview Prep" },
            { name: "web.dev Performance Guide", url: "https://web.dev/performance", type: "Skills" },
            { name: "CSS Tricks", url: "https://css-tricks.com", type: "Reference" },
        ],
        templates: [
            { name: "Clean Technical", style: "Minimalist single-column with bold section headers. Best for ATS.", color: "bg-blue-600", match: "95%" },
            { name: "Modern Two-Column", style: "Skills sidebar + experience main. Great for mid-senior roles.", color: "bg-blue-500", match: "88%" },
            { name: "Portfolio Hybrid", style: "Includes project screenshots section. Best for creative roles.", color: "bg-blue-400", match: "75%" },
        ]
    },
    "Software Engineer": {
        skills: ["Python", "Java", "System Design", "Data Structures", "REST/GraphQL APIs", "SQL/NoSQL", "Docker", "CI/CD", "Git"],
        sections: ["Professional Summary", "Technical Skills", "Work Experience", "System Design Projects", "Education", "Certifications"],
        tips: [
            "Quantify your system's scale (e.g. 'Served 10M+ daily requests')",
            "Mention design patterns and architectural decisions you've made",
            "Highlight code review practices and mentorship",
            "Include latency improvements, uptime metrics, or cost savings",
            "Show distributed systems experience (microservices, message queues)"
        ],
        resources: [
            { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "System Design" },
            { name: "LeetCode", url: "https://leetcode.com", type: "DSA Practice" },
            { name: "Designing Data-Intensive Applications", url: "https://dataintensive.net", type: "Book" },
            { name: "Tech Interview Handbook", url: "https://techinterviewhandbook.org", type: "Interview Prep" },
        ],
        templates: [
            { name: "Engineering Classic", style: "ATS-optimized, single-column, experience-first layout.", color: "bg-blue-600", match: "97%" },
            { name: "Technical Deep-Dive", style: "Extended skills matrix with proficiency levels.", color: "bg-blue-500", match: "90%" },
            { name: "FAANG Optimized", style: "Impact-driven bullets, concise 1-page format.", color: "bg-blue-400", match: "85%" },
        ]
    },
    "Data Scientist": {
        skills: ["Python", "R", "SQL", "TensorFlow/PyTorch", "Pandas/NumPy", "Statistics", "A/B Testing", "Data Visualization", "ML Pipelines"],
        sections: ["Professional Summary", "Technical Skills", "Work Experience", "Research & Publications", "Projects", "Education"],
        tips: [
            "Highlight model performance metrics (AUC, F1, accuracy improvements)",
            "Show business impact of your models (revenue, cost savings, efficiency)",
            "Mention experiment design and A/B testing frameworks",
            "Include data pipeline scale (TB/PB of data processed)",
            "Reference published papers or Kaggle competitions"
        ],
        resources: [
            { name: "Kaggle", url: "https://kaggle.com", type: "Practice" },
            { name: "Towards Data Science", url: "https://towardsdatascience.com", type: "Articles" },
            { name: "fast.ai", url: "https://fast.ai", type: "Courses" },
            { name: "Papers With Code", url: "https://paperswithcode.com", type: "Research" },
        ],
        templates: [
            { name: "Research-Driven", style: "Publications section prominent, skills matrix included.", color: "bg-blue-600", match: "93%" },
            { name: "Industry DS", style: "Business impact focus with metrics-heavy bullets.", color: "bg-blue-500", match: "90%" },
            { name: "ML Engineer Hybrid", style: "Blends engineering and research for ML-heavy roles.", color: "bg-blue-400", match: "82%" },
        ]
    },
    "Product Manager": {
        skills: ["Product Strategy", "User Research", "A/B Testing", "SQL", "Jira/Asana", "Roadmap Planning", "Stakeholder Management", "Data Analysis"],
        sections: ["Professional Summary", "Core Competencies", "Work Experience", "Key Projects & Impact", "Education", "Certifications"],
        tips: [
            "Lead with business metrics (revenue growth, user acquisition, retention)",
            "Show cross-functional leadership and team sizes managed",
            "Highlight data-driven decision making with specific examples",
            "Mention product launches and their market impact",
            "Include customer research methodologies used"
        ],
        resources: [
            { name: "Lenny's Newsletter", url: "https://lennysnewsletter.com", type: "Industry" },
            { name: "Product School", url: "https://productschool.com", type: "Courses" },
            { name: "Cracking the PM Interview", url: "https://amazon.com", type: "Book" },
            { name: "Reforge", url: "https://reforge.com", type: "Advanced" },
        ],
        templates: [
            { name: "Strategy-First", style: "Impact metrics prominent, clean executive layout.", color: "bg-blue-600", match: "95%" },
            { name: "Technical PM", style: "Balances technical skills with product leadership.", color: "bg-blue-500", match: "88%" },
            { name: "Growth PM", style: "Focused on growth metrics, experiments, and funnels.", color: "bg-blue-400", match: "80%" },
        ]
    },
};

const ALL_ROLES = Object.keys(ROLE_DATA);

export default function ResumeBuilder() {
    const [jobTitle, setJobTitle] = useState("");
    const [selectedRole, setSelectedRole] = useState(null);
    const [activeTab, setActiveTab] = useState("skills");
    const [checkedSkills, setCheckedSkills] = useState(new Set());

    function handleAnalyze() {
        const match = ALL_ROLES.find(r => r.toLowerCase().includes(jobTitle.toLowerCase()));
        setSelectedRole(match || "Software Engineer");
        setActiveTab("skills");
        setCheckedSkills(new Set());
    }

    function toggleSkill(skill) {
        setCheckedSkills(prev => {
            const next = new Set(prev);
            next.has(skill) ? next.delete(skill) : next.add(skill);
            return next;
        });
    }

    const data = selectedRole ? ROLE_DATA[selectedRole] : null;
    const tabs = [
        { id: "skills", label: "Skills to Add", icon: "🏷️" },
        { id: "tips", label: "Improvement Tips", icon: "💡" },
        { id: "resources", label: "Resources", icon: "📚" },
        { id: "templates", label: "Templates", icon: "📋" },
        { id: "structure", label: "Resume Structure", icon: "📐" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">📄</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">Resume Builder</h1>
                    </div>
                    <p className="text-white/80 text-lg font-medium max-w-2xl">Enter your target job title and get tailored skills, improvement suggestions, resources, and best-fit templates.</p>
                </div>
            </header>

            {/* Job Title Input */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-lg">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 block">What role are you targeting?</label>
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={jobTitle}
                            onChange={e => setJobTitle(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                            placeholder="e.g. Frontend Engineer, Data Scientist, Product Manager..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none pr-24"
                            list="role-suggestions"
                        />
                        <datalist id="role-suggestions">
                            {ALL_ROLES.map(r => <option key={r} value={r} />)}
                        </datalist>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={!jobTitle.trim()}
                        className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 whitespace-nowrap"
                    >
                        Analyze Role →
                    </button>
                </div>
                {/* Quick select chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {ALL_ROLES.map(role => (
                        <button
                            key={role}
                            onClick={() => { setJobTitle(role); setSelectedRole(role); setActiveTab("skills"); setCheckedSkills(new Set()); }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                                selectedRole === role
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                            }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {data && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Role Match Header */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">✓</div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Optimizing for: <span className="text-blue-600">{selectedRole}</span></h2>
                            <p className="text-sm text-slate-500">{data.skills.length} key skills · {data.tips.length} improvement tips · {data.templates.length} templates</p>
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
                            {/* Skills Tab */}
                            {activeTab === "skills" && (
                                <div>
                                    <p className="text-sm text-slate-500 mb-4">Check off the skills you already have. Missing skills will be highlighted for you to develop.</p>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {data.skills.map(skill => (
                                            <label key={skill} onClick={() => toggleSkill(skill)} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition group ${
                                                checkedSkills.has(skill) ? "bg-blue-50 border-blue-300" : "bg-slate-50 border-slate-200 hover:border-blue-300"
                                            }`}>
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                                                    checkedSkills.has(skill) ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                                                }`}>
                                                    {checkedSkills.has(skill) && <span className="text-xs">✓</span>}
                                                </div>
                                                <span className={`text-sm font-semibold ${checkedSkills.has(skill) ? "text-blue-700" : "text-slate-700"}`}>{skill}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 font-medium">
                                        ✅ {checkedSkills.size} / {data.skills.length} skills covered — {checkedSkills.size === data.skills.length ? "Amazing! You're a perfect fit!" : `Add ${data.skills.length - checkedSkills.size} more skills to maximize your ATS score.`}
                                    </div>
                                </div>
                            )}

                            {/* Tips Tab */}
                            {activeTab === "tips" && (
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-500 mb-4">Follow these tips to make your resume stand out for {selectedRole} roles.</p>
                                    {data.tips.map((tip, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 transition group">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">{i+1}</div>
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Resources Tab */}
                            {activeTab === "resources" && (
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-500 mb-4">Curated learning resources to strengthen your profile for {selectedRole} positions.</p>
                                    {data.resources.map((res, i) => (
                                        <a key={i} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-lg">📎</div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">{res.name}</h4>
                                                    <p className="text-xs text-slate-400">{res.url}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shrink-0">{res.type}</span>
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Templates Tab */}
                            {activeTab === "templates" && (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500 mb-4">Recommended resume templates for {selectedRole}. Sorted by ATS compatibility.</p>
                                    {data.templates.map((tmpl, i) => (
                                        <div key={i} className="flex items-center gap-5 p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition group">
                                            <div className={`w-16 h-20 rounded-lg ${tmpl.color} shadow-md flex items-center justify-center text-white text-xs font-bold`}>
                                                <div className="space-y-1 p-2">
                                                    <div className="w-8 h-1 bg-white/60 rounded"></div>
                                                    <div className="w-10 h-1 bg-white/40 rounded"></div>
                                                    <div className="w-6 h-1 bg-white/60 rounded"></div>
                                                    <div className="w-10 h-1 bg-white/30 rounded"></div>
                                                    <div className="w-8 h-1 bg-white/40 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition">{tmpl.name}</h4>
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">{tmpl.match} ATS Match</span>
                                                </div>
                                                <p className="text-sm text-slate-500">{tmpl.style}</p>
                                            </div>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shrink-0">
                                                Use Template
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Structure Tab */}
                            {activeTab === "structure" && (
                                <div>
                                    <p className="text-sm text-slate-500 mb-4">Recommended resume sections in order for {selectedRole} roles.</p>
                                    <div className="space-y-2">
                                        {data.sections.map((section, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md">{i+1}</div>
                                                <span className="text-sm font-bold text-slate-700">{section}</span>
                                                {i === 0 && <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">Most Important</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!data && (
                <div className="text-center py-20">
                    <span className="text-6xl mb-4 block">📄</span>
                    <p className="text-lg font-bold text-slate-400">Enter your target job title above</p>
                    <p className="text-sm text-slate-400 mt-1">We'll generate tailored skills, tips, resources, and templates for your role</p>
                </div>
            )}
        </div>
    );
}
