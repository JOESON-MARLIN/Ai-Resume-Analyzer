import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

const COLUMNS = ["SAVED", "APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"];

export default function JobBoard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newJob, setNewJob] = useState({ company: "", role: "", status: "SAVED" });

    // Analytics calculations
    const totalJobs = jobs.length;
    const applied = jobs.filter(j => j.status !== "SAVED").length;
    const responses = jobs.filter(j => ["INTERVIEWING", "OFFERED", "REJECTED"].includes(j.status)).length;
    const interviews = jobs.filter(j => ["INTERVIEWING", "OFFERED"].includes(j.status)).length;
    
    const responseRate = applied ? Math.round((responses / applied) * 100) : 0;
    const interviewRate = applied ? Math.round((interviews / applied) * 100) : 0;

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        try {
            const { data } = await axios.get(`${API_BASE}/api/jobs/${MOCK_USER_ID}`);
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddJob(e) {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_BASE}/api/jobs`, {
                ...newJob,
                userId: MOCK_USER_ID,
            });
            setJobs([data, ...jobs]);
            setIsAddOpen(false);
            setNewJob({ company: "", role: "", status: "SAVED" });
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(id) {
        try {
            await axios.delete(`${API_BASE}/api/jobs/${id}`);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    async function drop(e, newStatus) {
        const id = e.dataTransfer.getData("jobId");
        if (!id) return;

        // Optimistic UI update
        const draggedJob = jobs.find(j => j.id === id);
        if (draggedJob.status === newStatus) return;

        setJobs(prev => prev.map(j => (j.id === id ? { ...j, status: newStatus } : j)));

        // Server update
        try {
            await axios.patch(`${API_BASE}/api/jobs/${id}/status`, { status: newStatus });
        } catch (err) {
            console.error("Revert", err);
            fetchJobs(); // revert on fail
        }
    }

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="text-white h-full flex flex-col font-sans max-w-7xl mx-auto space-y-6 animate-in fade-in">
            <header className="flex justify-between items-end border-b border-[#1e2330] pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Application Pipeline</h1>
                    <p className="text-[#8598b9]">Track your prospects from saved to hired.</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2"
                >
                    + Add Application
                </button>
            </header>

            {/* Analytics Dashboard */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                <div className="bg-[#131823] border border-[#1e2330] rounded-xl p-5">
                    <p className="text-xs font-bold text-[#5a6b8a] uppercase tracking-wider mb-2">Total Saved</p>
                    <p className="text-3xl font-black text-white">{totalJobs}</p>
                </div>
                <div className="bg-[#131823] border border-[#1e2330] rounded-xl p-5">
                    <p className="text-xs font-bold text-[#5a6b8a] uppercase tracking-wider mb-2">Total Applied</p>
                    <p className="text-3xl font-black text-blue-400">{applied}</p>
                </div>
                <div className="bg-[#131823] border border-[#1e2330] rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl translate-x-10 -translate-y-10"></div>
                    <p className="text-xs font-bold text-[#5a6b8a] uppercase tracking-wider mb-2">Response Rate</p>
                    <p className="text-3xl font-black text-emerald-400">{responseRate}%</p>
                </div>
                <div className="bg-[#131823] border border-[#1e2330] rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl translate-x-10 -translate-y-10"></div>
                    <p className="text-xs font-bold text-[#5a6b8a] uppercase tracking-wider mb-2">Interview Conv.</p>
                    <p className="text-3xl font-black text-amber-400">{interviewRate}%</p>
                </div>
            </section>

            {isAddOpen && (
                <form onSubmit={handleAddJob} className="p-5 rounded-2xl border border-[#1e2330] bg-[#131823] flex flex-wrap md:flex-nowrap gap-4 items-end mb-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Company</label>
                        <input
                            required
                            className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500"
                            value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Role</label>
                        <input
                            required
                            className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500"
                            value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })}
                        />
                    </div>
                    <div className="min-w-[150px]">
                        <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Status</label>
                        <select
                            className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500"
                            value={newJob.status} onChange={e => setNewJob({ ...newJob, status: e.target.value })}
                        >
                            {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0">
                        Save
                    </button>
                    <button type="button" onClick={() => setIsAddOpen(false)} className="bg-transparent border border-[#5a6b8a] text-[#8598b9] hover:text-white px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0">
                        Cancel
                    </button>
                </form>
            )}

            <div className="flex gap-4 flex-1 items-start overflow-x-auto pb-4">
                {COLUMNS.map(col => {
                    const colJobs = jobs.filter(j => j.status === col);
                    return (
                        <div
                            key={col}
                            className="flex-1 min-w-[250px] bg-slate-900/50 rounded-xl p-3 border border-slate-800 min-h-[500px]"
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => drop(e, col)}
                        >
                            <h2 className="text-xs font-black tracking-widest text-[#5a6b8a] uppercase mb-4 flex justify-between items-center px-1">
                                {col} <span className="bg-[#1e2330] text-slate-300 px-2.5 py-1 rounded-md">{colJobs.length}</span>
                            </h2>
                            <div className="space-y-3">
                                {colJobs.map(job => (
                                    <div
                                        key={job.id}
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData("jobId", job.id)}
                                        className="bg-[#131823] border border-[#1e2330] hover:border-[#5a6b8a] rounded-xl p-4 cursor-grab active:cursor-grabbing group transition-colors shadow-sm"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-200 truncate pr-2 group-hover:text-blue-400 transition-colors">{job.role}</h3>
                                            <button onClick={() => handleDelete(job.id)} className="text-[#5a6b8a] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition">✕</button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-sm font-medium text-[#8598b9]">{job.company}</p>
                                            <p className="text-[10px] font-bold text-[#5a6b8a] uppercase">{job.source || "Manual"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
