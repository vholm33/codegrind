import express from 'express';
import {
    createProblemHandler,
    getAllProblemsHandler,
    getProblemByIdHandler,
    deleteProblemHandler,
    updateProblemHandler,
} from '../controllers/problems.controllers.js';

const router = express.Router();

//Endpoints
router.get('/problems', getAllProblemsHandler);
router.get('/problems/:id', getProblemByIdHandler);

// Endpoint för att skapa problem
router.post('/problems', createProblemHandler);
router.put('/problems/:id', updateProblemHandler);
router.delete('/problems/:id', deleteProblemHandler);

export default router;
