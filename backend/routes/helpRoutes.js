import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  createHelpRequest,
  getAllHelpRequests,
  acceptHelpRequest,
  updateHelpRequestStatus,
} from '../controllers/helpController.js';

const router = express.Router();

router.post('/request', authMiddleware, createHelpRequest);
router.get('/all', authMiddleware, getAllHelpRequests);
router.patch('/:id/accept', authMiddleware, acceptHelpRequest);
router.patch('/:id/status', authMiddleware, updateHelpRequestStatus); // optional route

export default router;
