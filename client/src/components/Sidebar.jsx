import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const links = [
        { path: "/dashboard", label: "Dashboard", icon: "🏠" },
        { path: "/jobs", label: "Job Tracker", icon: "📋" },
        { path: "/resume", label: "Resume Engine", icon: "📄" },
        { path: "/linkedin", label: "LinkedIn Optimizer", icon: "💼" },
        { path: "/study", label: "Study Hub", icon: "📚" },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col font-['IBM_Plex_Mono',_monospace]">
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 border-b border-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-violet-500/20">
                    ⚡
                </div>
                <h1 className="text-lg font-bold tracking-tight text-white">Career Copilot</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {links.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={[
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive 
                                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" 
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
                            ].join(" ")}
                        >
                            <span>{link.icon}</span>
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Hook */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-sm text-slate-300">
                    <div className="h-8 w-8 rounded-full bg-slate-700"></div>
                    <div>
                        <p className="font-semibold text-white">Guest User</p>
                        <p className="text-xs text-slate-500">MOCK_USER_ID</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
