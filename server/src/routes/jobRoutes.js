import express from 'express';
import { searchJobs, getJobById } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', protect, searchJobs);
router.get('/:id', protect, getJobById);

export default router;