import TailorDashboard from "./components/TailorDashboard.jsx";

// Hardcoded userId for now — replace with real auth (Clerk, Supabase Auth, etc.)
const MOCK_USER_ID = "user_dev_001";

export default function App() {
    return <TailorDashboard userId={MOCK_USER_ID} />;
}