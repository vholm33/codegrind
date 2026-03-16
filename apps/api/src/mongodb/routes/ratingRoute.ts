import express from 'express';
import { addRating, getRating } from '../controllers/ratingController.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ratings', verifyToken, addRating);
router.get('/ratings', verifyToken, getRating);
// router.patch('/ratings', verifyToken, patchRating)
export default router;
