import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Core details
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");

    // Relationships
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

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
                name, phone, location, bio, linkedinUrl: linkedin, githubUrl: github
            });
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Error saving profile");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="text-white p-8">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto text-white space-y-8 animate-in fade-in">
            <header className="mb-8 border-b border-[#1e2330] pb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#004a7c]">
                    <span className="text-[#f26522]">My</span> Profile
                </h1>
                <p className="text-[#8598b9]">The Master File that powers your AI Resume tailoring.</p>
            </header>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Core Details */}
                <section className="bg-[#131823] border border-[#1e2330] rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-blue-500">👤</span> Core Details
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Full Name</label>
                            <input className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500 transition-colors"
                                value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Location</label>
                            <input className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500 transition-colors"
                                value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Phone</label>
                            <input className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500 transition-colors"
                                value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">LinkedIn URL</label>
                            <input className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500 transition-colors"
                                value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Professional Bio</label>
                            <textarea rows={4} className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500 transition-colors"
                                value={bio} onChange={e => setBio(e.target.value)} placeholder="A short summary of your professional journey..." />
                        </div>
                    </div>
                </section>

                {/* Experience (Read Only List for V3 Demo) */}
                <section className="bg-[#131823] border border-[#1e2330] rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="text-emerald-500">💼</span> Experience
                        </h2>
                        <button type="button" className="text-xs font-bold bg-[#0B0E14] border border-[#1e2330] text-[#8598b9] px-3 py-1.5 rounded-lg hover:text-white transition">+ Add</button>
                    </div>
                    {experiences.length === 0 ? (
                        <p className="text-sm text-[#5a6b8a] italic">No experiences added yet. The AI currently pulls this from your uploaded Master Resume PDF.</p>
                    ) : (
                        <div className="space-y-4">
                            {experiences.map(exp => (
                                <div key={exp.id} className="bg-[#0B0E14] border border-[#1e2330] rounded-xl p-4">
                                    <h3 className="font-bold text-white">{exp.role}</h3>
                                    <p className="text-sm text-[#8598b9]">{exp.company}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="flex justify-end">
                    <button type="submit" disabled={saving} className="bg-[#f26522] hover:bg-[#d9561c] text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50 shadow-lg shadow-orange-500/20">
                        {saving ? "Saving..." : "Save Profile Updates"}
                    </button>
                </div>
            </form>
        </div>
    );
}
