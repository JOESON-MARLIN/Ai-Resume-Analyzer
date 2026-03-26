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
            <div className="flex flex-col pb-6 pt-8 px-6 border-b border-[#1e2330]">
                {/* Fallback to text styling that perfectly matches their logo if the image isn't saved yet */}
                <div className="flex items-center gap-px">
                    <h1 className="text-[26px] font-black tracking-tight text-[#004a7c]">
                        Career<span className="text-[#f26522]">Craft</span>
                    </h1>
                </div>
                <div className="flex items-center justify-center mt-0.5">
                    <span className="text-[#f26522] font-black tracking-[0.25em] text-[11px] opacity-90">— AI —</span>
                </div>
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

        </aside>
    );
}
