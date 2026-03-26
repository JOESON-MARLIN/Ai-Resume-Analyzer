import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import UploadResume from "./components/UploadResume.jsx";
import TailorDashboard from "./components/TailorDashboard.jsx";
import ResumeResults from "./components/ResumeResults.jsx";
import JobBoard from "./components/JobBoard.jsx";
import StudyHub from "./components/StudyHub.jsx";
import LinkedInOptimizer from "./components/LinkedInOptimizer.jsx";
import ResumeHome from "./components/ResumeHome.jsx";
import AtsChecker from "./components/AtsChecker.jsx";
import Dashboard from "./components/Dashboard.jsx";

// Hardcoded userId for now
const MOCK_USER_ID = "user_dev_001";

export default function App() {
    return (
        <Routes>
            {/* The outer Layout provides the Sidebar */}
            <Route element={<Layout />}>
                {/* Redirect / to /dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Dashboard & Jobs */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<JobBoard />} />
                
                {/* Resume Engine Hub */}
                <Route path="/resume" element={<ResumeHome />} />
                <Route path="/resume/tailor-upload" element={<UploadResume userId={MOCK_USER_ID} />} />
                <Route path="/resume/tailor" element={<TailorDashboard userId={MOCK_USER_ID} />} />
                <Route path="/resume/results" element={<ResumeResults />} />
                <Route path="/resume/ats-checker" element={<AtsChecker />} />
                
                {/* Other features */}
                <Route path="/linkedin" element={<LinkedInOptimizer />} />
                <Route path="/study" element={<StudyHub />} />
            </Route>
        </Routes>
    );
}