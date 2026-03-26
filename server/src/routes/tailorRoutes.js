// tailorRoutes.js
import { Router } from "express";
import { tailorResume, getTailoredResume } from "../controllers/tailorController.js";

const router = Router();

// POST /api/tailor       — kick off the 1-click tailor workflow
router.post("/", tailorResume);

// GET  /api/tailor/:id   — fetch a completed tailored resume
router.get("/:id", getTailoredResume);

export default router;