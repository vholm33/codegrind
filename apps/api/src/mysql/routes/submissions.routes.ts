import express from 'express';
import { submitSolution } from '../controllers/submissions.controllers.js';

const router = express.Router();

// /api/submissions/submit

// Endpoint för att skicka in användarens lösning
router.post('/submit', submitSolution);

export default router;
