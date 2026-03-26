import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

const MOCK_JOBS = [
    { id: "j1", company: "Google", role: "Frontend Engineer (React)", location: "Remote", salary: "$140k - $180k", type: "Full-time", tags: ["React", "TypeScript", "AI"], logo: "🔵" },
    { id: "j2", company: "Stripe", role: "Software Engineer, Dashboard", location: "San Francisco, CA", salary: "$160k - $210k", type: "Hybrid", tags: ["React", "Node.js", "GraphQL"], logo: "🟣" },
    { id: "j3", company: "Spotify", role: "Web Developer", location: "New York, NY", salary: "$130k - $160k", type: "Remote", tags: ["JavaScript", "CSS Architecture"], logo: "🟢" },
    { id: "j4", company: "Netflix", role: "Senior UI Engineer", location: "Los Gatos, CA", salary: "$200k - $300k", type: "Onsite", tags: ["React", "Performance", "Video"], logo: "🔴" },
    { id: "j5", company: "Meta", role: "React Native Developer", location: "Remote", salary: "$150k - $190k", type: "Remote", tags: ["React Native", "iOS", "Android"], logo: "🔵" },
    { id: "j6", company: "Apple", role: "Full Stack Software Engineer", location: "Cupertino, CA", salary: "$180k - $250k", type: "Onsite", tags: ["Swift", "React", "Node.js"], logo: "⚪" },
];

export default function JobSearch() {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [savedJobs, setSavedJobs] = useState(new Set());
    const [hasSearched, setHasSearched] = useState(false);

    async function handleSearch(e) {
        e.preventDefault();
        setSearching(true);
        setHasSearched(true);
        setTimeout(() => {
            const filtered = MOCK_JOBS.filter(job => {
                const matchesQuery = !query || job.role.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase()) || job.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
                const matchesLoc = !location || job.location.toLowerCase().includes(location.toLowerCase());
                const matchesRemote = remoteOnly ? job.location === "Remote" || job.type === "Remote" : true;
                return matchesQuery && matchesLoc && matchesRemote;
            });
            setResults(filtered);
            setSearching(false);
        }, 600);
    }

    async function handleSaveJob(job) {
        try {
            await axios.post(`${API_BASE}/api/jobs`, {
                userId: MOCK_USER_ID,
                company: job.company,
                role: job.role,
                salary: job.salary,
                url: `https://careers.${job.company.toLowerCase()}.com`,
                source: "CareerCraft Search",
                status: "SAVED"
            });
            setSavedJobs(prev => new Set(prev).add(job.id));
        } catch (err) {
            console.error("Failed to save job", err);
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-300 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">🔍</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">Job Search</h1>
                    </div>
                    <p className="text-white/80 text-lg font-medium max-w-2xl">Search across LinkedIn, Google Jobs, and Indeed. Save any job directly to your tracker with one click.</p>
                </div>
            </header>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <span className="text-blue-500">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Job title, keywords, or company..." 
                        className="bg-transparent border-none outline-none text-slate-800 w-full text-sm"
                        value={query} onChange={e => setQuery(e.target.value)} 
                    />
                </div>
                <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <span className="text-blue-500">📍</span>
                    <input 
                        type="text" 
                        placeholder="City, state, or remote" 
                        className="bg-transparent border-none outline-none text-slate-800 w-full text-sm"
                        value={location} onChange={e => setLocation(e.target.value)} 
                    />
                </div>
                <button type="submit" disabled={searching} className="bg-gradient-to-r from-blue-600 to-blue-300 hover:from-blue-600 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all whitespace-nowrap disabled:opacity-50 shadow-lg shadow-blue-500/20">
                    {searching ? "⏳ Searching..." : "Find Jobs"}
                </button>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 hover:border-blue-400 px-4 py-2 rounded-full text-sm font-semibold transition">
                    <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)} className="rounded bg-white border-slate-300 text-blue-500 focus:ring-blue-500 w-4 h-4" />
                    Remote Only
                </label>
                <select className="bg-white border border-slate-200 hover:border-blue-400 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 outline-none cursor-pointer">
                    <option>Date Posted: Any</option>
                    <option>Past 24 Hours</option>
                    <option>Past Week</option>
                </select>
                <select className="bg-white border border-slate-200 hover:border-blue-400 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 outline-none cursor-pointer">
                    <option>Experience Level</option>
                    <option>Entry Level</option>
                    <option>Mid-Senior</option>
                    <option>Director</option>
                </select>
                {hasSearched && <span className="text-sm font-bold text-slate-400 ml-auto">{results.length} results found</span>}
            </div>

            {/* Results */}
            <div className="space-y-4">
                {results.map(job => {
                    const isSaved = savedJobs.has(job.id);
                    return (
                        <div key={job.id} className="bg-white border border-slate-200/60 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{job.logo}</span>
                                    <div>
                                        <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">{job.company}</p>
                                        <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">{job.role}</h2>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3 ml-11">
                                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg text-xs font-medium">📍 {job.location}</span>
                                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg text-xs font-medium">💼 {job.type}</span>
                                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">💰 {job.salary}</span>
                                </div>
                                <div className="flex gap-2 ml-11">
                                    {job.tags.map(tag => (
                                        <span key={tag} className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                <button 
                                    onClick={() => handleSaveJob(job)}
                                    disabled={isSaved}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
                                        isSaved 
                                            ? "bg-blue-50 text-blue-600 border border-blue-200 cursor-default" 
                                            : "bg-gradient-to-r from-blue-600 to-blue-300 text-white hover:shadow-lg shadow-blue-500/20"
                                    }`}
                                >
                                    {isSaved ? "✓ Saved" : "Save to Tracker"}
                                </button>
                                <a href="#" className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 hover:border-blue-400 rounded-xl font-bold text-xs text-center transition">
                                    Apply Now →
                                </a>
                            </div>
                        </div>
                    );
                })}
                {!hasSearched && (
                    <div className="text-center py-20">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <p className="text-lg font-bold text-slate-400">Enter a role and location to start searching</p>
                        <p className="text-sm text-slate-400 mt-1">Aggregating results from Google Jobs, LinkedIn, and Indeed</p>
                    </div>
                )}
                {hasSearched && !searching && results.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-6xl mb-4 block">🤷</span>
                        <p className="text-lg font-bold text-slate-400">No jobs found matching your criteria</p>
                        <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or broadening your search</p>
                    </div>
                )}
            </div>
        </div>
    );
}
