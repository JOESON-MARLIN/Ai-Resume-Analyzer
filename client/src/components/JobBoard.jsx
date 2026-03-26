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

    if (loading) return <div className="text-black">Loading...</div>;

    return (
        <div className="text-black h-full flex flex-col font-sans max-w-7xl mx-auto space-y-6 animate-in fade-in pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-blue-600/10 to-blue-500/5 border border-blue-500/20 rounded-3xl p-10 shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-48 h-48 bg-slate-500/10 rounded-full blur-3xl translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute left-0 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-x-10 translate-y-10 group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="relative z-10 flex items-center gap-4">
                    <span className="text-5xl drop-shadow-md">📋</span>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-black drop-shadow-md">Application Pipeline</h1>
                        <p className="text-black/90 font-medium text-lg">Track your prospects from saved to hired.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="relative z-10 bg-slate-50 hover:bg-white text-blue-600 hover:text-[#065F46] px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg transform hover:-translate-y-1 shrink-0"
                >
                    + Add Application
                </button>
            </header>

            {/* Analytics Dashboard */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                <div className="bg-white border border-slate-100 rounded-xl p-5">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Total Saved</p>
                    <p className="text-3xl font-black text-black">{totalJobs}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-5">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Total Applied</p>
                    <p className="text-3xl font-black text-blue-400">{applied}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl translate-x-10 -translate-y-10"></div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Response Rate</p>
                    <p className="text-3xl font-black text-blue-600">{responseRate}%</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl translate-x-10 -translate-y-10"></div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Interview Conv.</p>
                    <p className="text-3xl font-black text-blue-600">{interviewRate}%</p>
                </div>
            </section>

            {isAddOpen && (
                <form onSubmit={handleAddJob} className="p-5 rounded-2xl border border-slate-100 bg-white flex flex-wrap md:flex-nowrap gap-4 items-end mb-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-blue-600 uppercase mb-2 block">Company</label>
                        <input
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-black focus:border-blue-500"
                            value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-blue-600 uppercase mb-2 block">Role</label>
                        <input
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-black focus:border-blue-500"
                            value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })}
                        />
                    </div>
                    <div className="min-w-[150px]">
                        <label className="text-xs font-bold text-blue-600 uppercase mb-2 block">Status</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-black focus:border-blue-500"
                            value={newJob.status} onChange={e => setNewJob({ ...newJob, status: e.target.value })}
                        >
                            {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="bg-blue-700 hover:bg-blue-500 text-black px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0">
                        Save
                    </button>
                    <button type="button" onClick={() => setIsAddOpen(false)} className="bg-transparent border border-[#5a6b8a] text-slate-600 hover:text-black px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0">
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
                            className="flex-1 min-w-[250px] bg-slate-500/50 rounded-xl p-3 border border-slate-100 min-h-[500px]"
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => drop(e, col)}
                        >
                            <h2 className="text-xs font-black tracking-widest text-blue-600 uppercase mb-4 flex justify-between items-center px-1">
                                {col} <span className="bg-[#1F2937] text-slate-700 px-2.5 py-1 rounded-md">{colJobs.length}</span>
                            </h2>
                            <div className="space-y-3">
                                {colJobs.map(job => (
                                    <div
                                        key={job.id}
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData("jobId", job.id)}
                                        className="bg-white border border-slate-100 hover:border-[#5a6b8a] rounded-xl p-4 cursor-grab active:cursor-grabbing group transition-colors shadow-sm"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-800 truncate pr-2 group-hover:text-blue-400 transition-colors">{job.role}</h3>
                                            <button onClick={() => handleDelete(job.id)} className="text-blue-600 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition">✕</button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-sm font-medium text-slate-600">{job.company}</p>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase">{job.source || "Manual"}</p>
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
