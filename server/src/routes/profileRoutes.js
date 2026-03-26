// profileRoutes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadAndParseProfile, getProfile } from "../controllers/profileController.js";

// Store uploads in /uploads with original extension preserved
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/"),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Only PDF files are accepted."));
    },
});

const router = Router();

// POST /api/profile/upload   — upload PDF, parse, save MasterProfile
router.post("/upload", upload.single("resume"), uploadAndParseProfile);

// GET  /api/profile/:userId  — fetch a user's MasterProfile
router.get("/:userId", getProfile);

export default router;