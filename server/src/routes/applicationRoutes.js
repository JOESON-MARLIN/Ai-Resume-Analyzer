import express from 'express';
import { getApplications, addApplication, updateApplicationStatus, deleteApplication } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getApplications)
    .post(protect, addApplication);

router.route('/:id/status')
    .patch(protect, updateApplicationStatus);

router.route('/:id')
    .delete(protect, deleteApplication);

export default router;
