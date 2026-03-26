import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const MOCK_USER_ID = "user_dev_001";

export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");

    const [targetDomain, setTargetDomain] = useState("SWE");
    const [isPublicProfile, setIsPublicProfile] = useState(false);
    const [allowRecruiters, setAllowRecruiters] = useState(false);
    const [emailJobAlerts, setEmailJobAlerts] = useState(true);
    const [emailInterviewReminders, setEmailInterviewReminders] = useState(true);
    const [salaryRange, setSalaryRange] = useState("");
    const [locationPreference, setLocationPreference] = useState("remote");

    useEffect(() => { fetchSettings(); }, []);

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
            showToast("✅ Settings saved successfully!");
        } catch (err) {
            console.error(err);
            showToast("❌ Error saving settings");
        } finally {
            setSaving(false);
        }
    }

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    }

    function Toggle({ checked, onChange, label, description }) {
        return (
            <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="relative">
                    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
                    <div className={`w-12 h-7 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-slate-900 transition">{label}</p>
                    <p className="text-xs text-slate-400">{description}</p>
                </div>
            </label>
        );
    }

    if (loading) return <div className="text-slate-500 p-8 text-center text-lg">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 animate-in slide-in-from-top-2">
                    {toast}
                </div>
            )}

            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="text-4xl">⚙️</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
                    </div>
                    <p className="text-white/70 text-lg font-medium max-w-2xl">Manage your preferences, privacy controls, and job search configurations.</p>
                </div>
            </header>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Privacy */}
                <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">🔒</span>
                        Privacy & Visibility
                    </h2>
                    <div className="space-y-1">
                        <Toggle checked={isPublicProfile} onChange={e => setIsPublicProfile(e.target.checked)} label="Public Profile" description="Allow your profile to be indexed by search engines." />
                        <Toggle checked={allowRecruiters} onChange={e => setAllowRecruiters(e.target.checked)} label="Recruiter Visibility" description="Allow verified recruiters to message you directly." />
                    </div>
                </section>

                {/* Job Preferences */}
                <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">🎯</span>
                        Job Preferences
                    </h2>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Target Domain</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:border-blue-500 outline-none transition"
                                value={targetDomain} onChange={e => setTargetDomain(e.target.value)}>
                                <option value="SWE">Software Engineering</option>
                                <option value="PM">Product Management</option>
                                <option value="Data">Data Science & AI</option>
                                <option value="Design">Product Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Location Preference</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:border-blue-500 outline-none transition"
                                value={locationPreference} onChange={e => setLocationPreference(e.target.value)}>
                                <option value="remote">Remote Only</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="onsite">Onsite</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Target Salary Range</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:border-blue-500 outline-none transition"
                                value={salaryRange} onChange={e => setSalaryRange(e.target.value)} placeholder="e.g. $120,000 - $150,000" />
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">🔔</span>
                        Notifications
                    </h2>
                    <div className="space-y-1">
                        <Toggle checked={emailJobAlerts} onChange={e => setEmailJobAlerts(e.target.checked)} label="Weekly Job Alerts" description="Receive curated jobs matching your preferences." />
                        <Toggle checked={emailInterviewReminders} onChange={e => setEmailInterviewReminders(e.target.checked)} label="Interview Reminders" description="Get an email 24h before tracked interviews." />
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">⚠️</span>
                        Danger Zone
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">Permanent actions that cannot be undone.</p>
                    <div className="flex gap-3">
                        <button type="button" className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition">Export My Data</button>
                        <button type="button" className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition">Delete Account</button>
                    </div>
                </section>

                {/* Save */}
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" className="text-slate-400 hover:text-slate-600 text-sm font-bold px-6 py-3 transition">Cancel</button>
                    <button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-blue-300 hover:from-blue-700 hover:to-blue-400 text-white px-10 py-3.5 rounded-2xl font-bold transition disabled:opacity-50 shadow-xl shadow-blue-500/20 text-sm">
                        {saving ? "Saving..." : "💾 Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
