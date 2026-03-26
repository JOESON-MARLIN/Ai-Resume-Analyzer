import { Routes, Route, Navigate } from "react-router-dom";
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

// Hardcoded userId for now
const MOCK_USER_ID = "user_dev_001";

export default function App() {
    return (
        <Routes>
            {/* The outer Layout provides the Sidebar */}
            <Route element={<Layout />}>
                {/* Redirect / to /dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Core Navigation Hubs */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/search" element={<JobSearch />} />
                <Route path="/jobs" element={<JobBoard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />

                {/* Resume Engine Hub */}
                <Route path="/resume" element={<ResumeHome />} />
                <Route path="/resume/builder" element={<ResumeBuilder />} />
                <Route path="/resume/analyzer" element={<ResumeAnalyzer />} />
                <Route path="/resume/rewriter" element={<ResumeRewriter />} />
                <Route path="/resume/results" element={<ResumeResults />} />
                <Route path="/resume/ats-checker" element={<AtsChecker />} />

                {/* Other features */}
                <Route path="/linkedin" element={<LinkedInOptimizer />} />
                <Route path="/study" element={<StudyHub />} />
            </Route>
        </Routes>
    );
}