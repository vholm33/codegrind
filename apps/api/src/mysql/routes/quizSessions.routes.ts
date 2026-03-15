import express from 'express';
import { saveQuizSession } from '../controllers/quiz.controller.js';

const router = express.Router();

// /api/quizSession/session

// Endpoint för att skicka in quizSessionen
router.post('/session', saveQuizSession);

export default router;
