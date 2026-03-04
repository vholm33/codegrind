import express from 'express';
import { addCodeQuestionController } from '../controllers/codeQuestions.controller.js';

const router = express.Router();

router.post('/add', addCodeQuestionController);

export default router;
