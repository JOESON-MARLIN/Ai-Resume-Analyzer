import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [targetDomain, setTargetDomain] = useState("SWE");
    const [isPublicProfile, setIsPublicProfile] = useState(false);
    const [allowRecruiters, setAllowRecruiters] = useState(false);
    const [emailJobAlerts, setEmailJobAlerts] = useState(true);
    const [emailInterviewReminders, setEmailInterviewReminders] = useState(true);
    const [salaryRange, setSalaryRange] = useState("");
    const [locationPreference, setLocationPreference] = useState("remote");

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const { data } = await axios.get(`${API_BASE}/api/profile/settings/${MOCK_USER_ID}`);
            setSettings(data);
            setTargetDomain(data.targetDomain || "SWE");
            setIsPublicProfile(data.isPublicProfile || false);
            setAllowRecruiters(data.allowRecruiters || false);
            setEmailJobAlerts(data.emailJobAlerts ?? true);
            setEmailInterviewReminders(data.emailInterviewReminders ?? true);
            setSalaryRange(data.salaryRange || "");
            setLocationPreference(data.locationPreference || "remote");
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${API_BASE}/api/profile/settings/${MOCK_USER_ID}`, {
                targetDomain, isPublicProfile, allowRecruiters, 
                emailJobAlerts, emailInterviewReminders,
                salaryRange, locationPreference
            });
            alert("Settings updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="text-white p-8">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto text-white space-y-8 animate-in fade-in">
            <header className="mb-8 border-b border-[#1e2330] pb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Account Settings</h1>
                <p className="text-[#8598b9]">Manage your preferences, privacy, and job search configurations.</p>
            </header>

            <form onSubmit={handleSave} className="space-y-8">
                
                {/* Privacy & Visibility */}
                <section className="bg-[#131823] border border-[#1e2330] rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-purple-500">🔒</span> Privacy Options
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input type="checkbox" checked={isPublicProfile} onChange={e => setIsPublicProfile(e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                            <div>
                                <p className="font-bold text-slate-200 group-hover:text-white transition">Public Profile</p>
                                <p className="text-sm text-[#5a6b8a]">Allow your profile to be indexed by search engines.</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input type="checkbox" checked={allowRecruiters} onChange={e => setAllowRecruiters(e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                            <div>
                                <p className="font-bold text-slate-200 group-hover:text-white transition">Recruiter Visibility</p>
                                <p className="text-sm text-[#5a6b8a]">Allow verified recruiters to message you directly.</p>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Job Search Preferences */}
                <section className="bg-[#131823] border border-[#1e2330] rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-emerald-500">🎯</span> Job Preferences
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Target Domain</label>
                            <select className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500 transition-colors"
                                value={targetDomain} onChange={e => setTargetDomain(e.target.value)}>
                                <option value="SWE">Software Engineering</option>
                                <option value="PM">Product Management</option>
                                <option value="Data">Data Science & AI</option>
                                <option value="Design">Product Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Location Preference</label>
                            <select className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500 transition-colors"
                                value={locationPreference} onChange={e => setLocationPreference(e.target.value)}>
                                <option value="remote">Remote Only</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="onsite">Onsite</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-[#5a6b8a] uppercase mb-2 block">Target Salary Range</label>
                            <input className="w-full bg-[#0B0E14] border border-[#1e2330] rounded-lg p-3 text-sm text-white focus:border-blue-500 transition-colors"
                                value={salaryRange} onChange={e => setSalaryRange(e.target.value)} placeholder="e.g. $120,000 - $150,000" />
                        </div>
                    </div>
                </section>

                {/* Notification Settings */}
                <section className="bg-[#131823] border border-[#1e2330] rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-amber-500">🔔</span> Notifications
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input type="checkbox" checked={emailJobAlerts} onChange={e => setEmailJobAlerts(e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                            <div>
                                <p className="font-bold text-slate-200 group-hover:text-white transition">Weekly Job Alerts</p>
                                <p className="text-sm text-[#5a6b8a]">Receive curated jobs matching your preferences.</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input type="checkbox" checked={emailInterviewReminders} onChange={e => setEmailInterviewReminders(e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                            <div>
                                <p className="font-bold text-slate-200 group-hover:text-white transition">Interview Reminders</p>
                                <p className="text-sm text-[#5a6b8a]">Get an email 24h before tracked interviews.</p>
                            </div>
                        </label>
                    </div>
                </section>

                <div className="flex justify-end gap-4">
                    <button type="button" className="text-[#8598b9] hover:text-white px-4">Cancel</button>
                    <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50">
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
