import { Link } from "react-router-dom";

export default function ResumeHome() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 font-['IBM_Plex_Mono',_monospace]">
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">📄</span>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Resume Engine</h1>
                </div>
                <p className="text-slate-400">Optimize, check, and tailor your resume with AI.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                <Link to="/resume/tailor-upload" className="block group">
                    <div className="bg-slate-900 border border-slate-800 group-hover:border-violet-500 rounded-2xl p-8 transition h-full flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute -right-10 -bottom-10 opacity-5 text-9xl group-hover:scale-110 transition-transform duration-500">🪄</div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition">1-Click Tailor</h2>
                            <p className="text-slate-400 text-sm">Upload your master resume PDF, paste a job description, and watch our AI instantly rewrite your bullets to perfectly match the role.</p>
                        </div>
                        <div className="mt-8 text-sm font-semibold text-violet-500 flex items-center gap-2">
                            Tailor Resume <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </Link>

                <Link to="/resume/ats-checker" className="block group">
                    <div className="bg-slate-900 border border-slate-800 group-hover:border-cyan-500 rounded-2xl p-8 transition h-full flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute -right-10 -bottom-10 opacity-5 text-9xl group-hover:scale-110 transition-transform duration-500">🔍</div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">ATS Match Checker</h2>
                            <p className="text-slate-400 text-sm">Instantly score your resume against any job posting. Identifies exact keyword gaps so you know exactly what recruiters are looking for.</p>
                        </div>
                        <div className="mt-8 text-sm font-semibold text-cyan-500 flex items-center gap-2">
                            Check ATS Score <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
