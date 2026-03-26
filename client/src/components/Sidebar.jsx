import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const links = [
        { path: "/dashboard", label: "Dashboard", icon: "🏠" },
        { path: "/search", label: "Job Search", icon: "🔍" },
        { path: "/jobs", label: "Job Tracker", icon: "📋" },
        { path: "/study", label: "Study Hubs", icon: "📚" },
        { path: "/resume", label: "Resume Engine", icon: "📄" },
        { path: "/linkedin", label: "LinkedIn Optimizer", icon: "💼" },
        { path: "/profile", label: "My Profile", icon: "👤" },
        { path: "/settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-blue-100 flex flex-col font-sans shadow-lg z-50">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-6 py-6 border-b border-blue-100">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">CC</div>
                <h1 className="text-xl font-black tracking-tight text-slate-800">
                    Career<span className="text-blue-600">Craft</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                {links.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={[
                                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                                isActive
                                    ? "bg-blue-50 text-blue-700 border-l-[3px] border-blue-600"
                                    : "text-slate-500 hover:bg-blue-50/50 hover:text-blue-700"
                            ].join(" ")}
                        >
                            <span className="text-base">{link.icon}</span>
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
