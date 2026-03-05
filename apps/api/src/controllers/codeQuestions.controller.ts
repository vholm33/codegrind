import type { Request, Response } from 'express';
import {
    addCodeQuestionRepo,
    getAllCodeQuestionsRepo,
    getAllQuestionsRepo,
} from '../repositories/codeQuestions.repo.js';

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

export async function getCodeQuestionController(req: Request, res: Response) {
    try {
        console.log(`[CONTROLLER] getCodeQuestionController(req, res)`);

        const { id } = req.body;
        if (!id) {
            return res.status(401).json({
                success: false,
                message: 'Missing id from SQL',
            });
        }

        const foundId = await getAllCodeQuestionsRepo(id);
        return res.status(200).json({
            success: true,
            message: 'id found',
            data: foundId,
        });
    } catch (error: any) {
        console.error(`‼️ error: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'getAllCodeQuestionController failed',
        });
    }
}

export async function getAllQuestions(req: Request, res: Response) {
    try {
        console.log(`[CONTROLLER] getAllQuestions(req, res)`);

        // Hämta all data från sql
        const questionData = await getAllQuestionsRepo();
        console.log('questionData:', questionData);

        return res.status(200).json({
            success: true,
            message: 'Lyckades hämta frågedata',
            data: questionData,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
