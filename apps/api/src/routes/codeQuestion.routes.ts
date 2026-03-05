import express from 'express';
import {
    addCodeQuestionController,
    getCodeQuestionController

} from '../controllers/codeQuestions.controller.js';

const router = express.Router();

router.post('/add', addCodeQuestionController);
router.get('/getAll', getCodeQuestionController)
export default router;
