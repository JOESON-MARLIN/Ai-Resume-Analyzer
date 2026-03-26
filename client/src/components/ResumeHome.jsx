import { Link } from "react-router-dom";

export default function ResumeHome() {
    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-10">

            {/* Hero Header */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-14 text-center text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute left-0 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-x-10 translate-y-10"></div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 relative z-10 drop-shadow-md">Resume Engine</h1>
                <p className="text-white/80 font-medium text-lg max-w-2xl mx-auto relative z-10">
                    Build, optimize, and score your resume for any role
                </p>

                <div className="flex justify-center gap-4 mt-8 relative z-10">
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-5 py-2 text-sm font-bold text-white">
                        <span className="text-yellow-300">👥</span> 1,247+ Resumes
                    </div>
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-5 py-2 text-sm font-bold text-white">
                        <span className="text-yellow-300">📈</span> 34% ATS Boost
                    </div>
                </div>
            </section>

            {/* Choose Your Path Section */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Choose Your Path</h2>
                    <p className="text-slate-500">Select your preferred tool</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Path 1: Resume Builder */}
                    <Link to="/resume/builder" className="block group">
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:border-blue-400 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden h-full flex flex-col">
                            <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                                New
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">
                                    📄
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">Resume Builder</h3>
                            </div>

                            <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">
                                Enter your target job title and get role-specific skills, improvement tips, curated resources, and ATS-optimized templates.
                            </p>

                            <div className="mt-auto">
                                <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">How it works:</h4>
                                <ul className="space-y-2.5">
                                    {["Enter your target job title", "Get skills, tips & resources for the role", "Choose an ATS-optimized template"].map((step, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Link>

                    {/* Path 2: ATS Checker */}
                    <Link to="/resume/ats-checker" className="block group">
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:border-blue-400 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden h-full flex flex-col">
                            <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
                                Free Tool
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">
                                    ✓
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">ATS Match Checker</h3>
                            </div>

                            <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">
                                Instantly score your resume against any job posting. Identifies exact keyword gaps recruiters look for.
                            </p>

                            <div className="mt-auto">
                                <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">How it works:</h4>
                                <ul className="space-y-2.5">
                                    {["Paste Job Description Text", "Paste Resume Text", "See keyword overlaps and missing skills"].map((step, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
