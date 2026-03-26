import { useState } from "react";
import { Link } from "react-router-dom";
import { useCareer, JOB_DATABASE as CONTEXT_JOBS } from "../CareerContext.jsx";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

const JOBS = CONTEXT_JOBS;

const SKILL_FILTERS = ["React", "Python", "TypeScript", "Node.js", "AWS", "SQL", "Java", "GraphQL"];

export default function JobSearch() {
    const { hasResume, resumeSkills, resumeScore, getJobMatches } = useCareer();
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [salaryMin, setSalaryMin] = useState(0);
    const [selectedSkills, setSelectedSkills] = useState(new Set());
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [savedJobs, setSavedJobs] = useState(new Set());
    const [sortBy, setSortBy] = useState("relevance");

    // Get resume-based match data
    const jobMatches = hasResume ? getJobMatches() : [];
    const matchMap = new Map(jobMatches.map(j => [j.id, j]));

    function toggleSkill(skill) {
        setSelectedSkills(prev => {
            const next = new Set(prev);
            next.has(skill) ? next.delete(skill) : next.add(skill);
            return next;
        });
    }

    function handleSearch(e) {
        e?.preventDefault();
        setSearching(true);
        setHasSearched(true);
        setTimeout(() => {
            let filtered = JOBS.filter(job => {
                const q = query.toLowerCase();
                const matchesQuery = !q || job.role.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.skills.some(s => s.toLowerCase().includes(q));
                const matchesLoc = !location || job.location.toLowerCase().includes(location.toLowerCase());
                const matchesRemote = remoteOnly ? job.type === "Remote" : true;
                const matchesSalary = job.salary >= salaryMin;
                const matchesSkills = selectedSkills.size === 0 || job.skills.some(s => selectedSkills.has(s.charAt(0).toUpperCase() + s.slice(1)));
                return matchesQuery && matchesLoc && matchesRemote && matchesSalary && matchesSkills;
            });

            // Sort by resume match if available
            if (sortBy === "match" && hasResume) {
                filtered.sort((a, b) => (matchMap.get(b.id)?.matchPct || 0) - (matchMap.get(a.id)?.matchPct || 0));
            } else if (sortBy === "salary") {
                filtered.sort((a, b) => b.salary - a.salary);
            } else if (sortBy === "recent") {
                filtered.sort((a, b) => parseInt(a.posted) - parseInt(b.posted));
            }

            setResults(filtered);
            setSearching(false);
        }, 400);
    }

    async function handleSaveJob(job) {
        try {
            await axios.post(`${API_BASE}/api/jobs`, {
                userId: MOCK_USER_ID, company: job.company, role: job.role,
                salary: `$${job.salary}k`, source: "CareerCraft Search", status: "SAVED"
            });
            setSavedJobs(prev => new Set(prev).add(job.id));
        } catch (err) { console.error(err); }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">🔍</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">Job Search</h1>
                    </div>
                    <p className="text-white/80 text-lg font-medium max-w-2xl">Search {JOBS.length} positions. {hasResume ? `Your resume is loaded — see match % for every job!` : `Upload your resume in the Analyzer to see match % per job.`}</p>
                </div>
            </header>

            {/* Resume Status Banner */}
            {hasResume ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black">{resumeScore}</div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-blue-700">✅ Resume loaded — {resumeSkills.length} skills detected</p>
                        <p className="text-xs text-blue-500">Match scores shown for each job below</p>
                    </div>
                </div>
            ) : (
                <Link to="/resume/analyzer" className="block bg-yellow-50 border border-yellow-200 rounded-xl p-4 hover:bg-yellow-100 transition">
                    <p className="text-sm font-bold text-yellow-700">⚠️ No resume loaded — upload in Resume Analyzer to see match % for each job</p>
                    <p className="text-xs text-yellow-600 mt-0.5">Click here to go to Resume Analyzer →</p>
                </Link>
            )}

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <span className="text-blue-500">🔍</span>
                    <input type="text" placeholder="Job title, keyword, or company..." className="bg-transparent border-none outline-none text-slate-800 w-full text-sm"
                        value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <span className="text-blue-500">📍</span>
                    <input type="text" placeholder="City, state, or 'Remote'" className="bg-transparent border-none outline-none text-slate-800 w-full text-sm"
                        value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <button type="submit" disabled={searching} className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 whitespace-nowrap">
                    {searching ? "⏳ Searching..." : "Find Jobs"}
                </button>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 hover:border-blue-400 px-4 py-2 rounded-full text-sm font-semibold transition">
                    <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)} className="rounded text-blue-500 w-4 h-4" />
                    Remote Only
                </label>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full">
                    <span className="text-xs font-bold text-slate-500">Min Salary:</span>
                    <select className="bg-transparent border-none text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                        value={salaryMin} onChange={e => setSalaryMin(Number(e.target.value))}>
                        <option value={0}>Any</option>
                        <option value={100}>$100k+</option>
                        <option value={150}>$150k+</option>
                        <option value={200}>$200k+</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full">
                    <span className="text-xs font-bold text-slate-500">Sort:</span>
                    <select className="bg-transparent border-none text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                        value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="relevance">Relevance</option>
                        {hasResume && <option value="match">Best Resume Match</option>}
                        <option value="salary">Highest Salary</option>
                        <option value="recent">Most Recent</option>
                    </select>
                </div>
                {hasSearched && <span className="text-sm font-bold text-slate-400 ml-auto">{results.length} results</span>}
            </div>

            {/* Skill Filters */}
            <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase self-center mr-2">Skills:</span>
                {SKILL_FILTERS.map(skill => (
                    <button key={skill} onClick={() => { toggleSkill(skill); setTimeout(handleSearch, 100); }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                            selectedSkills.has(skill)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                        }`}>{skill}</button>
                ))}
            </div>

            {/* Results */}
            <div className="space-y-3">
                {results.map(job => {
                    const isSaved = savedJobs.has(job.id);
                    const matchData = matchMap.get(job.id);
                    const matchPct = matchData?.matchPct || 0;

                    return (
                        <div key={job.id} className="bg-white border border-slate-200/60 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{job.logo}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">{job.company}</p>
                                                {hasResume && matchPct >= 70 && (
                                                    <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">🏆 Best Fit</span>
                                                )}
                                            </div>
                                            <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">{job.role}</h2>
                                        </div>
                                        {/* Match circle */}
                                        {hasResume && (
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                                matchPct >= 70 ? "bg-green-100 text-green-700 border-2 border-green-300"
                                                    : matchPct >= 40 ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                                                        : "bg-slate-100 text-slate-500 border-2 border-slate-200"
                                            }`}>
                                                {matchPct}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mb-3 ml-11">
                                        <span className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-medium">📍 {job.location}</span>
                                        <span className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-medium">💼 {job.type}</span>
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold">💰 ${job.salary}k</span>
                                        <span className="text-xs bg-slate-50 text-slate-400 px-2.5 py-1 rounded-lg font-medium">🕐 {job.posted} ago</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 ml-11">
                                        {job.skills.map(tag => {
                                            const have = hasResume && resumeSkills.map(s => s.toLowerCase()).includes(tag.toLowerCase());
                                            return (
                                                <span key={tag} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                                    have
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-slate-50 text-slate-500 border-slate-200"
                                                }`}>
                                                    {have ? "✓" : "+"} {tag}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                    <button onClick={() => handleSaveJob(job)} disabled={isSaved}
                                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${isSaved
                                            ? "bg-blue-50 text-blue-600 border border-blue-200 cursor-default"
                                            : "bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg shadow-blue-500/20"
                                        }`}>
                                        {isSaved ? "✓ Saved" : "Save to Tracker"}
                                    </button>
                                    <a href="#" className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 hover:border-blue-400 rounded-xl font-bold text-xs text-center transition">
                                        Apply Now →
                                    </a>
                                </div>
                            </div>

                            {/* Skill gap detail (only if resume loaded) */}
                            {hasResume && matchData && matchData.missingSkills.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-100 ml-11">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Skills to add for this role:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {matchData.missingSkills.map(s => (
                                            <span key={s} className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">+ {s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {!hasSearched && (
                    <div className="text-center py-16">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <p className="text-lg font-bold text-slate-400">Search across {JOBS.length} open positions</p>
                        <p className="text-sm text-slate-400 mt-1">{hasResume ? "Your resume is loaded — match scores will appear on results" : "Upload a resume first for match % scoring"}</p>
                    </div>
                )}
                {hasSearched && !searching && results.length === 0 && (
                    <div className="text-center py-16">
                        <span className="text-6xl mb-4 block">🤷</span>
                        <p className="text-lg font-bold text-slate-400">No jobs match your criteria</p>
                        <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
