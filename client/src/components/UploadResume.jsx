// client/src/components/UploadResume.jsx
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function UploadResume({ userId }) {
    const navigate = useNavigate();
    const [phase, setPhase] = useState("idle"); // idle | uploading | error
    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setPhase("error");
            setMessage("Only PDF files are accepted.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setPhase("error");
            setMessage("File must be under 5 MB.");
            return;
        }

        setPhase("uploading");
        setMessage("Uploading…");

        const form = new FormData();
        form.append("resume", file);
        form.append("userId", userId);

        try {
            await axios.post(`${API_BASE}/api/profile/upload`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Hackathon bypass: parsing is instant, go straight to dashboard
            navigate("/dashboard");
        } catch (err) {
            setPhase("error");
            setMessage(err.response?.data?.error ?? "Upload failed. Please try again.");
        }
    }

    const isLoading = phase === "uploading";

    return (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-800/60 p-8 text-center backdrop-blur-sm mt-20">
            <div className="mb-4 text-5xl">📄</div>
            <h2 className="mb-1 text-lg font-bold text-white">Upload Your Resume</h2>
            <p className="mb-6 text-sm text-slate-400">
                PDF only · max 5 MB · parsed once, tailored forever
            </p>

            {phase === "error" && (
                <div className="mb-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
                    {message}
                </div>
            )}

            <button
                onClick={() => !isLoading && fileInputRef.current?.click()}
                disabled={isLoading}
                className={[
                    "mb-4 w-full flex justify-center items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-sm transition-all duration-200",
                    isLoading
                        ? "cursor-wait border-slate-600 text-slate-500"
                        : "cursor-pointer border-slate-600 text-slate-400 hover:border-violet-500 hover:bg-violet-500/5 hover:text-violet-300",
                ].join(" ")}
            >
                {isLoading ? (
                    <>
                        <svg className="h-5 w-5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    "Click to choose a PDF — or drag & drop"
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}