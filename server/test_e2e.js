const API_BASE = "http://localhost:4000";

async function runE2E() {
    console.log("🚀 Starting E2E Verification Workflow...");
    
    // Set random suffix to prevent email conflicts
    const rand = Math.floor(Math.random() * 10000);
    const mockUser = { name: "Test User", email: `test${rand}@example.com`, password: "password123" };
    
    let token = "";
    
    const fetchAPI = async (endpoint, method, body, addToken = false) => {
        const headers = { "Content-Type": "application/json" };
        if (addToken) headers["Authorization"] = `Bearer ${token}`;
        
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "API Request Failed");
        return data;
    };

    try {
        // 1. Test Auth (Register & Login)
        console.log("\n[1] Registering User...");
        const regData = await fetchAPI("/api/auth/register", "POST", mockUser);
        console.log("✅ Registered. ID:", regData.id);
        
        console.log("[2] Logging in...");
        const logData = await fetchAPI("/api/auth/login", "POST", { email: mockUser.email, password: mockUser.password });
        token = logData.token;
        console.log("✅ Login Success. Token generated.");

        // 2. Test AI Parse
        const sampleResumeText = "Experienced React developer with 5 years in Node.js, SQL, and AWS. Improved performance by 30%.";
        console.log("\n[3] Testing AI Resume Parsing...");
        const parseData = await fetchAPI("/api/resume/parse", "POST", { text: sampleResumeText }, true);
        console.log("✅ AI Parse Success! ATS Score:", parseData.analysis.score);
        console.log("Skills found:", parseData.analysis.skillsFound.join(", "));

        // 3. Test AI Rewrite
        console.log("\n[4] Testing AI Bullet Rewriter...");
        const bullets = "Built a server routing system in python";
        const rewData = await fetchAPI("/api/resume/rewrite", "POST", { bullets, style: "metrics" }, true);
        console.log("✅ AI Rewrite Success!");
        console.log("Original:", rewData.results[0].original);
        console.log("Rewritten:", rewData.results[0].rewritten);

        // 4. Test AI Match
        console.log("\n[5] Testing AI Deep Matching...");
        const jd = "Looking for a full-stack engineer with React, Python, and SQL experience. Must have 5 years dev ops.";
        const matchData = await fetchAPI("/api/resume/match", "POST", { resumeText: sampleResumeText, jobDescription: jd }, true);
        console.log("✅ AI Match Success! Match Percent:", matchData.matchPercent + "%");
        console.log("Matched Skills:", matchData.matchedSkills.join(", "));
        console.log("Missing Skills:", matchData.missingSkills.join(", "));

        // 5. Postgres Kanban Tracking
        console.log("\n[6] Testing Job Tracker (PostgreSQL Backend)...");
        const jobCreation = await fetchAPI("/api/applications", "POST", { company: "Netflix", role: "UI Engineer", salary: "$250k" }, true);
        const jobId = jobCreation.id;
        console.log("✅ Created Kanban Job Application! ID:", jobId);

        const jobStatusUpdate = await fetchAPI(`/api/applications/${jobId}/status`, "PATCH", { status: "INTERVIEWING" }, true);
        console.log("✅ Updated Kanban status to:", jobStatusUpdate.status);

        console.log("\n🎉 ALL E2E WORKFLOWS PASSED. Database and AI Integrations are functioning perfectly! 🎉");
        
        // Let process exit naturally
        setTimeout(() => process.exit(0), 100);
    } catch (error) {
        console.error("\n❌ Test FAILED:", error.message);
        process.exit(1);
    }
}

runE2E();
