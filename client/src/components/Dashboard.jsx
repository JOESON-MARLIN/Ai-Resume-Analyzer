import { Link } from "react-router-dom";

export default function Dashboard() {
    // Simulated analytics data
    const stats = {
        totalApps: 24,
        responses: 8,
        interviews: 5,
        offers: 2,
        responseRate: 33,
        interviewRate: 63,
        atsAvg: 78,
        resumesTailored: 6,
    };

    const weeklyData = [4, 7, 3, 8, 5, 6, 4]; // last 7 days
    const maxWeekly = Math.max(...weeklyData);

    const recommendations = [
        { type: "job", icon: "🎯", text: "3 new Senior React roles match your profile", link: "/search", action: "View Jobs" },
        { type: "skill", icon: "⚠️", text: "You're missing TypeScript — 72% of your target roles require it", link: "/resume/builder", action: "Fix Resume" },
        { type: "resume", icon: "📄", text: "Your resume scores 78% ATS — aim for 85%+ for top companies", link: "/resume/analyzer", action: "Analyze" },
        { type: "follow", icon: "⏰", text: "2 applications need follow-up this week", link: "/jobs", action: "View Tracker" },
    ];

    const modules = [
        { title: "Resume Engine", description: "Build, analyze, and optimize your resume for any role.", path: "/resume", gradient: "from-blue-600 to-blue-400", icon: "📄", stats: "3 tools inside", action: "Open Engine" },
        { title: "Job Search", description: "Search 15+ positions from Google, Meta, Netflix, OpenAI and more.", path: "/search", gradient: "from-blue-500 to-blue-400", icon: "🔍", stats: "15 open roles", action: "Search Jobs" },
        { title: "Job Tracker", description: "Kanban pipeline with notes, reminders, and analytics.", path: "/jobs", gradient: "from-blue-600 to-blue-400", icon: "📋", stats: `${stats.totalApps} tracked`, action: "Open Tracker" },
        { title: "LinkedIn Optimizer", description: "AI-powered headline and about section rewrite.", path: "/linkedin", gradient: "from-blue-500 to-blue-400", icon: "💼", stats: "AI-powered", action: "Optimize" },
        { title: "Study Hub", description: "System design, DSA, and PM interview preparation.", path: "/study", gradient: "from-blue-600 to-blue-400", icon: "📚", stats: "50+ cases", action: "Start Studying" },
        { title: "Profile", description: "Skills, experience, education — your career master file.", path: "/profile", gradient: "from-blue-500 to-blue-400", icon: "👤", stats: "78% complete", action: "Edit Profile" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Hero Welcome */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-20"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back 👋</h1>
                    <p className="text-white/80 text-lg font-medium max-w-xl">Your career command center. Track progress, find jobs, and level up your profile.</p>
                </div>
            </header>

            {/* Analytics Dashboard */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Applications", value: stats.totalApps, icon: "📤", sub: `${stats.responseRate}% response rate` },
                    { label: "Interviews", value: stats.interviews, icon: "🎙️", sub: `${stats.interviewRate}% conversion` },
                    { label: "Offers", value: stats.offers, icon: "🎉", sub: `from ${stats.interviews} interviews` },
                    { label: "ATS Score Avg", value: `${stats.atsAvg}%`, icon: "📊", sub: `${stats.resumesTailored} resumes tailored` },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200/60 hover:shadow-lg transition group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{s.icon}</span>
                            <span className="text-2xl font-black text-blue-600">{s.value}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{s.sub}</p>
                    </div>
                ))}
            </section>

            {/* Application Activity Chart + Recommendations */}
            <section className="grid md:grid-cols-2 gap-6">
                {/* Weekly Activity */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg transition">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs">📊</span>
                        Weekly Application Activity
                    </h3>
                    <div className="flex items-end gap-2 h-32">
                        {weeklyData.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                                    style={{ height: `${(val / maxWeekly) * 100}%`, minHeight: "8px" }}>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-3">{weeklyData.reduce((a, b) => a + b, 0)} total applications this week</p>
                </div>

                {/* Smart Recommendations */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg transition">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs">🧠</span>
                        Smart Recommendations
                    </h3>
                    <div className="space-y-3">
                        {recommendations.map((rec, i) => (
                            <Link key={i} to={rec.link} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-md transition group">
                                <span className="text-lg shrink-0">{rec.icon}</span>
                                <p className="text-xs font-medium text-slate-600 flex-1">{rec.text}</p>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-full shrink-0 group-hover:bg-blue-100 transition">{rec.action}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pipeline Progress */}
            <section className="bg-white border border-slate-200/60 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Application Pipeline</h3>
                <div className="flex gap-1 h-6 rounded-full overflow-hidden bg-slate-100">
                    <div className="bg-blue-400 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: "30%" }}>Saved</div>
                    <div className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: "28%" }}>Applied</div>
                    <div className="bg-blue-600 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: "20%" }}>Interview</div>
                    <div className="bg-green-500 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: "10%" }}>Offer</div>
                    <div className="bg-slate-400 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: "12%" }}>Closed</div>
                </div>
            </section>

            {/* Career Toolkit Grid */}
            <section>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Career Toolkit</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {modules.map((mod) => (
                        <Link key={mod.path} to={mod.path} className="group block">
                            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                                <div className={`h-28 bg-gradient-to-br ${mod.gradient} relative overflow-hidden flex items-end p-5`}>
                                    <div className="absolute right-3 top-3 text-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500">{mod.icon}</div>
                                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-white z-10 drop-shadow-md">{mod.title}</h3>
                                        <p className="text-white/70 text-xs font-semibold mt-0.5">{mod.stats}</p>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{mod.description}</p>
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-700 py-2.5 px-4 bg-slate-50 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                        <span>{mod.action}</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
