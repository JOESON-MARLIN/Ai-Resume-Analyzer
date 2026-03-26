// server.js
// Career Copilot — Express + Socket.io entry point
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

// Route imports
import profileRouter from "./routes/profile.js";
import tailorRouter from "./routes/tailor.js";
import jobRouter from "./routes/jobs.js";

// ─── Singleton Prisma client ──────────────────────────────────────────────────
// Export so controllers can import without re-instantiating.
export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});

// ─── App bootstrap ────────────────────────────────────────────────────────────
const app = express();
const httpServer = http.createServer(app);

// ─── Socket.io ───────────────────────────────────────────────────────────────
// The io instance is attached to the app so route handlers can reach it via
// req.app.get("io") without circular imports.
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
    // Use long-polling as fallback for proxies that don't support WebSockets
    transports: ["websocket", "polling"],
});

app.set("io", io);

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
        credentials: true,
    })
);

app.use(
    helmet({
        // Relax CSP for dev; tighten per-route in production
        contentSecurityPolicy: process.env.NODE_ENV === "production",
    })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", ts: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/profile", profileRouter);
app.use("/api/tailor", tailorRouter);
app.use("/api/jobs", jobRouter);

// ─── Global error handler ─────────────────────────────────────────────────────
// Must have 4 params for Express to treat it as an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error("[GlobalError]", err);
    const status = err.statusCode ?? err.status ?? 500;
    res.status(status).json({
        error: err.message ?? "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

// ─── Socket.io connection lifecycle ──────────────────────────────────────────
io.on("connection", (socket) => {
    console.log(`[Socket] Client connected   id=${socket.id}`);

    // Client sends its userId immediately after connecting so the server can
    // route AI status events to the correct socket.
    socket.on("register", ({ userId }) => {
        if (!userId) return;
        // Each user gets their own room — supports multi-tab sessions cleanly.
        socket.join(`user:${userId}`);
        console.log(`[Socket] Registered user=${userId} socket=${socket.id}`);
        socket.emit("registered", { room: `user:${userId}` });
    });

    socket.on("disconnect", (reason) => {
        console.log(`[Socket] Client disconnected id=${socket.id} reason=${reason}`);
    });

    socket.on("error", (err) => {
        console.error(`[Socket] Error socket=${socket.id}`, err);
    });
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
async function shutdown(signal) {
    console.log(`\n[Server] ${signal} received — shutting down gracefully`);
    await prisma.$disconnect();
    httpServer.close(() => {
        console.log("[Server] HTTP server closed");
        process.exit(0);
    });
    // Force exit if connections linger
    setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 4000;

httpServer.listen(PORT, () => {
    console.log(`[Server] Listening on http://localhost:${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV ?? "development"}`);
});
