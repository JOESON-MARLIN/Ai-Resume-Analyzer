import { Link } from "react-router-dom";
import { useCareer } from "../CareerContext.jsx";

export default function Dashboard() {
    const { hasResume, resumeScore, getJobMatches, getSkillGaps, getReadinessScore } = useCareer();

    // Simulated analytics data
    const stats = {
        totalApps: 24,
        responses: 8,
        interviews: 5,
        offers: 2,
        responseRate: 33,
        interviewRate: 63,
        atsAvg: hasResume ? resumeScore : 0,
        resumesTailored: hasResume ? 1 : 0,
    };

    const weeklyData = [4, 7, 3, 8, 5, 6, 4]; // last 7 days
    const maxWeekly = Math.max(...weeklyData);

    const jobMatches = hasResume ? getJobMatches().slice(0, 2) : [];
    const skillGaps = hasResume ? getSkillGaps().slice(0, 2) : [];
    const readinessScore = hasResume ? getReadinessScore() : 0;

    const modules = [
        { title: "Resume Engine", description: "Build, analyze, and optimize your resume for any role.", path: "/resume", gradient: "from-blue-600 to-blue-400", icon: "📄", stats: "4 tools inside", action: "Open Engine" },
        { title: "Job Search", description: "Search positions and see your resume match score.", path: "/search", gradient: "from-blue-500 to-blue-400", icon: "🔍", stats: "15 open roles", action: "Search Jobs" },
        { title: "Job Tracker", description: "Kanban pipeline with notes, reminders, and analytics.", path: "/jobs", gradient: "from-blue-600 to-blue-400", icon: "📋", stats: `${stats.totalApps} tracked`, action: "Open Tracker" },
        { title: "LinkedIn Optimizer", description: "AI-powered headline and about section rewrite.", path: "/linkedin", gradient: "from-blue-500 to-blue-400", icon: "💼", stats: "AI-powered", action: "Optimize" },
        { title: "Study Hub", description: "Learning resources to fill your missing skill gaps.", path: "/study", gradient: "from-blue-600 to-blue-400", icon: "📚", stats: hasResume ? `${skillGaps.length} gaps found` : "Prep Resources", action: "Start Studying" },
        { title: "Profile", description: "Skills, experience, education — your career master file.", path: "/profile", gradient: "from-blue-500 to-blue-400", icon: "👤", stats: "78% complete", action: "Edit Profile" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Hero Welcome with Readiness Score */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-20"></div>
                
                <div className="relative z-10 flex-1">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back 👋</h1>
                    <p className="text-white/80 text-lg font-medium max-w-xl">Your career command center. Track progress, find jobs, and level up your profile.</p>
                </div>

                {hasResume && (
                    <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-5 shrink-0">
                        <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-xl font-black drop-shadow-md bg-blue-500/50">
                            {readinessScore}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">Overall Readiness</h3>
                            <p className="text-xs text-white/80 max-w-[150px]">
                                {readinessScore >= 80 ? "You're heavily matched for target roles!" :
                                 readinessScore >= 60 ? "Solid foundation, but some skill gaps exist." :
                                 "Needs work. Check your skill gaps."}
                            </p>
                        </div>
                    </div>
                )}
            </header>

            {/* Smart Intelligence Panel (Only shows if resume is loaded) */}
            {hasResume ? (
                <section className="bg-white border text-left border-blue-200 rounded-2xl p-6 shadow-md shadow-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🧠</div>
                    <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="text-blue-600">⚡</span> Smart Intelligence Link
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Top Matches */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b pb-2">Top Job Matches For You</h3>
                            <div className="space-y-3">
                                {jobMatches.map(job => (
                                    <Link to="/search" key={job.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition group">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition">
                                            {job.matchPct}%
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700">{job.title} <span className="text-slate-400 font-normal">at</span> {job.company}</h4>
                                            <p className="text-xs text-slate-500">{job.location} • {job.salary}</p>
                                        </div>
                                    </Link>
                                ))}
                                {jobMatches.length === 0 && <p className="text-sm text-slate-400 italic">No strong matches found yet.</p>}
                            </div>
                        </div>

                        {/* Skill Gaps */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b pb-2">Priority Skill Gaps To Fill</h3>
                            <div className="space-y-3">
                                {skillGaps.map(gap => (
                                    <div key={gap.skill} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 capitalize">{gap.skill}</h4>
                                            <p className="text-[10px] text-red-500 font-medium tracking-wide">Missing in {gap.demandCount} of your target jobs</p>
                                        </div>
                                        {gap.course ? (
                                            <Link to="/study" className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition">
                                                Learn Now
                                            </Link>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">No course</span>
                                        )}
                                    </div>
                                ))}
                                {skillGaps.length === 0 && <p className="text-sm text-slate-400 italic">No major skill gaps found!</p>}
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center group hover:bg-slate-100 transition">
                    <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">🧠</span>
                    <h2 className="text-lg font-bold text-slate-800">Unlock Smart Intelligence</h2>
                    <p className="text-sm text-slate-500 mt-1 mb-4">Upload your resume to see personalized job matches, skill gaps, and a career readiness score.</p>
                    <Link to="/resume/analyzer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20">
                        Analyze Resume Now
                    </Link>
                </section>
            )}

            {/* Application Activity Chart */}
            <section className="grid md:grid-cols-3 gap-6">
                {/* Weekly Activity */}
                <div className="md:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg transition">
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
                
                {/* Quick Analytics */}
                <div className="grid grid-rows-2 gap-4">
                     <div className="bg-white rounded-2xl p-5 border border-slate-200/60 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interview Rate</p>
                            <span className="text-3xl font-black text-blue-600">{stats.interviewRate}%</span>
                        </div>
                        <span className="text-4xl opacity-50">🎙️</span>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/60 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Avg</p>
                            <span className="text-3xl font-black text-blue-600">{stats.atsAvg ? `${stats.atsAvg}%` : '-'}</span>
                        </div>
                        <span className="text-4xl opacity-50">🤖</span>
                    </div>
                </div>
            </section>

            {/* Pipeline Progress */}
            <section className="bg-white border border-slate-200/60 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Application Pipeline</h3>
                <div className="flex gap-1 h-6 rounded-full overflow-hidden bg-slate-100">
                    <div className="bg-blue-400 h-full flex items-center justify-center text-[10px] font-bold text-white hover:opacity-80 transition cursor-pointer" style={{ width: "30%" }}>Saved</div>
                    <div className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-bold text-white hover:opacity-80 transition cursor-pointer" style={{ width: "28%" }}>Applied</div>
                    <div className="bg-blue-600 h-full flex items-center justify-center text-[10px] font-bold text-white hover:opacity-80 transition cursor-pointer" style={{ width: "20%" }}>Interview</div>
                    <div className="bg-green-500 h-full flex items-center justify-center text-[10px] font-bold text-white hover:opacity-80 transition cursor-pointer" style={{ width: "10%" }}>Offer</div>
                    <div className="bg-slate-400 h-full flex items-center justify-center text-[10px] font-bold text-white hover:opacity-80 transition cursor-pointer" style={{ width: "12%" }}>Closed</div>
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
