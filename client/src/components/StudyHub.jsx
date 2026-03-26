import { useState } from "react";

const DOMAINS = [
    { 
        id: "swe", 
        name: "DSA & System Design", 
        description: "Master data structures, algorithms, and architecture thinking.",
        gradient: "from-blue-500 to-cyan-400",
        tracks: "3 Tracks",
        sets: "24 Mock Cases",
        cases: [
            { title: "Design Netflix", difficulty: "Hard", tradeoffs: "SQL vs NoSQL for metadata, CDN distribution strategies, handling the Thundering Herd problem." },
            { title: "Design Uber", difficulty: "Hard", tradeoffs: "WebSockets vs Long Polling, Geospatial indexing (QuadTrees vs GeoHashes)." },
            { title: "Two Pointer Approach", difficulty: "Medium", tradeoffs: "O(N) time complexity vs O(N^2) naive approach. In-place modification." }
        ]
    },
    { 
        id: "ai", 
        name: "AI Hub", 
        description: "Prepare for AI/ML and Data Science interviews in one focused workspace.",
        gradient: "from-violet-400 to-purple-400",
        tracks: "2 Tracks",
        sets: "14 Mock Cases",
        cases: [
            { title: "Recommendation Engine", difficulty: "Hard", tradeoffs: "Collaborative Filtering vs Content-Based, Matrix Factorization, Cold Start Problem." },
            { title: "Fraud Detection at Scale", difficulty: "Medium", tradeoffs: "Random Forest vs Neural Networks, Class Imbalance (SMOTE), Real-time feature streaming." }
        ]
    },
    { 
        id: "pm", 
        name: "Product & Management Hub", 
        description: "Prepare PM and behavioral rounds with structured frameworks.",
        gradient: "from-orange-400 to-rose-400",
        tracks: "1 Track",
        sets: "12 Mock Cases",
        cases: [
            { title: "A/B Testing Framework", difficulty: "Medium", tradeoffs: "Statistical significance thresholds, identifying cannibalization, segment bucketing." },
            { title: "Prioritizing the Roadmap", difficulty: "Medium", tradeoffs: "RICE scoring vs Kano Model, Engineering bandwidth constraints." }
        ]
    }
];

export default function StudyHub() {
    const [activeHub, setActiveHub] = useState(null);

    const handleBack = () => setActiveHub(null);

    if (activeHub) {
        return (
            <div className="text-white max-w-6xl mx-auto space-y-10 animate-in fade-in">
                <button onClick={handleBack} className="text-[#8598b9] hover:text-white transition flex items-center gap-2 mb-8">
                    <span>←</span> Back to Hubs
                </button>

                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeHub.gradient} shadow-lg shadow-white/5`}></div>
                        <h1 className="text-3xl font-bold tracking-tight">{activeHub.name}</h1>
                    </div>
                    <p className="text-[#8598b9] max-w-2xl font-sans">{activeHub.description}</p>
                </header>

                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">Interview Cases & Concepts</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#5a6b8a] uppercase tracking-widest bg-[#131823] px-3 py-1.5 rounded-lg border border-[#1e2330]">
                                {activeHub.tracks}
                            </span>
                            <span className="text-xs font-bold text-[#5a6b8a] uppercase tracking-widest bg-[#131823] px-3 py-1.5 rounded-lg border border-[#1e2330]">
                                {activeHub.sets}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {activeHub.cases.map((c, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#131823] border border-[#1e2330] rounded-xl p-6 hover:border-[#5a6b8a] transition cursor-pointer group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">{c.title}</h3>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                            c.difficulty === 'Hard' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                        }`}>{c.difficulty}</span>
                                    </div>
                                    <p className="text-sm text-[#8598b9]">
                                        <strong className="text-slate-300">Key Trade-offs:</strong> {c.tradeoffs}
                                    </p>
                                </div>
                                <div className="flex md:flex-col gap-3">
                                    <button className="bg-[#0B0E14] border border-[#1e2330] hover:border-blue-500/50 hover:bg-blue-500/10 transition px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 w-full md:w-32">
                                        Solve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="text-white max-w-6xl mx-auto space-y-10 animate-in fade-in">
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Choose Your Prep Hub</h1>
                <p className="text-[#8598b9] max-w-2xl font-sans">
                    Pick one focused domain to reduce noise and follow a clear interview path with questions, mocks, AI coach, and revision in one place.
                </p>
            </header>

            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DOMAINS.map(domain => {
                    return (
                        <div
                            key={domain.id}
                            onClick={() => setActiveHub(domain)}
                            className="flex flex-col rounded-2xl border border-[#1e2330] bg-[#0B0E14] overflow-hidden hover:border-[#5a6b8a] hover:shadow-xl transition duration-300 group cursor-pointer"
                        >
                            {/* colored top half */}
                            <div className={`h-40 bg-gradient-to-br ${domain.gradient} opacity-90 p-6 relative overflow-hidden`}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{domain.name}</h2>
                                <p className="text-sm text-slate-900/80 font-medium max-w-[85%]">{domain.description}</p>
                                {/* Abstract geometric accent */}
                                <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/20 rounded-full blur-2xl translate-x-10 translate-y-10 group-hover:scale-110 transition-transform"></div>
                            </div>

                            {/* dark bottom half */}
                            <div className="p-6 bg-[#131823] flex-1 flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-1 bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-center text-xs font-semibold text-slate-300">
                                            {domain.tracks}
                                        </div>
                                        <div className="flex-1 bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-center text-xs font-semibold text-slate-300">
                                            {domain.sets}
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#5a6b8a] uppercase font-bold tracking-widest">{domain.cases.length} Focus areas inside</p>
                                </div>

                                <button className="w-full flex justify-between items-center bg-[#0B0E14] border border-[#1e2330] group-hover:border-blue-500/50 group-hover:text-white transition rounded-xl p-4 text-sm font-semibold text-slate-300">
                                    <span>Open {domain.name}</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
