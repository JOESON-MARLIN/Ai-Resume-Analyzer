import { Routes, Route } from "react-router-dom";
import UploadResume from "./components/UploadResume.jsx";
import TailorDashboard from "./components/TailorDashboard.jsx";
import ResumeResults from "./components/ResumeResults.jsx";

// Hardcoded userId for now — replace with real auth (Clerk, Supabase Auth, etc.)
const MOCK_USER_ID = "user_dev_001";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<UploadResume userId={MOCK_USER_ID} />} />
            <Route path="/dashboard" element={<TailorDashboard userId={MOCK_USER_ID} />} />
            <Route path="/results" element={<ResumeResults />} />
        </Routes>
    );
}