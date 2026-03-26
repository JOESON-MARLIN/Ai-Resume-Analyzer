import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
    uploadAndParseProfile, getProfile, 
    getUserProfileCore, updateUserProfileCore,
    getUserSettings, updateUserSettings 
} from "../controllers/profileController.js";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Store uploads in /uploads with original extension preserved
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
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

// V3 Routes
router.get("/user/:userId", getUserProfileCore);
router.put("/user/:userId", updateUserProfileCore);
router.get("/settings/:userId", getUserSettings);
router.put("/settings/:userId", updateUserSettings);

export default router;