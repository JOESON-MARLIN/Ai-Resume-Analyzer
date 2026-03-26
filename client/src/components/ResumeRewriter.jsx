import { useState } from "react";

const REWRITE_TEMPLATES = {
    "metrics": (bullet) => {
        const verbs = ["Developed", "Built", "Designed", "Implemented", "Architected", "Launched", "Led", "Managed", "Optimized", "Streamlined"];
        const metrics = ["reducing costs by 35%", "improving performance by 40%", "increasing user engagement by 60%", "saving 15+ engineering hours weekly", "serving 2M+ daily active users", "achieving 99.9% uptime", "reducing load time by 50%"];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const cleaned = bullet.replace(/^[-•]\s*/, "").trim();
        if (cleaned.match(/\d+%|\d+x|\$\d+/)) return cleaned;
        return `${verb} ${cleaned.toLowerCase()}, ${metric}`;
    },
    "impact": (bullet) => {
        const cleaned = bullet.replace(/^[-•]\s*/, "").trim();
        const impacts = [
            `Spearheaded initiative to ${cleaned.toLowerCase()}, directly impacting team velocity and product delivery timelines`,
            `Championed ${cleaned.toLowerCase()}, resulting in measurable improvements to team productivity and code quality`,
            `Drove ${cleaned.toLowerCase()}, aligning cross-functional stakeholders and exceeding quarterly OKR targets`,
        ];
        return impacts[Math.floor(Math.random() * impacts.length)];
    },
    "concise": (bullet) => {
        const cleaned = bullet.replace(/^[-•]\s*/, "").trim();
        const words = cleaned.split(" ");
        if (words.length <= 8) return cleaned;
        // Shorten by keeping first ~10 words and adding metric
        const short = words.slice(0, Math.min(10, words.length)).join(" ");
        return `${short}, boosting efficiency by 25%`;
    }
};

export default function ResumeRewriter() {
    const [bullets, setBullets] = useState("");
    const [rewriteStyle, setRewriteStyle] = useState("metrics");
    const [results, setResults] = useState([]);
    const [selectedResults, setSelectedResults] = useState(new Set());
    const [loading, setLoading] = useState(false);

    async function handleRewrite() {
        if (!bullets.trim()) return;
        setLoading(true);

        try {
            const { data } = await axios.post(`${API_BASE}/api/resume/rewrite`, {
                bullets: bullets,
                style: rewriteStyle
            });
            // Assuming data.results is an array of { original, rewritten, alt }
            const rewritten = data.results.map((item, i) => ({
                id: i,
                original: item.original,
                rewritten: item.rewritten,
                alt: item.alt,
            }));
            setResults(rewritten);
            setSelectedResults(new Set());
        } catch (error) {
            console.error("Rewrite Error:", error);
            // Fallback for simple error state
            setResults([{
                id: 0,
                original: bullets,
                rewritten: "Server error occurred during AI rewrite.",
                alt: "Please ensure backend is running or check API keys."
            }]);
            setSelectedResults(new Set());
        } finally {
            setLoading(false);
        }
    }

    function toggleSelect(id) {
        setSelectedResults(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function copySelected() {
        const text = results
            .filter(r => selectedResults.has(r.id))
            .map(r => `• ${r.rewritten}`)
            .join("\n");
        navigator.clipboard.writeText(text);
    }

    const styles = [
        { id: "metrics", label: "Add Metrics", icon: "📊", desc: "Quantify achievements with numbers and percentages" },
        { id: "impact", label: "Impact-Driven", icon: "🎯", desc: "Rewrite to emphasize business impact and leadership" },
        { id: "concise", label: "Make Concise", icon: "✂️", desc: "Shorten verbose bullets while keeping key info" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">✍️</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">AI Resume Rewriter</h1>
                    </div>
                    <p className="text-white/80 text-lg font-medium max-w-2xl">Paste your resume bullets and get AI-powered rewrites with metrics, impact framing, and concise formatting.</p>
                </div>
            </header>

            {/* Input Section */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-lg space-y-4">
                <div>
                    <label className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">Paste your resume bullets (one per line)</label>
                    <textarea
                        value={bullets}
                        onChange={e => setBullets(e.target.value)}
                        rows={8}
                        placeholder={`- Built a web application using React\n- Worked on backend APIs\n- Helped the team with code reviews\n- Created unit tests for the project\n- Managed database migrations`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                    />
                    <p className="text-xs text-slate-400 mt-1">{bullets.split("\n").filter(l => l.trim().length > 5).length} bullet points detected</p>
                </div>

                {/* Style Selection */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Rewrite Style</label>
                    <div className="grid grid-cols-3 gap-3">
                        {styles.map(s => (
                            <button key={s.id} onClick={() => setRewriteStyle(s.id)}
                                className={`p-4 rounded-xl border text-left transition ${
                                    rewriteStyle === s.id
                                        ? "bg-blue-50 border-blue-300 shadow-md"
                                        : "bg-white border-slate-200 hover:border-blue-300"
                                }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{s.icon}</span>
                                    <span className="text-sm font-bold text-slate-800">{s.label}</span>
                                </div>
                                <p className="text-xs text-slate-500">{s.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleRewrite} disabled={!bullets.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-40 shadow-lg shadow-blue-500/20">
                    ✍️ Rewrite My Bullets
                </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Rewritten Bullets ({results.length})</h2>
                        {selectedResults.size > 0 && (
                            <button onClick={copySelected}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-md">
                                📋 Copy {selectedResults.size} Selected
                            </button>
                        )}
                    </div>

                    {results.map(r => (
                        <div key={r.id} className={`bg-white border rounded-2xl p-5 transition ${
                            selectedResults.has(r.id) ? "border-blue-300 shadow-lg bg-blue-50/30" : "border-slate-200/60 hover:border-blue-300"
                        }`}>
                            {/* Original */}
                            <div className="mb-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Original</p>
                                <p className="text-sm text-slate-500 line-through">{r.original}</p>
                            </div>

                            {/* Rewritten */}
                            <div className="mb-3">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Rewritten</p>
                                <p className="text-sm font-semibold text-slate-800 bg-blue-50 border border-blue-200 rounded-lg p-3">{r.rewritten}</p>
                            </div>

                            {/* Alternative */}
                            <div className="mb-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alternative</p>
                                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">{r.alt}</p>
                            </div>

                            {/* Select button */}
                            <button onClick={() => toggleSelect(r.id)}
                                className={`text-xs font-bold px-4 py-2 rounded-lg transition ${
                                    selectedResults.has(r.id)
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                                }`}>
                                {selectedResults.has(r.id) ? "✓ Selected" : "Select this version"}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {results.length === 0 && !bullets && (
                <div className="text-center py-16">
                    <span className="text-6xl mb-4 block">✍️</span>
                    <p className="text-lg font-bold text-slate-400">Paste your weak resume bullets above</p>
                    <p className="text-sm text-slate-400 mt-1">We'll rewrite them with metrics, impact, and proper formatting</p>
                </div>
            )}
        </div>
    );
}
