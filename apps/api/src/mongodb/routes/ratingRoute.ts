import express from 'express';
import {
    addRating,
    getRating
} from '../controllers/ratingController.js';

const router = express.Router();

router.post('/ratings', addRating);

router.get('/ratings', getRating)

export default router;
