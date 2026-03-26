import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export default function LinkedInOptimizer() {
    const [profileText, setProfileText] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function handleOptimize(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const { data } = await axios.post(`${API_BASE}/api/linkedin/optimize`, {
                profileText,
                targetRole
            });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.error ?? err.message ?? "Optimization failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-300 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="text-4xl drop-shadow-md">💼</span>
                        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">LinkedIn Optimizer</h1>
                    </div>
                    <p className="text-white/80 font-medium text-lg max-w-2xl">Paste your LinkedIn profile text and AI will rewrite it for maximum recruiter visibility and SEO.</p>
                </div>
            </header>

            {/* Form */}
            <form onSubmit={handleOptimize} className="bg-white border border-slate-200/60 rounded-2xl p-8 space-y-6 shadow-sm hover:shadow-md transition">
                <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">Target Role</label>
                    <input 
                        required
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">Current Profile Text</label>
                    <textarea 
                        required
                        rows={6}
                        placeholder="Paste your current Headline, About section, and Experience here..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 font-sans focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                        value={profileText}
                        onChange={e => setProfileText(e.target.value)}
                    />
                </div>
                <button 
                    disabled={loading || !profileText.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-300 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20"
                >
                    {loading ? "⏳ Optimizing Profile..." : "🚀 Analyze & Optimize"}
                </button>
            </form>

            {error && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-sm font-medium">
                    ❌ {error}
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 rounded-2xl p-6">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Optimized Headline</h2>
                        <p className="text-xl font-bold text-slate-800">{result.newHeadline}</p>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">The "About" Story</h2>
                        <div className="space-y-3 text-slate-600 font-sans leading-relaxed text-sm">
                            {result.aboutSection.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">SEO Skills to Add</h2>
                            <div className="flex flex-wrap gap-2">
                                {result.keySkillsToAdd.map(s => (
                                    <span key={s} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Why We Made These Changes</h2>
                            <ul className="space-y-2">
                                {result.improvements.map((imp, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                                        <span className="text-blue-500">→</span> {imp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
