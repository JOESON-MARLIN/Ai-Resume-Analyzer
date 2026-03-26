import { useCareer } from "../CareerContext.jsx";
import { Link } from "react-router-dom";

export default function StudyHub() {
    const { hasResume, getSkillGaps } = useCareer();
    
    const skillGaps = hasResume ? getSkillGaps() : [];

    const generalModules = [
        { id: "sysdesign", track: "System Design", title: "Scalable Architecture Basics", format: "Article • 15 min", url: "#", icon: "🏗️" },
        { id: "dsa", track: "Algorithms", title: "Top 50 LeetCode Patterns", format: "Practice • 2 hrs", url: "#", icon: "🧠" },
        { id: "behavioral", track: "Behavioral", title: "STAR Method Masterclass", format: "Video • 45 min", url: "#", icon: "🗣️" },
        { id: "pm", track: "Product Management", title: "Product Sense Interview Frameworks", format: "Guide • 30 min", url: "#", icon: "📱" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Hero */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-500/20">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl">📚</span>
                            <h1 className="text-3xl font-extrabold tracking-tight">Study Hub</h1>
                        </div>
                        <p className="text-white/80 text-lg font-medium max-w-2xl">
                            {hasResume 
                                ? "Learning paths customized to the skill gaps found in your target job matches." 
                                : "General interview preparation and learning resources. Upload a resume for personalized recommendations."}
                        </p>
                    </div>
                    
                    {hasResume && skillGaps.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shrink-0 text-center shadow-lg shadow-black/5">
                            <p className="text-2xl font-black text-white">{skillGaps.length}</p>
                            <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mt-1">Skill Gaps Found</p>
                        </div>
                    )}
                </div>
            </header>

            {/* Personalized Skill Gaps Section */}
            {hasResume ? (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">🎯</span>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">Your Personalized Learning Path</h2>
                            <p className="text-sm text-slate-500 font-medium">Derived directly from jobs you matched with.</p>
                        </div>
                    </div>

                    {skillGaps.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {skillGaps.map((gap, i) => (
                                <div key={i} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">High Priority</span>
                                            {gap.course && <span className="text-xs font-bold text-slate-400 px-2 py-0.5 border border-slate-200 rounded text-center">{gap.course.track}</span>}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 capitalize mb-1">{gap.skill}</h3>
                                        <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Missing in {gap.demandCount} target roles</p>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        {gap.course ? (
                                            <>
                                                <div className="mb-4">
                                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Recommended Course</p>
                                                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                        <span>📘</span> {gap.course.name}
                                                    </p>
                                                </div>
                                                <a href={gap.course.url} target="_blank" rel="noreferrer" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-blue-500/20">
                                                    Start Learning
                                                </a>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                <span className="text-2xl mb-2">🤷</span>
                                                <p className="text-sm text-slate-500 font-medium pb-4">No specific course mapped for {gap.skill} yet.</p>
                                                <a href={`https://www.youtube.com/results?search_query=${gap.skill}+tutorial`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 w-full py-2.5 rounded-xl transition">
                                                    Search YouTube →
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center flex flex-col items-center">
                            <span className="text-5xl mb-4">🏆</span>
                            <h3 className="text-xl font-bold text-green-800 mb-2">You have no major technical skill gaps!</h3>
                            <p className="text-sm text-green-700/80">Your resume covers the skills needed for your target roles. Focus on interview prep below.</p>
                        </div>
                    )}
                </section>
            ) : (
                <section className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[250px] group hover:bg-slate-100 transition">
                    <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🧠</span>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Want Custom Learning Paths?</h2>
                    <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">Upload your resume and we'll cross-reference it with 15+ job descriptions to find exactly what you're missing.</p>
                    <Link to="/resume/analyzer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md shadow-blue-500/20">
                        Analyze Resume Now
                    </Link>
                </section>
            )}

            {/* General Preparation */}
            <section className="pt-6 border-t border-slate-200">
                <div className="mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-800">General Preparation</h2>
                    <p className="text-sm text-slate-500 font-medium">Nail the behavioral and technical interviews.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                    {generalModules.map(mod => (
                        <a href={mod.url} key={mod.id} className="flex items-center gap-4 bg-white border border-slate-200/60 p-4 rounded-xl hover:border-blue-300 hover:shadow-md transition group">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">{mod.icon}</div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">{mod.track}</p>
                                <h4 className="text-sm font-bold text-slate-800 mb-1">{mod.title}</h4>
                                <p className="text-xs text-slate-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {mod.format}</p>
                            </div>
                            <span className="opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all text-blue-600 font-bold">→</span>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
