import { useState } from "react";

export default function AtsChecker() {
    const [resumeText, setResumeText] = useState("");
    const [jobText, setJobText] = useState("");
    const [score, setScore] = useState(null);
    const [missing, setMissing] = useState([]);
    const [matched, setMatched] = useState([]);

    function handleCheck() {
        if (!resumeText || !jobText) return;

        // Simple client-side mock keyword scanner for Hackathon
        const jobWords = jobText.toLowerCase().match(/\b(\w{4,})\b/g) || [];
        const resWords = new Set((resumeText.toLowerCase().match(/\b(\w+)\b/g) || []));

        // Filter out common stop words
        const stopWords = new Set(["with", "this", "that", "from", "your", "have", "more", "will"]);
        const uniqueJobWords = [...new Set(jobWords)].filter(w => !stopWords.has(w));

        const matchedWords = uniqueJobWords.filter(w => resWords.has(w));
        const missingWords = uniqueJobWords.filter(w => !resWords.has(w));

        const calcScore = uniqueJobWords.length > 0
            ? Math.round((matchedWords.length / uniqueJobWords.length) * 100)
            : 0;

        setScore(calcScore);
        setMatched(matchedWords.slice(0, 15));
        setMissing(missingWords.slice(0, 15));
    }

    return (
        <div className="text-white space-y-6 max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">ATS Keyword Checker</h1>
                <p className="text-slate-400">Instantly scan your resume against a job description to find missing keywords.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 block">Job Description</label>
                    <textarea 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white h-48"
                        placeholder="Paste Job Description here..."
                        value={jobText} onChange={e => setJobText(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 block">Your Resume Text</label>
                    <textarea 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white h-48"
                        placeholder="Paste your Resume text here..."
                        value={resumeText} onChange={e => setResumeText(e.target.value)}
                    />
                </div>
            </div>

            <button 
                onClick={handleCheck}
                disabled={!resumeText || !jobText}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition"
            >
                Scan Keywords
            </button>

            {score !== null && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mt-8 grid md:grid-cols-[200px_1fr] gap-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-center">
                        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">ATS Match</div>
                        <div className="relative w-32 h-32 mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-800" />
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none"
                                    className={score > 75 ? "text-emerald-500" : score > 50 ? "text-amber-500" : "text-rose-500"}
                                    strokeDasharray={351.8}
                                    strokeDashoffset={351.8 - (351.8 * score) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-black">
                                {score}%
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Matched Keywords ({matched.length})</h3>
                            <div className="flex flex-wrap gap-2">
                                {matched.map(w => <span key={w} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-1 rounded text-xs">{w}</span>)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3">Missing Keywords ({missing.length})</h3>
                            <div className="flex flex-wrap gap-2">
                                {missing.map(w => <span key={w} className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-1 rounded text-xs">{w}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
