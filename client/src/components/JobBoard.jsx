import { useState, useMemo, useEffect } from "react";
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const COLUMNS = [
    { id: "SAVED", label: "Saved", icon: "⭐", borderTop: "border-slate-300" },
    { id: "APPLIED", label: "Applied", icon: "📝", borderTop: "border-blue-400" },
    { id: "INTERVIEWING", label: "Interview", icon: "🎙️", borderTop: "border-purple-400" },
    { id: "OFFERED", label: "Offer", icon: "🎉", borderTop: "border-green-400" },
    { id: "REJECTED", label: "Closed", icon: "🛑", borderTop: "border-red-400" }
];

export default function JobBoard() {
    const [jobs, setJobs] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [expandedJob, setExpandedJob] = useState(null);
    const [newJob, setNewJob] = useState({ company: "", role: "", url: "", salary: "", source: "", notes: "" });
    const [dragActive, setDragActive] = useState(false);
    const [draggedJob, setDraggedJob] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get(`${API_BASE}/api/applications`);
                setJobs(data);
            } catch (error) {
                console.error("Failed to load applications", error);
            }
        };
        fetchJobs();
    }, []);

    const stats = useMemo(() => {
        const counts = { SAVED: 0, APPLIED: 0, INTERVIEWING: 0, OFFERED: 0, REJECTED: 0 };
        jobs.forEach(job => counts[job.status]++);
        const total = jobs.length;
        const active = counts.APPLIED + counts.INTERVIEWING;
        const responseRate = counts.APPLIED > 0 ? Math.round((counts.INTERVIEWING + counts.OFFERED) / counts.APPLIED * 100) : 0;
        return { total, active, interviews: counts.INTERVIEWING, offers: counts.OFFERED, responseRate, counts };
    }, [jobs]);

    function showToast(msg) {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    }

    async function handleAddJob(e) {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_BASE}/api/applications`, { ...newJob, status: "SAVED" });
            setJobs([data, ...jobs]);
            setNewJob({ company: "", role: "", url: "", salary: "", source: "", notes: "" });
            setIsAdding(false);
            showToast("Job added to pipeline!");
        } catch (error) {
            console.error("Failed to add job", error);
        }
    }

    async function handleDelete(id) {
        try {
            await axios.delete(`${API_BASE}/api/applications/${id}`);
            setJobs(jobs.filter(j => j.id !== id));
            showToast("Job removed");
        } catch (error) {
            console.error(error);
        }
    }

    function toggleExpand(id) {
        setExpandedJob(expandedJob === id ? null : id);
    }

    // --- Drag & Drop ---
    function handleDragStart(job) {
        setDraggedJob(job);
        setDragActive(true);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    async function handleDragEnd(e) {
        setDragActive(false);
        if (!draggedJob) return;

        const container = e.target.closest('.column-container');
        if (!container) {
            setDraggedJob(null);
            return;
        }

        const newStatus = container.getAttribute('data-status');
        if (newStatus && draggedJob.status !== newStatus) {
            try {
                const updatedJob = { ...draggedJob, status: newStatus };
                setJobs(jobs.map(j => j.id === draggedJob.id ? updatedJob : j));
                await axios.patch(`${API_BASE}/api/applications/${draggedJob.id}/status`, { status: newStatus });
            } catch (error) {
                console.error("Failed to update status", error);
                setJobs([...jobs]); // Revert state if backend fails
            }
        }
        setDraggedJob(null);
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10">
            {/* Header omitted for brevity, keeping it simple but beautiful */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl">📋</span>
                            <h1 className="text-3xl font-extrabold tracking-tight">Job Tracker</h1>
                        </div>
                        <p className="text-white/80 text-lg font-medium max-w-xl">Manage your applications and interviews in one drag-and-drop workspace.</p>
                    </div>
                    <button onClick={() => setIsAdding(!isAdding)} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition">
                        {isAdding ? "Cancel" : "+ Add Job Manually"}
                    </button>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white border text-left border-slate-200/60 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Jobs</span>
                    <span className="text-2xl font-black text-slate-800">{stats.total}</span>
                </div>
                <div className="bg-white border text-left border-slate-200/60 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Apps</span>
                    <span className="text-2xl font-black text-blue-600">{stats.active}</span>
                </div>
                <div className="bg-white border text-left border-slate-200/60 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Interviews</span>
                    <span className="text-2xl font-black text-purple-600">{stats.interviews}</span>
                </div>
                <div className="bg-white border text-left border-slate-200/60 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Response Rate</span>
                    <span className="text-2xl font-black text-slate-800">{stats.responseRate}%</span>
                </div>
                <div className="bg-white border text-left border-slate-200/60 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Offers</span>
                    <span className="text-2xl font-black text-green-600">{stats.offers}</span>
                </div>
            </div>

            {/* Add Job Panel */}
            {isAdding && (
                <form onSubmit={handleAddJob} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-lg transform transition-all">
                    <div className="grid md:grid-cols-3 gap-5 mb-5">
                        <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Company *</label><input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. Google" /></div>
                        <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Role *</label><input required value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. Frontend Engineer" /></div>
                        <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Salary Base</label><input value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. $150k" /></div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md shadow-blue-500/20">Save Job Details</button>
                    </div>
                </form>
            )}

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {COLUMNS.map(col => (
                    <div key={col.id} className={`column-container min-w-[300px] flex-1 flex flex-col bg-slate-50 rounded-2xl border-t-4 border-slate-200/50 ${col.borderTop}`} data-status={col.id} onDragOver={handleDragOver} onDrop={handleDragEnd}>
                        <div className="p-4 flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
                                <span>{col.icon}</span> {col.label}
                            </h3>
                            <span className="text-xs font-bold bg-white text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">{stats.counts[col.id]}</span>
                        </div>
                        
                        <div className={`flex-1 p-3 space-y-3 transition-colors ${dragActive ? 'bg-slate-100/50' : ''}`}>
                            {jobs.filter(j => j.status === col.id).map(job => (
                                <div key={job.id} draggable onDragStart={() => handleDragStart(job)} onDragEnd={handleDragEnd}
                                    className="bg-white border border-slate-200/60 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md transition group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-800 leading-tight">{job.company}</h4>
                                        <button onClick={() => handleDelete(job.id)} className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">✕</button>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium mb-3">{job.role}</p>
                                    
                                    <div className="flex space-x-2">
                                        <button onClick={() => toggleExpand(job.id)} className="flex-1 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 rounded transition">
                                            {expandedJob === job.id ? 'Close' : 'Details'}
                                        </button>
                                    </div>
                                    
                                    {expandedJob === job.id && (
                                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                                            {job.salary && <p><span className="font-bold">💰 Salary:</span> {job.salary}</p>}
                                            {job.notes && <p className="italic bg-yellow-50 p-2 rounded text-yellow-800">"{job.notes}"</p>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {toastMessage && (
                <div className="fixed bottom-10 right-10 bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
                    <span>✨</span> {toastMessage}
                </div>
            )}
        </div>
    );
}
