import { Link } from "react-router-dom";

export default function Dashboard() {
    const modules = [
        {
            title: "Resume Engine",
            description: "Revise your resume with focused, ATS-first AI tailoring against any job description.",
            path: "/resume",
            gradient: "from-blue-600 to-blue-300",
            icon: "📄",
            stats: "1,247+ resumes analyzed",
            action: "Open Engine",
        },
        {
            title: "Job Tracker",
            description: "Manage applications with a Kanban board, status updates and analytics.",
            path: "/jobs",
            gradient: "from-blue-500 to-blue-300",
            icon: "📋",
            stats: "Track unlimited jobs",
            action: "Open Tracker",
        },
        {
            title: "LinkedIn Optimizer",
            description: "Rewrite your LinkedIn headline and about section for maximum recruiter visibility.",
            path: "/linkedin",
            gradient: "from-blue-600 to-blue-300",
            icon: "💼",
            stats: "AI-powered rewrite",
            action: "Open Optimizer",
        },
        {
            title: "Study Hub",
            description: "Practice FAANG interview tracks with guided concepts, system design and real cases.",
            path: "/study",
            gradient: "from-blue-500 to-blue-400",
            icon: "📚",
            stats: "50+ mock cases",
            action: "Open Hub",
        }
    ];

    const quickStats = [
        { label: "Resumes Tailored", value: "3", color: "text-blue-600", bg: "bg-blue-50", icon: "📄" },
        { label: "Jobs Tracked", value: "12", color: "text-blue-600", bg: "bg-blue-50", icon: "📋" },
        { label: "ATS Score Avg", value: "78%", color: "text-blue-600", bg: "bg-blue-50", icon: "📈" },
        { label: "Study Progress", value: "15%", color: "text-blue-600", bg: "bg-blue-50", icon: "📚" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Hero Welcome */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-300 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back, Hacker 👋</h1>
                    <p className="text-white/80 text-lg font-medium max-w-xl">Your career toolkit is ready. Pick up where you left off or explore a new module.</p>
                </div>
            </header>

            {/* Quick Stats Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat) => (
                    <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-current/5 group hover:shadow-lg transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* Career Toolkit Grid */}
            <section>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Career Toolkit</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {modules.map((mod) => (
                        <Link key={mod.path} to={mod.path} className="group block">
                            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                                {/* Gradient top */}
                                <div className={`h-36 bg-gradient-to-br ${mod.gradient} relative overflow-hidden flex items-end p-6`}>
                                    <div className="absolute right-4 top-4 text-4xl opacity-30 group-hover:opacity-60 transition-opacity duration-500">{mod.icon}</div>
                                    <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-3xl translate-x-12 -translate-y-12 group-hover:scale-125 transition-transform duration-700"></div>
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-white relative z-10 drop-shadow-md">{mod.title}</h3>
                                        <p className="text-white/70 text-xs font-semibold mt-1">{mod.stats}</p>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                                    <p className="text-slate-500 text-[14px] font-medium leading-relaxed">{mod.description}</p>
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-700 py-3 px-5 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition">
                                        <span>{mod.action}</span>
                                        <span className="group-hover:translate-x-2 transition-transform duration-300 text-lg">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Progress Section */}
            <section className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-lg transition group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-300 flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/20">📖</div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-800">Interview Roadmap</h3>
                            <p className="text-xs text-slate-400 font-medium">90-day structured plan</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-300 h-full rounded-full w-[15%] group-hover:w-[20%] transition-all duration-700 shadow-inner"></div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">15% complete · 3 of 20 topics covered</p>
                    <Link to="/study" className="flex justify-between items-center text-sm font-bold text-blue-600 py-3 px-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                        <span>Continue Learning</span>
                        <span>→</span>
                    </Link>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-3xl p-8 hover:shadow-lg transition group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/20">📊</div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-800">Application Pipeline</h3>
                            <p className="text-xs text-slate-400 font-medium">Active job tracking</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-300 h-full rounded-full w-[40%] group-hover:w-[45%] transition-all duration-700 shadow-inner"></div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">40% pipeline filled · 5 active applications</p>
                    <Link to="/jobs" className="flex justify-between items-center text-sm font-bold text-blue-600 py-3 px-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                        <span>View Pipeline</span>
                        <span>→</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
