// client/src/components/UploadResume.jsx
import { useState, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function UploadResume({ userId, onProfileReady }) {
    const [phase, setPhase] = useState("idle"); // idle | uploading | polling | done | error
    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null);
    const pollRef = useRef(null);

    function startPolling(uid) {
        setPhase("polling");
        setMessage("Parsing your resume with AI…");

        pollRef.current = setInterval(async () => {
            try {
                const { data } = await axios.get(`${API_BASE}/api/profile/${uid}`);
                if (data.status === "COMPLETE") {
                    clearInterval(pollRef.current);
                    setPhase("done");
                    setMessage(`✓ Profile ready — welcome, ${data.fullName ?? uid}!`);
                    onProfileReady?.(data);
                }
            } catch {
                // not found yet — keep polling
            }
        }, 2500);

        // Safety timeout: 2 minutes
        setTimeout(() => {
            clearInterval(pollRef.current);
            setPhase((prev) => {
                if (prev !== "done") {
                    setMessage("Parsing timed out. Please try uploading again.");
                    return "error";
                }
                return prev;
            });
        }, 120_000);
    }

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
            startPolling(userId);
        } catch (err) {
            setPhase("error");
            setMessage(err.response?.data?.error ?? "Upload failed. Please try again.");
        }
    }

    const isLoading = phase === "uploading" || phase === "polling";

    return (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-800/60 p-8 text-center backdrop-blur-sm">
            <div className="mb-4 text-5xl">📄</div>
            <h2 className="mb-1 text-lg font-bold text-white">Upload Your Resume</h2>
            <p className="mb-6 text-sm text-slate-400">
                PDF only · max 5 MB · parsed once, tailored forever
            </p>

            {/* Drop zone button */}
            <button
                onClick={() => !isLoading && fileInputRef.current?.click()}
                disabled={isLoading || phase === "done"}
                className={[
                    "mb-4 w-full rounded-xl border-2 border-dashed px-6 py-8 text-sm transition-all duration-200",
                    phase === "done"
                        ? "cursor-default border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : isLoading
                            ? "cursor-wait border-slate-600 text-slate-500"
                            : "cursor-pointer border-slate-600 text-slate-400 hover:border-violet-500 hover:bg-violet-500/5 hover:text-violet-300",
                ].join(" ")}
            >
                {phase === "done"
                    ? "✓ Resume parsed successfully"
                    : isLoading
                        ? "Processing…"
                        : "Click to choose a PDF — or drag & drop"}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Status message */}
            {message && (
                <p
                    className={[
                        "mt-3 flex items-center justify-center gap-2 text-sm",
                        phase === "error" ? "text-rose-400" : "",
                        phase === "done" ? "text-emerald-400" : "",
                        isLoading ? "text-cyan-400" : "",
                    ].join(" ")}
                >
                    {isLoading && (
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {message}
                </p>
            )}

            {/* Re-upload option */}
            {phase === "done" && (
                <button
                    onClick={() => {
                        setPhase("idle");
                        setMessage("");
                        fileInputRef.current?.click();
                    }}
                    className="mt-4 text-xs text-slate-500 underline hover:text-slate-300"
                >
                    Upload a different resume
                </button>
            )}
        </div>
    );
}