import type { Request, Response } from 'express';
import { runTests, runSampleTests } from '../services/code-execution.services.js';

//Hanterar submission i frontend - submission knappen
export async function submitSolution(req: Request, res: Response) {
    try {
        const { problemId, userCode } = req.body;

        //Anropar service som kör VM och tester
        const result = await runTests(problemId, userCode);

        res.json(result);
    } catch (error: any) {
        res.status(400).json({
            message: 'Ett fel uppstod vid körning av submission',
            error: error.message,
        });
    }
}

//Hanterar test i frontend - test knappen
export async function runSample(req: Request, res: Response) {
    try {
        const { problemId, userCode } = req.body;

        const result = await runSampleTests(problemId, userCode);

        res.json(result);
    } catch (error: any) {
        res.status(400).json({
            message: 'Ett fel uppstod vid körning av test',
            error: error.message,
        });
    }
}
