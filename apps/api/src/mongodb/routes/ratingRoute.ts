import express from 'express';
import {
    addRating,
    getRating
} from '../controllers/ratingController.js';

const router = express.Router();

router.post('/add', addRating);

router.get('/get', getRating)

export default router;
