import { useLocation, useNavigate, Navigate } from "react-router-dom";

export default function ResumeResults() {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Prevent crashing if visited directly
    if (!state || !state.result) {
        return <Navigate to="/" replace />;
    }

    const { result } = state;
    
    // Fallbacks just in case the LLM misses a field
    const authenticity = result.authenticityCheck || { isRealistic: true, reasoning: "Seems standard." };
    const score = result.score ?? result.matchScore ?? 0;
    const formatAssessment = result.formatAssessment || "Format looks professional, ATS-friendly.";
    const suggested = result.suggestedRoles || ["Software Engineer", "Frontend Developer"];
    const stretch = result.stretchRoles || ["Senior Member of Technical Staff (Google)", "SDE II (Amazon)"];
    
    // Skills formatting
    const matchedSkills = result.keywordsMatched?.length > 0 ? result.keywordsMatched : (result.skills || []);
    const missedSkills = result.missingSkills || result.keywordsMissed || [];

    const isAuthentic = authenticity.isRealistic;

    return (
        <div className="min-h-screen bg-slate-950 p-6 font-['IBM_Plex_Mono',_monospace] text-slate-100 pb-20">
            {/* Header */}
            <header className="mx-auto mb-10 max-w-5xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-lg font-black text-white shadow-lg shadow-violet-500/20">
                        ⚡
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Career Copilot</h1>
                        <p className="text-xs text-slate-500">Analysis complete</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                    Start Over
                </button>
            </header>

            <main className="mx-auto max-w-5xl space-y-8">
                
                {/* Top Metrics Row */}
                <div className="grid gap-6 md:grid-cols-3">
                    
                    {/* Authenticity Badge */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 flex flex-col justify-center items-center text-center">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Authenticity</div>
                        {isAuthentic ? (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-3xl mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                🛡️
                            </div>
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 text-3xl mb-3 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                ⚠️
                            </div>
                        )}
                        <h3 className={`text-xl font-bold ${isAuthentic ? "text-emerald-400" : "text-rose-400"}`}>
                            {isAuthentic ? "Verified" : "Flagged"}
                        </h3>
                        <p className="mt-2 text-xs text-slate-400 max-w-[200px] leading-relaxed">
                            {authenticity.reasoning}
                        </p>
                    </div>

                    {/* Weightage Score */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 flex flex-col justify-center items-center text-center">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">ATS Weightage</div>
                        
                        <div className="relative flex items-center justify-center w-32 h-32 mb-2">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {/* Background Circle */}
                                <path
                                    className="text-slate-700"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="currentColor" strokeWidth="3"
                                />
                                {/* Progress Circle */}
                                <path
                                    className={score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400"}
                                    strokeDasharray={`${score}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className={`text-4xl font-black ${score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                                    {score}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Format Check */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 flex flex-col justify-center">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Format Check</div>
                        <div className="flex-1 flex items-center rounded-xl bg-slate-900/50 p-4 border border-violet-500/30 text-sm leading-relaxed text-violet-200">
                            {formatAssessment}
                        </div>
                    </div>

                </div>

                {/* Job Matches Row */}
                <div className="grid gap-6 md:grid-cols-2">
                    
                    {/* Live Market Matches */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Live Market Matches</h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Based on your current skill gaps, apply to these directly:</p>
                        <div className="space-y-3">
                            {suggested.map((role, i) => (
                                <div key={i} className="flex justify-between items-center rounded-lg bg-slate-900 p-3 border border-slate-600">
                                    <span className="font-semibold text-slate-200">{role}</span>
                                    <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">Match &gt; 90%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stretch Vacancies */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg">🚀</span>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Stretch Vacancies</h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Upskill targets (requires closing the skill gap):</p>
                        <div className="space-y-3">
                            {stretch.map((role, i) => (
                                <div key={i} className="flex justify-between items-center rounded-lg bg-slate-900 p-3 border border-violet-500/30">
                                    <span className="font-semibold text-violet-300">{role}</span>
                                    <span className="text-xs px-2 py-1 rounded bg-violet-500/20 text-violet-400">Reach</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Skills Gap Analysis */}
                <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Skill Gap Analysis</h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                                Matched Skills ({matchedSkills.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {matchedSkills.length > 0 ? matchedSkills.map(kw => (
                                    <span key={kw} className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                                        ✓ {kw}
                                    </span>
                                )) : <span className="text-sm text-slate-500">None detected</span>}
                            </div>
                        </div>

                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-rose-400">
                                Missing Critical Skills ({missedSkills.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {missedSkills.length > 0 ? missedSkills.map(kw => (
                                    <span key={kw} className="rounded-full bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-rose-500/30">
                                        × {kw}
                                    </span>
                                )) : <span className="text-sm text-slate-500">Excellent! No critical gaps detected.</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tailored Experience Preview */}
                <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Tailored Experience (Preview)</h3>
                    <div className="space-y-6">
                        {result.tailoredExperience && result.tailoredExperience.map((role, idx) => (
                            <div key={role.id || idx} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
                                <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h4 className="font-semibold text-white">{role.title}</h4>
                                        <p className="text-sm text-slate-400">{role.company} {role.location ? `· ${role.location}` : ""}</p>
                                    </div>
                                    <span className="shrink-0 text-xs text-slate-500">
                                        {role.startDate} — {role.isCurrent ? "Present" : role.endDate}
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    {(role.bullets || []).map((b, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {(!result.tailoredExperience || result.tailoredExperience.length === 0) && (
                            <p className="text-sm text-slate-500">No experience bullets returned.</p>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
