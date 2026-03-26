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
        <div className="max-w-4xl mx-auto text-white space-y-8 font-['IBM_Plex_Mono',_monospace]">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">💼</span>
                    <h1 className="text-3xl font-bold tracking-tight">LinkedIn Optimizer</h1>
                </div>
                <p className="text-slate-400">Paste your current LinkedIn About section or full profile text. AI will rewrite it for maximum recruiter visibility.</p>
            </header>

            <form onSubmit={handleOptimize} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 block">Target Role</label>
                    <input 
                        required
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white"
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 block">Current Profile Text</label>
                    <textarea 
                        required
                        rows={6}
                        placeholder="Paste your current Headline, About section, and Experience here..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-sans"
                        value={profileText}
                        onChange={e => setProfileText(e.target.value)}
                    />
                </div>
                <button 
                    disabled={loading || !profileText.trim()}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
                >
                    {loading ? "Optimizing Profile..." : "Analyze & Optimize"}
                </button>
            </form>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-800/50 border border-violet-500/30 rounded-2xl p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Optimized Headline</h2>
                        <p className="text-xl font-bold text-white">{result.newHeadline}</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">The "About" Story</h2>
                        <div className="space-y-4 text-slate-300 font-sans leading-relaxed">
                            {result.aboutSection.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">SEO Skills to Add</h2>
                            <div className="flex flex-wrap gap-2">
                                {result.keySkillsToAdd.map(s => (
                                    <span key={s} className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-3 py-1 rounded-full text-xs">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Why We Made These Changes</h2>
                            <ul className="space-y-2">
                                {result.improvements.map((imp, i) => (
                                    <li key={i} className="text-sm text-slate-400 flex gap-2">
                                        <span className="text-violet-500">→</span> {imp}
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
