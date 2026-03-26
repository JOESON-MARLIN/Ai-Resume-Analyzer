import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");
    
    // Core details
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");

    // Skills
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");

    // Experiences
    const [experiences, setExperiences] = useState([]);
    const [showExpForm, setShowExpForm] = useState(false);
    const [expForm, setExpForm] = useState({ role: "", company: "", startDate: "", endDate: "", description: "" });

    // Educations
    const [educations, setEducations] = useState([]);

    useEffect(() => { fetchProfile(); }, []);

    async function fetchProfile() {
        try {
            const { data } = await axios.get(`${API_BASE}/api/profile/user/${MOCK_USER_ID}`);
            setProfile(data);
            setName(data.name || "");
            setPhone(data.phone || "");
            setLocation(data.location || "");
            setBio(data.bio || "");
            setLinkedin(data.linkedinUrl || "");
            setGithub(data.githubUrl || "");
            setSkills(data.skills || []);
            setExperiences(data.experiences || []);
            setEducations(data.educations || []);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${API_BASE}/api/profile/user/${MOCK_USER_ID}`, {
                name, phone, location, bio, linkedinUrl: linkedin, githubUrl: github, skills
            });
            showToast("✅ Profile updated successfully!");
        } catch (err) {
            console.error(err);
            showToast("❌ Error saving profile");
        } finally {
            setSaving(false);
        }
    }

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    }

    function addSkill() {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    }

    function removeSkill(s) {
        setSkills(skills.filter(sk => sk !== s));
    }

    function addExperience() {
        if (!expForm.role || !expForm.company) return;
        setExperiences([...experiences, { ...expForm, id: Date.now().toString() }]);
        setExpForm({ role: "", company: "", startDate: "", endDate: "", description: "" });
        setShowExpForm(false);
    }

    function removeExperience(id) {
        setExperiences(experiences.filter(exp => exp.id !== id));
    }

    // Profile completeness
    const completeness = Math.min(100, [name, phone, location, bio, linkedin, github].filter(Boolean).length * 12 + skills.length * 4 + experiences.length * 10);

    if (loading) return <div className="text-slate-500 p-8 text-center text-lg">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-10">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 animate-in slide-in-from-top-2 duration-300">
                    {toast}
                </div>
            )}

            {/* Hero Header */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-300 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-lg">👤</div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">{name || "Your Profile"}</h1>
                        <p className="text-white/80 text-sm font-medium mt-1">The master file that powers your career toolkit.</p>
                    </div>
                </div>
                {/* Completeness Bar */}
                <div className="relative z-10 mt-6">
                    <div className="flex justify-between text-xs font-bold text-white/70 mb-1">
                        <span>Profile Completeness</span>
                        <span>{completeness}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: `${completeness}%` }}></div>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Core Details */}
                <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">👤</span>
                        Core Details
                    </h2>
                    <div className="grid md:grid-cols-2 gap-5">
                        {[
                            { label: "Full Name", value: name, setter: setName, placeholder: "John Doe" },
                            { label: "Location", value: location, setter: setLocation, placeholder: "San Francisco, CA" },
                            { label: "Phone", value: phone, setter: setPhone, placeholder: "+1 (555) 123-4567" },
                            { label: "LinkedIn URL", value: linkedin, setter: setLinkedin, placeholder: "https://linkedin.com/in/you" },
                            { label: "GitHub URL", value: github, setter: setGithub, placeholder: "https://github.com/you" },
                        ].map(field => (
                            <div key={field.label}>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">{field.label}</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    value={field.value} onChange={e => field.setter(e.target.value)} placeholder={field.placeholder} />
                            </div>
                        ))}
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Professional Bio</label>
                            <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                value={bio} onChange={e => setBio(e.target.value)} placeholder="A short summary of your professional journey..." />
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">🏷️</span>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map(s => (
                            <span key={s} className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold group">
                                {s}
                                <button type="button" onClick={() => removeSkill(s)} className="text-blue-400 hover:text-blue-500 transition text-base leading-none">×</button>
                            </span>
                        ))}
                        {skills.length === 0 && <p className="text-sm text-slate-400 italic">No skills added yet.</p>}
                    </div>
                    <div className="flex gap-2">
                        <input className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 transition"
                            value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill (e.g. React, Python)"
                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                        <button type="button" onClick={addSkill} className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/20">Add</button>
                    </div>
                </section>

                {/* Experience */}
                <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">💼</span>
                            Experience
                        </h2>
                        <button type="button" onClick={() => setShowExpForm(!showExpForm)} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20">
                            {showExpForm ? "Cancel" : "+ Add"}
                        </button>
                    </div>

                    {showExpForm && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4 space-y-3 animate-in slide-in-from-top-2">
                            <div className="grid md:grid-cols-2 gap-3">
                                <input className="bg-white border border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="Role / Title" value={expForm.role} onChange={e => setExpForm({...expForm, role: e.target.value})} />
                                <input className="bg-white border border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="Company" value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} />
                                <input className="bg-white border border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="Start Date" value={expForm.startDate} onChange={e => setExpForm({...expForm, startDate: e.target.value})} />
                                <input className="bg-white border border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="End Date (or Present)" value={expForm.endDate} onChange={e => setExpForm({...expForm, endDate: e.target.value})} />
                            </div>
                            <textarea rows={2} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" placeholder="Brief description..." value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} />
                            <button type="button" onClick={addExperience} className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">Save Experience</button>
                        </div>
                    )}

                    {experiences.length === 0 && !showExpForm ? (
                        <p className="text-sm text-slate-400 italic">No experiences added. Click "+ Add" to get started.</p>
                    ) : (
                        <div className="space-y-3">
                            {experiences.map(exp => (
                                <div key={exp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-start group hover:border-blue-300 transition">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{exp.role}</h3>
                                        <p className="text-sm text-slate-500">{exp.company} {exp.startDate && `· ${exp.startDate} — ${exp.endDate || "Present"}`}</p>
                                        {exp.description && <p className="text-xs text-slate-400 mt-1">{exp.description}</p>}
                                    </div>
                                    <button type="button" onClick={() => removeExperience(exp.id)} className="text-slate-300 hover:text-blue-500 transition text-lg opacity-0 group-hover:opacity-100">×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-blue-300 hover:from-blue-700 hover:to-blue-400 text-white px-10 py-3.5 rounded-2xl font-bold transition disabled:opacity-50 shadow-xl shadow-blue-500/20 text-sm">
                        {saving ? "Saving..." : "💾 Save Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
