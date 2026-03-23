import type { Request, Response } from 'express';
import type { QuizSessions, QuizAnswers } from '@shared/types.js';
import { saveQuizSessionService, saveQuizAnswersService } from '../services/quiz.service.js';

export async function saveQuizSession(req: Request, res: Response) {
    try {
        console.log('[CONTROLLER] saveQuizSession');
        console.log('req.body:', req.body); //! undefined

        const {
            session,
            answers,
        }: {
            session: QuizSessions;
            answers: QuizAnswers[];
        } = req.body;

        // Saknas något från quizSession?
        if (!session?.userId || !session?.totalQuestions || !session?.questionsAnswered || !session?.totalPoints) {
            console.error('Något till sessionen saknas');
            return res.status(400).json({
                ok: false,
                message: 'session krävs. (userId, totalQuestions, questionsAnswered, totalPoints) saknas!',
            });
        }

        // Saknas något från quizAnswers?

        if (!Array.isArray(answers) || answers.length === 0) {
            console.error('Är inte en array');
            return res.status(400).json({
                ok: false,
                message: 'answers måste vara en array med minst ett svar!',
            });
        }

        console.log('SUCCESS: sessions & answers ');
        console.log('Innan skickas till SERVICE');
        const sessionId = await saveQuizSessionService(session);
        console.log('EFTER service --> sessionId:', sessionId);

        const answersResult = await saveQuizAnswersService(sessionId, answers);
        console.log('EFTER från service --> sessionResult:', answersResult);

        return res.status(201).json({
            success: true,
            data: { sessionId, answersResult },
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
