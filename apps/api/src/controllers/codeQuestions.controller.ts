import type { Request, Response } from 'express';
import { addCodeQuestionRepo } from '../repositories/codeQuestions.repo.js';

export type AddCodeQuestion = {
    codeTitle: string;
    codeQuestion: string;
    codeAnswer: string;
};
export async function addCodeQuestionController(req: Request, res: Response) {
    try {
        console.log('[CONTROLLER] addCodeQuestionController()');
        const { codeTitle, codeQuestion, codeAnswer } = req.body;

        if (!codeTitle || !codeQuestion || !codeAnswer) {
            return res.status(400).json({
                success: false,
                message: 'titel, fråga eller svar finns inte',
            });
        }

        console.table({ codeTitle, codeQuestion, codeAnswer });

        const input = { codeTitle, codeQuestion, codeAnswer };
        console.log(input);

        console.log('Service/repo function to add to database');
        const addedCodeQuestion = await addCodeQuestionRepo(input);

        return res.status(201).json({
            success: true,
            message: 'Kodfråga skapad',
            data: {
                codeTitle,
                codeQuestion,
                codeAnswer,
            },
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'addCodeQuestionController failed',
            error: error.message,
        });
    }
}
