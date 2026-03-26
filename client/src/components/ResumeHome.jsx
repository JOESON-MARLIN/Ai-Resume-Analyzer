import { Link } from "react-router-dom";

export default function ResumeHome() {
    const tools = [
        { path: "/resume/builder", label: "Resume Builder", icon: "📄", badge: "Builder", desc: "Enter a job title, get role-specific skills, templates, and tips.", cta: "Build Resume" },
        { path: "/resume/analyzer", label: "Resume Analyzer", icon: "🔬", badge: "Analyzer", desc: "Upload your resume, get scored, see job matches, and improvements.", cta: "Analyze Resume" },
        { path: "/resume/rewriter", label: "AI Rewriter", icon: "✍️", badge: "AI", desc: "Paste weak bullets → get rewritten with metrics and impact framing.", cta: "Rewrite Bullets" },
        { path: "/resume/ats-checker", label: "ATS Checker", icon: "✓", badge: "Free", desc: "Score your resume against a job description and find keyword gaps.", cta: "Check ATS Score" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-10">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-14 text-center text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute left-0 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-x-10 translate-y-10"></div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 relative z-10 drop-shadow-md">Resume Engine</h1>
                <p className="text-white/80 font-medium text-lg max-w-2xl mx-auto relative z-10">4 powerful tools to build, analyze, rewrite, and optimize your resume.</p>
                <div className="flex justify-center gap-4 mt-8 relative z-10">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-5 py-2 text-sm font-bold text-white">
                        <span className="text-yellow-300">👥</span> 1,247+ Resumes
                    </div>
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-5 py-2 text-sm font-bold text-white">
                        <span className="text-yellow-300">📈</span> 34% ATS Boost
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Choose Your Tool</h2>
                    <p className="text-slate-500">Select the tool that fits your needs</p>
                </div>
                <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {tools.map(t => (
                        <Link key={t.path} to={t.path} className="block group">
                            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 hover:border-blue-400 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">{t.badge}</div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20 mb-4">{t.icon}</div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition mb-2">{t.label}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 flex-1">{t.desc}</p>
                                <div className="flex justify-between items-center text-sm font-bold text-blue-600 py-3 px-4 bg-blue-50 rounded-xl">
                                    <span>{t.cta}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
