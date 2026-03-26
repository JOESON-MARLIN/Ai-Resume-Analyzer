import { Link } from "react-router-dom";

export default function Dashboard() {
    const modules = [
        {
            title: "Resume Engine",
            description: "Revise your resume with focused, ATS-first AI tailoring.",
            path: "/resume",
            gradient: "from-blue-500/20 to-cyan-500/20",
            border: "border-blue-500/30",
            action: "Open Engine",
        },
        {
            title: "Job Tracker",
            description: "Manage applications with a Kanban board and real-time status updates.",
            path: "/jobs",
            gradient: "from-emerald-500/20 to-teal-500/20",
            border: "border-emerald-500/30",
            action: "Open Tracker",
        },
        {
            title: "LinkedIn Optimizer",
            description: "Rewrite your LinkedIn for maximum recruiter visibility.",
            path: "/linkedin",
            gradient: "from-violet-500/20 to-purple-500/20",
            border: "border-violet-500/30",
            action: "Open Optimizer",
        },
        {
            title: "Study Hub",
            description: "Practice FAANG interview tracks with guided concepts and real use-cases.",
            path: "/study",
            gradient: "from-rose-500/20 to-orange-500/20",
            border: "border-rose-500/30",
            action: "Open Hub",
        }
    ];

    return (
        <div className="text-white max-w-6xl mx-auto space-y-12">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Good evening, Guest</h1>
                    <p className="text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Ready to practice and improve your career toolkit?
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-500/20 transition">
                        <span>⭐</span> Starter
                    </button>
                    <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition">
                        <span>👑</span> Upgrade
                    </button>
                    <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition">
                        <span>👤</span> Profile
                    </button>
                </div>
            </header>

            <section>
                <h2 className="text-2xl font-bold mb-6">Career Toolkit</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {modules.map((mod) => (
                        <div key={mod.path} className="flex flex-col bg-[#131823] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition group">
                            {/* colored top half */}
                            <div className={`h-28 bg-gradient-to-br ${mod.gradient} relative overflow-hidden flex items-end p-6 border-b ${mod.border}`}>
                                <h3 className="text-xl font-bold text-white relative z-10">{mod.title}</h3>
                                {/* Abstract shape */}
                                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>
                            </div>
                            
                            {/* dark bottom half */}
                            <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                                <p className="text-sm text-slate-400 leading-relaxed font-sans">{mod.description}</p>
                                <Link to={mod.path} className="flex justify-between items-center group/btn text-sm font-semibold text-slate-300 hover:text-white transition w-full py-3 px-4 border border-slate-700 hover:border-slate-500 rounded-xl bg-slate-900/50">
                                    <span>{mod.action}</span>
                                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
                 {/* Progress paths */}
                 <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-6 hover:bg-slate-800/50 transition">
                    <h3 className="text-lg font-bold text-white mb-2">Interview Roadmap</h3>
                    <p className="text-sm text-slate-400 mb-6">90-day structured roadmap</p>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mb-4 border border-slate-700">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <Link to="/study" className="flex justify-between items-center text-sm font-semibold text-slate-300 py-3 px-4 border border-slate-700 rounded-xl hover:border-slate-500 transition">
                        <span>Continue Learning</span>
                        <span>→</span>
                    </Link>
                 </div>

                 <div className="bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 rounded-2xl p-6 hover:bg-slate-800/50 transition">
                    <h3 className="text-lg font-bold text-white mb-2">Application Pipeline</h3>
                    <p className="text-sm text-slate-400 mb-6">Active job applications and tracking</p>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mb-4 border border-slate-700">
                        <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                    <Link to="/jobs" className="flex justify-between items-center text-sm font-semibold text-slate-300 py-3 px-4 border border-slate-700 rounded-xl hover:border-slate-500 transition">
                        <span>View Pipeline</span>
                        <span>→</span>
                    </Link>
                 </div>
            </section>
        </div>
    );
}
