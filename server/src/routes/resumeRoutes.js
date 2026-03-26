import express from 'express';
import { parseResumeText, rewriteUserBullets, matchToJob } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/parse', protect, parseResumeText);
router.post('/rewrite', protect, rewriteUserBullets);
router.post('/match', protect, matchToJob);

export default router;
