import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

const COLUMNS = [
    { key: "SAVED", label: "Saved", color: "bg-blue-500", emoji: "📌" },
    { key: "APPLIED", label: "Applied", color: "bg-blue-600", emoji: "📤" },
    { key: "INTERVIEWING", label: "Interviewing", color: "bg-blue-500", emoji: "🎙️" },
    { key: "OFFERED", label: "Offered", color: "bg-green-500", emoji: "🎉" },
    { key: "REJECTED", label: "Rejected", color: "bg-slate-400", emoji: "❌" },
];

export default function JobBoard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [expandedJob, setExpandedJob] = useState(null);
    const [newJob, setNewJob] = useState({ company: "", role: "", status: "SAVED", url: "", salary: "", notes: "", followUpDate: "" });
    const [toast, setToast] = useState("");

    // Analytics
    const totalJobs = jobs.length;
    const applied = jobs.filter(j => j.status !== "SAVED").length;
    const responses = jobs.filter(j => ["INTERVIEWING", "OFFERED", "REJECTED"].includes(j.status)).length;
    const interviews = jobs.filter(j => ["INTERVIEWING", "OFFERED"].includes(j.status)).length;
    const offers = jobs.filter(j => j.status === "OFFERED").length;
    const responseRate = applied ? Math.round((responses / applied) * 100) : 0;
    const interviewRate = applied ? Math.round((interviews / applied) * 100) : 0;
    const offerRate = interviews ? Math.round((offers / interviews) * 100) : 0;

    useEffect(() => { fetchJobs(); }, []);

    async function fetchJobs() {
        try {
            const { data } = await axios.get(`${API_BASE}/api/jobs/${MOCK_USER_ID}`);
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally { setLoading(false); }
    }

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

    async function handleAddJob(e) {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_BASE}/api/jobs`, { ...newJob, userId: MOCK_USER_ID });
            setJobs([data, ...jobs]);
            setIsAddOpen(false);
            setNewJob({ company: "", role: "", status: "SAVED", url: "", salary: "", notes: "", followUpDate: "" });
            showToast("✅ Job added to pipeline!");
        } catch (error) {
            console.error(error);
            showToast("❌ Failed to add job");
        }
    }

    async function handleDelete(id) {
        try {
            await axios.delete(`${API_BASE}/api/jobs/${id}`);
            setJobs(jobs.filter(j => j.id !== id));
            showToast("🗑️ Job removed");
        } catch (err) { console.error(err); }
    }

    async function moveJob(id, newStatus) {
        setJobs(prev => prev.map(j => (j.id === id ? { ...j, status: newStatus } : j)));
        try {
            await axios.patch(`${API_BASE}/api/jobs/${id}/status`, { status: newStatus });
            showToast(`📋 Moved to ${newStatus}`);
        } catch (err) { fetchJobs(); }
    }

    async function drop(e, newStatus) {
        const id = e.dataTransfer.getData("jobId");
        if (!id) return;
        const draggedJob = jobs.find(j => j.id === id);
        if (draggedJob?.status === newStatus) return;
        moveJob(id, newStatus);
    }

    // Auto-fill from URL
    function handleUrlPaste(url) {
        setNewJob(prev => {
            const lower = url.toLowerCase();
            let company = "";
            if (lower.includes("google")) company = "Google";
            else if (lower.includes("amazon")) company = "Amazon";
            else if (lower.includes("meta") || lower.includes("facebook")) company = "Meta";
            else if (lower.includes("apple")) company = "Apple";
            else if (lower.includes("netflix")) company = "Netflix";
            else if (lower.includes("microsoft")) company = "Microsoft";
            else if (lower.includes("spotify")) company = "Spotify";
            else if (lower.includes("stripe")) company = "Stripe";
            else if (lower.includes("linkedin")) company = "LinkedIn";
            else {
                try {
                    const hostname = new URL(url).hostname;
                    company = hostname.replace("www.", "").replace("careers.", "").split(".")[0];
                    company = company.charAt(0).toUpperCase() + company.slice(1);
                } catch { /* ignore */ }
            }
            return { ...prev, url, company: company || prev.company };
        });
    }

    if (loading) return <div className="text-slate-500 p-8 text-center text-lg">Loading pipeline...</div>;

    return (
        <div className="text-slate-800 h-full flex flex-col font-sans max-w-7xl mx-auto space-y-6 pb-10">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl px-6 py-4 text-sm font-bold text-slate-800">
                    {toast}
                </div>
            )}

            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-5xl drop-shadow-md">📋</span>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Application Pipeline</h1>
                            <p className="text-white/80 font-medium">Track every job from saved to hired. Drag cards between columns.</p>
                        </div>
                    </div>
                    <button onClick={() => setIsAddOpen(true)} className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl text-sm font-bold transition shadow-lg shrink-0">
                        + Add Application
                    </button>
                </div>
            </header>

            {/* Analytics Dashboard */}
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                    { label: "Total Saved", value: totalJobs, icon: "📌", color: "text-blue-600" },
                    { label: "Applied", value: applied, icon: "📤", color: "text-blue-600" },
                    { label: "Response Rate", value: `${responseRate}%`, icon: "📊", color: "text-blue-600" },
                    { label: "Interview Conv.", value: `${interviewRate}%`, icon: "🎙️", color: "text-blue-600" },
                    { label: "Offer Rate", value: `${offerRate}%`, icon: "🎉", color: "text-green-600" },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{s.icon}</span>
                            <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                    </div>
                ))}
            </section>

            {/* Add Job Form */}
            {isAddOpen && (
                <form onSubmit={handleAddJob} className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-4">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Add New Application</h3>
                    
                    {/* URL auto-fill */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Job Posting URL (auto-fills company)</label>
                        <input
                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-800 focus:border-blue-500 outline-none"
                            value={newJob.url} 
                            onChange={e => handleUrlPaste(e.target.value)}
                            placeholder="https://careers.google.com/jobs/123 (auto-detects company)"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Company *</label>
                            <input required className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-800 focus:border-blue-500 outline-none"
                                value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} placeholder="Google" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Role *</label>
                            <input required className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-800 focus:border-blue-500 outline-none"
                                value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} placeholder="Frontend Engineer" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Salary</label>
                            <input className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-800 focus:border-blue-500 outline-none"
                                value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="$140k - $180k" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Follow-up Date</label>
                            <input type="date" className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-800 focus:border-blue-500 outline-none"
                                value={newJob.followUpDate} onChange={e => setNewJob({ ...newJob, followUpDate: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Notes</label>
                        <textarea className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-800 focus:border-blue-500 outline-none resize-none"
                            rows={2} value={newJob.notes} onChange={e => setNewJob({ ...newJob, notes: e.target.value })} placeholder="Interview prep notes, referral contacts, etc." />
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition">Save Application</button>
                        <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-500 hover:text-slate-700 px-4 py-2.5 text-sm font-bold transition">Cancel</button>
                    </div>
                </form>
            )}

            {/* Pipeline Visualization */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-slate-100 mb-6">
                    {COLUMNS.map(col => {
                        const count = jobs.filter(j => j.status === col.key).length;
                        const pct = totalJobs ? (count / totalJobs) * 100 : 0;
                        return pct > 0 ? <div key={col.key} className={`${col.color} h-full transition-all duration-500`} style={{ width: `${pct}%` }} title={`${col.label}: ${count}`}></div> : null;
                    })}
                </div>

                {/* Kanban Columns */}
                <div className="flex gap-3 items-start overflow-x-auto pb-4">
                    {COLUMNS.map(col => {
                        const colJobs = jobs.filter(j => j.status === col.key);
                        return (
                            <div key={col.key}
                                className="flex-1 min-w-[220px] bg-slate-50 rounded-xl p-3 border border-slate-200/60 min-h-[400px]"
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => drop(e, col.key)}
                            >
                                <h2 className="text-xs font-black tracking-widest text-slate-500 uppercase mb-3 flex justify-between items-center px-1">
                                    <span className="flex items-center gap-1.5">{col.emoji} {col.label}</span>
                                    <span className={`${col.color} text-white px-2 py-0.5 rounded-md text-[10px]`}>{colJobs.length}</span>
                                </h2>
                                <div className="space-y-2">
                                    {colJobs.map(job => (
                                        <div key={job.id} draggable
                                            onDragStart={(e) => e.dataTransfer.setData("jobId", job.id)}
                                            className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3 cursor-grab active:cursor-grabbing group transition-all hover:shadow-md"
                                        >
                                            <div className="flex justify-between items-start mb-1.5">
                                                <h3 className="font-bold text-sm text-slate-800 truncate pr-2 group-hover:text-blue-600 transition">{job.role}</h3>
                                                <button onClick={() => handleDelete(job.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition text-xs">✕</button>
                                            </div>
                                            <p className="text-xs font-semibold text-blue-600 mb-2">{job.company}</p>
                                            
                                            {/* Meta row */}
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {job.salary && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">💰 {job.salary}</span>}
                                                {job.source && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">{job.source}</span>}
                                            </div>

                                            {/* Expand button */}
                                            <button onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                                className="text-[10px] font-bold text-blue-500 hover:text-blue-700 transition">
                                                {expandedJob === job.id ? "▲ Less" : "▼ Details"}
                                            </button>

                                            {expandedJob === job.id && (
                                                <div className="mt-2 pt-2 border-t border-slate-100 space-y-2">
                                                    {job.url && (
                                                        <a href={job.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline block truncate">🔗 {job.url}</a>
                                                    )}
                                                    {job.followUpDate && (
                                                        <p className="text-xs text-slate-500">⏰ Follow-up: {new Date(job.followUpDate).toLocaleDateString()}</p>
                                                    )}
                                                    {job.notes && (
                                                        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">📝 {job.notes}</p>
                                                    )}
                                                    <p className="text-[10px] text-slate-400">Added: {new Date(job.createdAt || Date.now()).toLocaleDateString()}</p>
                                                    
                                                    {/* Quick move buttons */}
                                                    <div className="flex flex-wrap gap-1 pt-1">
                                                        {COLUMNS.filter(c => c.key !== col.key).map(c => (
                                                            <button key={c.key} onClick={() => moveJob(job.id, c.key)}
                                                                className="text-[10px] font-bold bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 px-2 py-1 rounded transition">
                                                                → {c.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {colJobs.length === 0 && (
                                        <p className="text-xs text-slate-300 text-center py-8 italic">Drop jobs here</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
