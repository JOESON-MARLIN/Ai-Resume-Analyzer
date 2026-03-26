import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

// ─────────────────────────────────────────────
// MOCK DATA (Fallback since no API key provided)
// ─────────────────────────────────────────────
const MOCK_JOBS = [
    { id: "j1", company: "Google", role: "Frontend Engineer (React)", location: "Remote", salary: "$140k - $180k", type: "Full-time", tags: ["React", "TypeScript", "AI"] },
    { id: "j2", company: "Stripe", role: "Software Engineer, Dashboard", location: "San Francisco, CA", salary: "$160k - $210k", type: "Hybrid", tags: ["React", "Node.js", "GraphQL"] },
    { id: "j3", company: "Spotify", role: "Web Developer", location: "New York, NY", salary: "$130k - $160k", type: "Remote", tags: ["JavaScript", "CSS Architecture"] },
    { id: "j4", company: "Netflix", role: "Senior UI Engineer", location: "Los Gatos, CA", salary: "$200k - $300k", type: "Onsite", tags: ["React", "Performance", "Video"] },
];

export default function JobSearch() {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [savedJobs, setSavedJobs] = useState(new Set());

    async function handleSearch(e) {
        e.preventDefault();
        setSearching(true);
        // Simulate API delay for SerpAPI/RapidAPI
        setTimeout(() => {
            const filtered = MOCK_JOBS.filter(job => {
                const matchesQuery = job.role.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase());
                const matchesLoc = job.location.toLowerCase().includes(location.toLowerCase());
                const matchesRemote = remoteOnly ? job.location === "Remote" || job.type === "Remote" : true;
                return matchesQuery && matchesLoc && matchesRemote;
            });
            setResults(filtered);
            setSearching(false);
        }, 800);
    }

    async function handleSaveJob(job) {
        try {
            // Push directly to Kanban board!
            await axios.post(`${API_BASE}/api/jobs`, {
                userId: MOCK_USER_ID,
                company: job.company,
                role: job.role,
                salary: job.salary,
                url: `https://mock-aggregator.com/job/${job.id}`,
                source: "CareerCraft Aggregator",
                status: "SAVED"
            });
            setSavedJobs(prev => new Set(prev).add(job.id));
        } catch (err) {
            console.error("Failed to save job to kanban", err);
            alert("Error saving job");
        }
    }

    return (
        <div className="max-w-6xl mx-auto text-white space-y-8 animate-in fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Job Search Aggregator</h1>
                <p className="text-[#8598b9]">Search millions of jobs across LinkedIn, Google Jobs, and Indeed.</p>
            </header>

            {/* Smart Search Bar */}
            <form onSubmit={handleSearch} className="bg-[#131823] border border-[#1e2330] rounded-2xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-3 bg-[#0B0E14] border border-[#1e2330] rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
                    <span className="text-[#5a6b8a]">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Job title, keywords, or company..." 
                        className="bg-transparent border-none outline-none text-white w-full text-sm"
                        value={query} onChange={e => setQuery(e.target.value)} 
                    />
                </div>
                <div className="flex-1 flex items-center gap-3 bg-[#0B0E14] border border-[#1e2330] rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
                    <span className="text-[#5a6b8a]">📍</span>
                    <input 
                        type="text" 
                        placeholder="City, state, or zip code" 
                        className="bg-transparent border-none outline-none text-white w-full text-sm"
                        value={location} onChange={e => setLocation(e.target.value)} 
                    />
                </div>
                <button type="submit" disabled={searching} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition whitespace-nowrap disabled:opacity-50">
                    {searching ? "Searching..." : "Find Jobs"}
                </button>
            </form>

            {/* Advanced Filters Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-[#131823] border border-[#1e2330] hover:border-[#5a6b8a] px-4 py-2 rounded-full text-sm font-semibold transition">
                    <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)} className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-blue-500" />
                    Remote Only
                </label>
                <select className="bg-[#131823] border border-[#1e2330] hover:border-[#5a6b8a] px-4 py-2 rounded-full text-sm font-semibold text-white outline-none cursor-pointer">
                    <option>Date Posted: Any</option>
                    <option>Past 24 Hours</option>
                    <option>Past Week</option>
                </select>
                <select className="bg-[#131823] border border-[#1e2330] hover:border-[#5a6b8a] px-4 py-2 rounded-full text-sm font-semibold text-white outline-none cursor-pointer">
                    <option>Experience Level</option>
                    <option>Entry Level</option>
                    <option>Mid-Senior</option>
                    <option>Director</option>
                </select>
            </div>

            {/* Results Grid */}
            <div className="mt-8 space-y-4">
                {results.map(job => {
                    const isSaved = savedJobs.has(job.id);
                    return (
                        <div key={job.id} className="bg-[#131823] border border-[#1e2330] rounded-2xl p-6 hover:border-[#5a6b8a] transition flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex-1">
                                <p className="text-sm font-bold tracking-wider text-blue-500 uppercase mb-1">{job.company}</p>
                                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">{job.role}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-[#8598b9] mb-4">
                                    <span className="flex items-center gap-1">📍 {job.location}</span>
                                    <span className="flex items-center gap-1">💼 {job.type}</span>
                                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">💰 {job.salary}</span>
                                </div>
                                <div className="flex gap-2">
                                    {job.tags.map(tag => (
                                        <span key={tag} className="text-xs font-bold text-[#5a6b8a] bg-[#0B0E14] border border-[#1e2330] px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                <button 
                                    onClick={() => handleSaveJob(job)}
                                    disabled={isSaved}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition ${
                                        isSaved 
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default" 
                                            : "bg-[#0B0E14] border border-[#1e2330] hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-300"
                                    }`}
                                >
                                    {isSaved ? "Saved to Tracker ✓" : "Save to Tracker"}
                                </button>
                                <a href="#" className="px-6 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl font-bold text-sm text-center transition">
                                    Apply Now
                                </a>
                            </div>
                        </div>
                    );
                })}
                {results.length === 0 && !searching && query && (
                    <div className="text-center py-20 text-[#8598b9]">
                        <p className="text-lg">No jobs found matching your criteria.</p>
                        <p className="text-sm mt-2">Try adjusting your filters or expanding your search location.</p>
                    </div>
                )}
                {results.length === 0 && !searching && !query && (
                    <div className="text-center py-20 text-[#8598b9]">
                        <p className="text-lg">Enter a role and location to start searching.</p>
                        <p className="text-sm mt-2">Showing results from Google Jobs, LinkedIn, and Indeed via Aggregator.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
