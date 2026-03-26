import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import ResumeResults from "./components/ResumeResults.jsx";
import JobBoard from "./components/JobBoard.jsx";
import StudyHub from "./components/StudyHub.jsx";
import LinkedInOptimizer from "./components/LinkedInOptimizer.jsx";
import ResumeHome from "./components/ResumeHome.jsx";
import AtsChecker from "./components/AtsChecker.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import Settings from "./components/Settings.jsx";
import JobSearch from "./components/JobSearch.jsx";
import ResumeBuilder from "./components/ResumeBuilder.jsx";
import ResumeAnalyzer from "./components/ResumeAnalyzer.jsx";
import ResumeRewriter from "./components/ResumeRewriter.jsx";
import Login from "./components/Login.jsx";

function ProtectedRoute() {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading CareerCraft...</div>;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<JobSearch />} />
                    <Route path="/jobs" element={<JobBoard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    <Route path="/resume" element={<ResumeHome />} />
                    <Route path="/resume/builder" element={<ResumeBuilder />} />
                    <Route path="/resume/analyzer" element={<ResumeAnalyzer />} />
                    <Route path="/resume/rewriter" element={<ResumeRewriter />} />
                    <Route path="/resume/results" element={<ResumeResults />} />
                    <Route path="/resume/ats-checker" element={<AtsChecker />} />
                    
                    <Route path="/linkedin" element={<LinkedInOptimizer />} />
                    <Route path="/study" element={<StudyHub />} />
                </Route>
            </Route>
        </Routes>
    );
}