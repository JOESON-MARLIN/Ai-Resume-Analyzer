import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const links = [
        { path: "/dashboard", label: "Dashboard", icon: "🏠" },
        { path: "/study", label: "Hubs", icon: "📚" },
        { path: "/jobs", label: "Job Tracker", icon: "📋" },
        { path: "/resume", label: "Resume Analyzer", icon: "📄" },
        { path: "/linkedin", label: "LinkedIn Optimizer", icon: "💼" },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-[#0B0E14] border-r border-[#1e2330] flex flex-col font-sans">
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 border-b border-[#1e2330]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-500/20">
                    t
                </div>
                <h1 className="text-lg font-bold tracking-tight text-white">thita.ai</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <p className="px-4 text-[10px] font-bold tracking-widest text-[#5a6b8a] uppercase mb-4">Learn</p>
                {links.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={[
                                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive 
                                    ? "bg-[#181f2d] text-white" 
                                    : "text-[#8598b9] hover:bg-[#131823] hover:text-white"
                            ].join(" ")}
                        >
                            <span className={isActive ? "text-blue-500" : "text-[#5a6b8a]"}>{link.icon}</span>
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Help Area */}
            <div className="p-4 border-[#1e2330]">
                <div className="rounded-xl border border-amber-500/10 p-4 text-center hover:bg-[#131823] transition cursor-pointer">
                    <p className="text-xs text-[#8598b9]">Help us improve Thita<br/>(30 sec)</p>
                    <p className="text-xs font-bold text-amber-500 mt-1">+10 coins</p>
                </div>
            </div>
        </aside>
    );
}
