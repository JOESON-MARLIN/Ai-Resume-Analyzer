import { useState } from "react";

const DOMAINS = [
    { 
        id: "swe", 
        name: "DSA & System Design", 
        description: "Master data structures, algorithms, and architecture thinking.",
        gradient: "from-blue-500 to-blue-300",
        icon: "💻",
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
        name: "AI & ML Hub", 
        description: "Prepare for AI/ML and Data Science interviews in one focused workspace.",
        gradient: "from-blue-600 to-blue-300",
        icon: "🧠",
        tracks: "2 Tracks",
        sets: "14 Mock Cases",
        cases: [
            { title: "Recommendation Engine", difficulty: "Hard", tradeoffs: "Collaborative Filtering vs Content-Based, Matrix Factorization, Cold Start Problem." },
            { title: "Fraud Detection at Scale", difficulty: "Medium", tradeoffs: "Random Forest vs Neural Networks, Class Imbalance (SMOTE), Real-time feature streaming." }
        ]
    },
    { 
        id: "pm", 
        name: "Product & Management", 
        description: "Prepare PM and behavioral rounds with structured frameworks.",
        gradient: "from-blue-500 to-blue-400",
        icon: "📊",
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

    if (activeHub) {
        return (
            <div className="max-w-6xl mx-auto space-y-8 pb-10 animate-in fade-in">
                <button onClick={() => setActiveHub(null)} className="text-slate-400 hover:text-slate-800 transition flex items-center gap-2 text-sm font-bold mb-2">
                    <span>←</span> Back to Hubs
                </button>

                <header className={`bg-gradient-to-br ${activeHub.gradient} rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl`}>
                    <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <span className="text-5xl drop-shadow-md">{activeHub.icon}</span>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">{activeHub.name}</h1>
                            <p className="text-white/80 font-medium mt-1">{activeHub.description}</p>
                        </div>
                    </div>
                    <div className="relative z-10 flex gap-3 mt-6">
                        <span className="bg-white/15 backdrop-blur text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/20">{activeHub.tracks}</span>
                        <span className="bg-white/15 backdrop-blur text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/20">{activeHub.sets}</span>
                    </div>
                </header>

                <section>
                    <h2 className="text-lg font-extrabold text-slate-800 mb-5">Interview Cases & Concepts</h2>
                    <div className="space-y-4">
                        {activeHub.cases.map((c, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white border border-slate-200/60 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">{c.title}</h3>
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                            c.difficulty === 'Hard' ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-blue-600 bg-blue-50 border-blue-200'
                                        }`}>{c.difficulty}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        <strong className="text-slate-600">Key Trade-offs:</strong> {c.tradeoffs}
                                    </p>
                                </div>
                                <button className={`bg-gradient-to-r ${activeHub.gradient} text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all shrink-0`}>
                                    Start →
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-10 animate-in fade-in">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">📚</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">Study Hubs</h1>
                    </div>
                    <p className="text-white/80 text-lg font-medium max-w-2xl">Pick a focused domain. Follow a clear path with questions, mocks, and concepts all in one place.</p>
                </div>
            </header>

            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DOMAINS.map(domain => (
                    <div
                        key={domain.id}
                        onClick={() => setActiveHub(domain)}
                        className="flex flex-col rounded-3xl border border-slate-200/60 bg-white overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300 group cursor-pointer"
                    >
                        {/* Gradient top */}
                        <div className={`h-40 bg-gradient-to-br ${domain.gradient} p-6 relative overflow-hidden`}>
                            <div className="absolute right-4 top-4 text-5xl opacity-30 group-hover:opacity-60 transition-opacity duration-500">{domain.icon}</div>
                            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 translate-y-10 group-hover:scale-110 transition-transform"></div>
                            <h2 className="text-2xl font-extrabold text-white drop-shadow-md mb-2">{domain.name}</h2>
                            <p className="text-sm text-white/80 font-medium max-w-[85%]">{domain.description}</p>
                        </div>

                        {/* Stats bottom */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                            <div className="flex gap-3">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-xs font-bold text-slate-600">
                                    {domain.tracks}
                                </div>
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-xs font-bold text-slate-600">
                                    {domain.sets}
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{domain.cases.length} focus areas inside</p>

                            <button className="w-full flex justify-between items-center bg-slate-50 border border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50 transition rounded-xl p-4 text-sm font-bold text-slate-600 group-hover:text-blue-700">
                                <span>Open {domain.name}</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
