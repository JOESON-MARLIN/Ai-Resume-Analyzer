import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen font-['IBM_Plex_Mono',_monospace]">
                <Outlet />
            </main>
        </div>
    );
}
