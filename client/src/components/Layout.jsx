import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-blue-500/30 relative overflow-hidden font-sans">
            {/* Global Ambient Mesh Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-100/40 blur-[120px] mix-blend-multiply opacity-70"></div>
                <div className="absolute top-[10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-blue-100/50 blur-[130px] mix-blend-multiply opacity-60"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-blue-100/40 blur-[100px] mix-blend-multiply opacity-60"></div>
            </div>

            <div className="relative z-20">
                <Sidebar />
            </div>
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative z-10">
                <Outlet />
            </main>
        </div>
    );
}
