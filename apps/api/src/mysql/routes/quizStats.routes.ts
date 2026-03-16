import express from 'express';
import {
    getLatestQuizSessionController,
    getQuizProfileController,
} from '../controllers/quizStats.controller.js';

const router = express.Router();

// =========
// Stats routes
// =========

router.get('/session/:userId', getLatestQuizSessionController);
router.get('/profile/:userId', getQuizProfileController);

export default router;
