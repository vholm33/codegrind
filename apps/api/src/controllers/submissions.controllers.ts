import {runTests} from "../services/code-execution.services.js";
import {Request, Response} from "express";

//Hanterar submission i frontend
export async function submitSolution(req: Request, res: Response) {
    try {
        const {problemId, userCode} = req.body

        //Anropar service som kör VM och tester
        const result = await runTests(problemId, userCode);

        res.json(result);

    } catch (error: any) {
        res.status(400).json({
            message: "Ett fel uppstod vid körning av submission/tester",
            error: error.message
        })
    }
        
}