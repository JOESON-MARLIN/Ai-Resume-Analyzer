import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-[#0B0E14] text-white selection:bg-blue-500/30">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen font-sans">
                <Outlet />
            </main>
        </div>
    );
}
