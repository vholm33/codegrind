import express from 'express';
import {
    // addCodeQuestionController,
    getCodeQuestionController,
    getAllQuestions

} from '../controllers/codeQuestions.controller.js';

const router = express.Router();

// router.post('/add', addCodeQuestionController);
router.get('/all', getAllQuestions)
router.get('/getAll', getCodeQuestionController) // kombination med mongoDB
export default router;
