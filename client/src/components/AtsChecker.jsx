import { useState } from "react";

export default function AtsChecker() {
    const [resumeText, setResumeText] = useState("");
    const [jobText, setJobText] = useState("");
    const [score, setScore] = useState(null);
    const [missing, setMissing] = useState([]);
    const [matched, setMatched] = useState([]);
    const [checking, setChecking] = useState(false);

    function handleCheck() {
        if (!resumeText || !jobText) return;
        setChecking(true);
        
        setTimeout(() => {
            const jobWords = jobText.toLowerCase().match(/\b(\w{4,})\b/g) || [];
            const resWords = new Set((resumeText.toLowerCase().match(/\b(\w+)\b/g) || []));
            const stopWords = new Set(["with", "this", "that", "from", "your", "have", "more", "will", "also", "into", "been", "they", "does", "each", "which", "their", "about", "able", "work"]);
            const uniqueJobWords = [...new Set(jobWords)].filter(w => !stopWords.has(w));

            const matchedWords = uniqueJobWords.filter(w => resWords.has(w));
            const missingWords = uniqueJobWords.filter(w => !resWords.has(w));

            const calcScore = uniqueJobWords.length > 0
                ? Math.round((matchedWords.length / uniqueJobWords.length) * 100)
                : 0;

            setScore(calcScore);
            setMatched(matchedWords.slice(0, 20));
            setMissing(missingWords.slice(0, 20));
            setChecking(false);
        }, 600);
    }

    const getScoreColor = () => {
        if (score > 75) return { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", ring: "ring-blue-500", label: "Excellent Match" };
        if (score > 50) return { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", ring: "ring-blue-500", label: "Good Match" };
        return { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", ring: "ring-blue-500", label: "Needs Work" };
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-300 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">✓</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">ATS Keyword Checker</h1>
                    </div>
                    <p className="text-white/80 text-lg font-medium max-w-2xl">Instantly scan your resume against a job description to find missing keywords and boost your ATS score.</p>
                </div>
            </header>

            {/* Input Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <label className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 block flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-500 text-xs">📋</span>
                        Job Description
                    </label>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 h-52 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        placeholder="Paste the full job description here..."
                        value={jobText} onChange={e => setJobText(e.target.value)}
                    />
                    <p className="text-xs text-slate-400 mt-2">{jobText.split(/\s+/).filter(Boolean).length} words</p>
                </div>
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <label className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 block flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-500 text-xs">📄</span>
                        Your Resume Text
                    </label>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 h-52 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        placeholder="Paste your resume text here..."
                        value={resumeText} onChange={e => setResumeText(e.target.value)}
                    />
                    <p className="text-xs text-slate-400 mt-2">{resumeText.split(/\s+/).filter(Boolean).length} words</p>
                </div>
            </div>

            <button
                onClick={handleCheck}
                disabled={!resumeText || !jobText || checking}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-300 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 text-sm"
            >
                {checking ? "⏳ Scanning Keywords..." : "🔍 Scan Keywords"}
            </button>

            {/* Results */}
            {score !== null && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Score Card */}
                    <div className={`${getScoreColor().bg} border ${getScoreColor().border} rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8`}>
                        <div className="text-center shrink-0">
                            <div className="relative w-36 h-36 mx-auto">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="72" cy="72" r="62" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                                    <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" fill="none"
                                        className={getScoreColor().text}
                                        strokeDasharray={389.6}
                                        strokeDashoffset={389.6 - (389.6 * score) / 100}
                                        strokeLinecap="round"
                                        style={{ transition: "stroke-dashoffset 1s ease" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-4xl font-black ${getScoreColor().text}`}>{score}%</span>
                                    <span className="text-xs font-bold text-slate-400">ATS Match</span>
                                </div>
                            </div>
                            <p className={`text-sm font-bold mt-3 ${getScoreColor().text}`}>{getScoreColor().label}</p>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div className="flex gap-3 text-sm">
                                <div className="flex-1 bg-white rounded-xl p-4 border border-blue-100 text-center">
                                    <p className="text-2xl font-black text-blue-600">{matched.length}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Matched</p>
                                </div>
                                <div className="flex-1 bg-white rounded-xl p-4 border border-blue-100 text-center">
                                    <p className="text-2xl font-black text-blue-600">{missing.length}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Missing</p>
                                </div>
                                <div className="flex-1 bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-2xl font-black text-slate-600">{matched.length + missing.length}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Keywords Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Matched Keywords ({matched.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {matched.map(w => <span key={w} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold">✓ {w}</span>)}
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Missing Keywords ({missing.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {missing.map(w => <span key={w} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold">× {w}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
