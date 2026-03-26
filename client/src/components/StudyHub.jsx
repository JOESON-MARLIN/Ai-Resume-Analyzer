import { useState } from "react";

const DOMAINS = [
    { id: "swe", name: "Software Engineering", icon: "💻", color: "from-blue-500 to-cyan-400" },
    { id: "pm", name: "Product Management", icon: "📊", color: "from-violet-500 to-purple-400" },
    { id: "data", name: "Data Science", icon: "📈", color: "from-emerald-500 to-teal-400" },
    { id: "ai", name: "AI / Machine Learning", icon: "🤖", color: "from-rose-500 to-orange-400" }
];

const COMPANIES = [
    { name: "Google", topics: ["Algorithms", "Googliness", "System Design at Scale"] },
    { name: "Meta", topics: ["Execution Speed", "Product Sense", "React Internals"] },
    { name: "Amazon", topics: ["Leadership Principles", "Object Oriented Design", "AWS Architecture"] }
];

const CASE_STUDIES = [
    {
        title: "Design Netflix",
        domain: "swe",
        difficulty: "Hard",
        description: "Architect a global video streaming platform with low latency and high availability.",
        tradeoffs: "SQL vs NoSQL for metadata, CDN distribution strategies, handling the Thundering Herd problem."
    },
    {
        title: "Design Uber",
        domain: "swe",
        difficulty: "Hard",
        description: "Design a ride-sharing service handling real-time location tracking and matching.",
        tradeoffs: "WebSockets vs Long Polling, Geospatial indexing (QuadTrees vs GeoHashes)."
    },
    {
        title: "A/B Testing Framework",
        domain: "pm",
        difficulty: "Medium",
        description: "Design an internal experimentation platform for tracking feature rollouts.",
        tradeoffs: "Statistical significance thresholds, identifying cannibalization, segment bucketing."
    }
];

export default function StudyHub() {
    const [activeDomain, setActiveDomain] = useState("swe");

    const filteredCases = CASE_STUDIES.filter(c => c.domain === activeDomain);

    return (
        <div className="text-white max-w-6xl mx-auto space-y-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Study Hub</h1>
                <p className="text-slate-400">Multi-domain interview preparation and system design practice.</p>
            </header>

            {/* DOMAIN SELECTOR */}
            <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Select Track</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {DOMAINS.map(domain => {
                        const isActive = activeDomain === domain.id;
                        return (
                            <button
                                key={domain.id}
                                onClick={() => setActiveDomain(domain.id)}
                                className={[
                                    "p-6 text-left rounded-2xl border transition-all duration-300 relative overflow-hidden group",
                                    isActive ? "bg-slate-800 border-slate-600 shadow-xl" : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                ].join(" ")}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${domain.color} opacity-10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:opacity-20 transition-opacity`}></div>
                                <div className="text-3xl mb-3">{domain.icon}</div>
                                <h3 className="font-bold relative z-10">{domain.name}</h3>
                            </button>
                        );
                    })}
                </div>
            </section>

            <div className="grid md:grid-cols-[1fr_300px] gap-8">
                {/* SYSTEM DESIGN CASES */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">System Design Cases</h2>
                    </div>
                    <div className="space-y-4">
                        {filteredCases.map(c => (
                            <div key={c.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-violet-500/50 transition cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold group-hover:text-violet-400 transition">{c.title}</h3>
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-amber-400 border border-amber-500/20">{c.difficulty}</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-4">{c.description}</p>
                                <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                    <p className="text-xs font-semibold text-slate-500 mb-1">KEY TRADE-OFFS</p>
                                    <p className="text-xs text-slate-300">{c.tradeoffs}</p>
                                </div>
                            </div>
                        ))}
                        {filteredCases.length === 0 && (
                            <div className="text-center p-10 border border-dashed border-slate-800 rounded-xl text-slate-500">
                                More cases coming soon for {DOMAINS.find(d => d.id === activeDomain).name}!
                            </div>
                        )}
                    </div>
                </section>

                {/* TARGET COMPANIES */}
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Target Intel</h2>
                    <div className="space-y-4">
                        {COMPANIES.map(company => (
                            <div key={company.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                <h3 className="font-bold mb-3">{company.name}</h3>
                                <ul className="space-y-2">
                                    {company.topics.map(topic => (
                                        <li key={topic} className="flex gap-2 text-xs text-slate-400 items-start">
                                            <span className="text-emerald-400 mt-0.5">▪</span>
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
