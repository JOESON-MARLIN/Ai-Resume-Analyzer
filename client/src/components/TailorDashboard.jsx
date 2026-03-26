// TailorDashboard.jsx
// Career Copilot — 1-Click Tailor UI
// Production-grade React component with Socket.io real-time streaming,
// Tailwind CSS styling, and full result rendering.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// Status steps in order — drives the progress stepper UI
const STEPS = [
    { key: "loading_profile", label: "Loading profile" },
    { key: "saving_job", label: "Saving job posting" },
    { key: "reading_jd", label: "Analyzing job description" },
    { key: "ai_processing", label: "AI rewriting bullets" },
    { key: "parsing_result", label: "Scoring match" },
    { key: "saving", label: "Saving resume" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressStepper({ currentStep, progress, message }) {
    const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 backdrop-blur-sm">
            {/* Progress bar */}
            <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Status message */}
            <p className="mb-5 flex items-center gap-2 text-sm font-medium text-cyan-400">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                {message}
            </p>

            {/* Step list */}
            <ol className="space-y-2">
                {STEPS.map((step, idx) => {
                    const done = idx < currentIdx;
                    const active = idx === currentIdx;
                    const pending = idx > currentIdx;
                    return (
                        <li key={step.key} className="flex items-center gap-3 text-sm">
                            <span
                                className={[
                                    "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300",
                                    done ? "border-violet-500 bg-violet-500 text-white" : "",
                                    active ? "border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "",
                                    pending ? "border-slate-600 text-slate-600" : "",
                                ].join(" ")}
                            >
                                {done ? "✓" : idx + 1}
                            </span>
                            <span
                                className={[
                                    "transition-colors duration-300",
                                    done ? "text-slate-400 line-through" : "",
                                    active ? "font-semibold text-white" : "",
                                    pending ? "text-slate-600" : "",
                                ].join(" ")}
                            >
                                {step.label}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

function ScoreBadge({ score }) {
    const color =
        score >= 80 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
            : score >= 60 ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
                : "text-rose-400 border-rose-500/40 bg-rose-500/10";

    return (
        <div className={`inline-flex flex-col items-center rounded-2xl border px-6 py-4 ${color}`}>
            <span className="text-4xl font-black tabular-nums">{score}</span>
            <span className="text-xs font-semibold uppercase tracking-widest opacity-70">Match Score</span>
        </div>
    );
}

function KeywordPills({ matched = [], missed = [] }) {
    return (
        <div className="space-y-3">
            <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Keywords Matched ({matched.length})
                </p>
                <div className="flex flex-wrap gap-2">
                    {matched.map((kw) => (
                        <span key={kw} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                            {kw}
                        </span>
                    ))}
                    {matched.length === 0 && <span className="text-xs text-slate-500">None detected</span>}
                </div>
            </div>

            <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-rose-400">
                    Keywords Missed ({missed.length})
                </p>
                <div className="flex flex-wrap gap-2">
                    {missed.map((kw) => (
                        <span key={kw} className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 ring-1 ring-rose-500/30">
                            {kw}
                        </span>
                    ))}
                    {missed.length === 0 && <span className="text-xs text-slate-500">None — great coverage!</span>}
                </div>
            </div>
        </div>
    );
}

function ExperienceSection({ experience = [] }) {
    return (
        <div className="space-y-6">
            {experience.map((role) => (
                <div key={role.id} className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                            <h4 className="font-semibold text-white">{role.title}</h4>
                            <p className="text-sm text-slate-400">{role.company} · {role.location}</p>
                        </div>
                        <span className="shrink-0 text-xs text-slate-500">
                            {role.startDate} — {role.isCurrent ? "Present" : role.endDate}
                        </span>
                    </div>
                    <ul className="space-y-1.5">
                        {role.bullets.map((b, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-300">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                {b}
                            </li>
                        ))}
                    </ul>
                    {role.technologies?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {role.technologies.map((t) => (
                                <span key={t} className="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-400">{t}</span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TailorDashboard({ userId }) {
    const navigate = useNavigate();
    // ── Form state ──────────────────────────────────────────────────────────────
    const [jobDescription, setJobDescription] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");

    // ── Process state ────────────────────────────────────────────────────────────
    const [phase, setPhase] = useState("idle"); // idle | processing | done | error
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // ── Result state ─────────────────────────────────────────────────────────────
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState("summary");

    // ── Socket ref ───────────────────────────────────────────────────────────────
    // We keep socket in a ref so event handlers always see the latest instance
    // without re-registering listeners on every render.
    const socketRef = useRef(null);

    // ─── Socket lifecycle ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!userId) return;

        const socket = io(API_BASE, {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("[Socket] Connected:", socket.id);
            socket.emit("register", { userId });
        });

        socket.on("registered", ({ room }) => {
            console.log("[Socket] Joined room:", room);
        });

        // ── Real-time status updates ─────────────────────────────────────────────
        socket.on("tailor:status", ({ step, message, progress: p }) => {
            setCurrentStep(step);
            setStatusMessage(message);
            setProgress(p);
        });

        // ── Completion ───────────────────────────────────────────────────────────
        socket.on("tailor:complete", (data) => {
            setProgress(100);
            setStatusMessage("Redirecting to your results...");
            navigate("/results", { state: { result: data } });
        });

        // ── Error ────────────────────────────────────────────────────────────────
        socket.on("tailor:error", ({ message, detail }) => {
            setErrorMessage(detail ?? message ?? "An unexpected error occurred.");
            setPhase("error");
        });

        socket.on("disconnect", () => {
            console.log("[Socket] Disconnected");
        });

        socket.on("connect_error", (err) => {
            console.error("[Socket] Connection error:", err.message);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [userId, navigate]);

    // ─── Submit handler ───────────────────────────────────────────────────────────
    const handleTailor = useCallback(async () => {
        if (!jobDescription.trim() || jobDescription.trim().length < 50) return;

        setPhase("processing");
        setProgress(0);
        setCurrentStep("loading_profile");
        setStatusMessage("Starting…");
        setErrorMessage("");
        setResult(null);

        try {
            await axios.post(`${API_BASE}/api/tailor`, {
                userId,
                jobDescription: jobDescription.trim(),
                jobTitle: jobTitle.trim() || undefined,
                company: company.trim() || undefined,
            });
            // Backend responds 202 — further updates come via socket events
        } catch (err) {
            const msg = err.response?.data?.error ?? err.message ?? "Request failed";
            setErrorMessage(msg);
            setPhase("error");
        }
    }, [userId, jobDescription, jobTitle, company]);

    // ─── Derived ────────────────────────────────────────────────────────────────
    const canSubmit = jobDescription.trim().length >= 50 && phase !== "processing";

    // ─────────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-950 p-6 font-['IBM_Plex_Mono',_monospace] text-slate-100">
            {/* ── Header ────────────────────────────────────────────────────────── */}
            <header className="mx-auto mb-10 max-w-5xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-lg font-black text-white shadow-lg shadow-violet-500/20">
                        ⚡
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Career Copilot</h1>
                        <p className="text-xs text-slate-500">1-Click Resume Tailor</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_380px]">

                {/* ── LEFT: Input panel ───────────────────────────────────────────── */}
                <section className="space-y-5">
                    {/* Job meta */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Job Title
                            </label>
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="Senior Software Engineer"
                                disabled={phase === "processing"}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Company
                            </label>
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Acme Corp"
                                disabled={phase === "processing"}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* JD textarea */}
                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Job Description
                            <span className={`ml-2 font-normal ${jobDescription.length < 50 ? "text-rose-500" : "text-emerald-500"}`}>
                                ({jobDescription.length} chars{jobDescription.length < 50 ? " — min 50" : " ✓"})
                            </span>
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here…"
                            disabled={phase === "processing"}
                            rows={16}
                            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm leading-relaxed text-white placeholder-slate-600 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                        />
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleTailor}
                        disabled={!canSubmit}
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {phase === "processing" ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Tailoring…
                            </span>
                        ) : (
                            "⚡ Tailor My Resume"
                        )}
                    </button>

                    {/* Error banner */}
                    {phase === "error" && (
                        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                            <strong className="block font-semibold">Tailoring failed</strong>
                            {errorMessage}
                        </div>
                    )}
                </section>

                {/* ── RIGHT: Status + Results ──────────────────────────────────────── */}
                <aside className="space-y-5">
                    {/* Processing progress */}
                    {phase === "processing" && (
                        <ProgressStepper
                            currentStep={currentStep}
                            progress={progress}
                            message={statusMessage}
                        />
                    )}

                    {/* Result panel */}
                    {phase === "done" && result && (
                        <div className="space-y-5">
                            {/* Score + keywords */}
                            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-sm">
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <ScoreBadge score={result.matchScore ?? 0} />
                                    {result.scoreBreakdown && (
                                        <div className="grid flex-1 gap-1 text-right text-xs">
                                            {Object.entries(result.scoreBreakdown).map(([k, v]) => (
                                                <div key={k} className="flex justify-between gap-2 text-slate-400">
                                                    <span className="capitalize">{k}</span>
                                                    <span className="font-semibold text-slate-200">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <KeywordPills
                                    matched={result.keywordsMatched}
                                    missed={result.keywordsMissed}
                                />
                            </div>

                            {/* Tailored content tabs */}
                            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 backdrop-blur-sm">
                                {/* Tab bar */}
                                <div className="flex border-b border-slate-700">
                                    {["summary", "experience", "skills"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={[
                                                "flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-colors",
                                                activeTab === tab
                                                    ? "border-b-2 border-violet-500 text-violet-400"
                                                    : "text-slate-500 hover:text-slate-300",
                                            ].join(" ")}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab content */}
                                <div className="p-5">
                                    {activeTab === "summary" && (
                                        <p className="text-sm leading-relaxed text-slate-300">
                                            {result.tailoredSummary ?? "No summary generated."}
                                        </p>
                                    )}

                                    {activeTab === "experience" && (
                                        <ExperienceSection experience={result.tailoredExperience} />
                                    )}

                                    {activeTab === "skills" && (
                                        <div className="space-y-3">
                                            {(result.tailoredSkills ?? []).map((group) => (
                                                <div key={group.category}>
                                                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                                        {group.category}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {group.items.map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="rounded-lg bg-slate-700 px-2.5 py-1 text-xs text-slate-300 ring-1 ring-slate-600"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Idle placeholder */}
                    {phase === "idle" && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 p-10 text-center">
                            <div className="mb-3 text-4xl">🎯</div>
                            <p className="text-sm font-medium text-slate-400">
                                Paste a job description and click Tailor to see your personalized resume score and rewritten bullets.
                            </p>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
}
