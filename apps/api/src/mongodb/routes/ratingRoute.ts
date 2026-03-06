import express from 'express';
import { addRatingController } from '../controllers/ratingController.js';

const router = express.Router();

router.post('/add', addRatingController);

export default router;
