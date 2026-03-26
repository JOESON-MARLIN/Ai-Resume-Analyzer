import express from 'express';
import { parseResumeText, rewriteUserBullets, matchToJob } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/parse', protect, upload.single('file'), parseResumeText);
router.post('/rewrite', protect, rewriteUserBullets);
router.post('/match', protect, matchToJob);

export default router;
