import { Link } from "react-router-dom";

export default function ResumeHome() {
    return (
        <div className="max-w-6xl mx-auto text-white space-y-12">
            
            {/* Hero Header Area */}
            <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative z-10">Resume Analyzer</h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto relative z-10">
                    AI-powered resume analysis and optimization
                </p>

                <div className="flex justify-center gap-6 mt-8 relative z-10">
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 text-sm text-slate-300">
                        <span className="text-emerald-400">👥</span> 1,247+ Resumes
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 text-sm text-slate-300">
                        <span className="text-emerald-400">📈</span> 34% ATS Improvement
                    </div>
                </div>
            </section>

            {/* Choose Your Path Section */}
            <section className="mt-16">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold mb-2">Choose Your Path</h2>
                    <p className="text-slate-400">Select your preferred option</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    
                    {/* Path 1 */}
                    <Link to="/resume/tailor-upload" className="block group">
                        <div className="bg-[#131823] border border-slate-800 rounded-2xl p-8 hover:border-[#3b82f6] transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden h-full flex flex-col">
                            <div className="absolute top-4 right-4 bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
                                Popular
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-xl border border-blue-500/20">
                                    ↑
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">Enhance Existing Resume</h3>
                            </div>
                            
                            <p className="text-sm text-slate-400 mb-8 font-sans">
                                Upload your current resume and get detailed analysis with AI-powered improvements against a Job Description.
                            </p>

                            <div className="mt-auto">
                                <h4 className="text-xs font-bold text-slate-100 mb-4 uppercase tracking-wider">How it works:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                        Upload your PDF resume
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                        Paste Target Job Description
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                        Receive tailored optimizations instantly
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Link>

                    {/* Path 2 */}
                    <Link to="/resume/ats-checker" className="block group">
                        <div className="bg-[#131823] border border-slate-800 rounded-2xl p-8 hover:border-emerald-500 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden h-full flex flex-col">
                            <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full">
                                Free Tool
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xl border border-emerald-500/20">
                                    ✓
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">ATS Match Checker</h3>
                            </div>
                            
                            <p className="text-sm text-slate-400 mb-8 font-sans">
                                Instantly score your resume against any job posting. Identifies exact keyword gaps recruiters are looking for.
                            </p>

                            <div className="mt-auto">
                                <h4 className="text-xs font-bold text-slate-100 mb-4 uppercase tracking-wider">How it works:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                                        Paste Job Description Text
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                                        Paste Resume Text
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                                        See exact keyword overlaps and missing skills
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Link>

                </div>
            </section>
        </div>
    );
}
