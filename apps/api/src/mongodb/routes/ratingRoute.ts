import express from 'express';
import { addRating, getUserRatingsById } from '../controllers/ratingController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ratings', verifyToken, addRating);
router.get('/ratings', verifyToken, getUserRatingsById);

export default router;
