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
        <div className="text-white h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Job Tracker</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                    + Add Application
                </button>
            </div>

            {isAddOpen && (
                <form onSubmit={handleAddJob} className="mb-6 p-4 rounded-xl border border-slate-700 bg-slate-800 flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-xs text-slate-400 mb-1 block uppercase">Company</label>
                        <input
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
                            value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-400 mb-1 block uppercase">Role</label>
                        <input
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
                            value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block uppercase">Status</label>
                        <select
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
                            value={newJob.status} onChange={e => setNewJob({ ...newJob, status: e.target.value })}
                        >
                            {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold h-[38px]">
                        Save
                    </button>
                    <button type="button" onClick={() => setIsAddOpen(false)} className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold h-[38px]">
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
                            <h2 className="text-xs font-black tracking-widest text-slate-500 uppercase mb-3 flex justify-between">
                                {col} <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{colJobs.length}</span>
                            </h2>
                            <div className="space-y-3">
                                {colJobs.map(job => (
                                    <div
                                        key={job.id}
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData("jobId", job.id)}
                                        className="bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-grab active:cursor-grabbing group"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-white truncate max-w-[80%]">{job.role}</h3>
                                            <button onClick={() => handleDelete(job.id)} className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition">✕</button>
                                        </div>
                                        <p className="text-sm text-slate-400">{job.company}</p>
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
