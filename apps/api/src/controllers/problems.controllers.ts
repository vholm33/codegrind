import { Request, Response } from "express";
import { addProblem } from "../services/problems.services.js";
import { removeProblem } from "../services/problems.services.js";
import { editProblem } from "../services/problems.services.js";

//Hanterar HTTP request för att skapa problem
export async function createProblemHandler(req: Request, res: Response) {
    try {
        const {title, description} = req.body;

        //Anropar problems.service
        const id = await addProblem(title, description);

        //Skickar tillbaka ID till frontend
        res.status(201).json({id});

    } catch (error: any){
        res.status(400).json({
            message:"Kunde inte skapa problem",
            error: error.message})
    }
}

//UPDATE
export async function updateProblemHandler(req: Request, res: Response) {
    try {
        const problemId = Number(req.params.id);
        const { title, description } = req.body;

        const result = await editProblem(problemId, title, description);

        res.json(result);
    } catch (error: any){
        res.status(400).json({
            message:"Kunde inte updatera",
            error: error.message})
    }
}

//DELETE
export async function deleteProblemHandler(req: Request, res: Response) {
    try {
        const problemId = Number(req.params.id);

        const result = await removeProblem(problemId);

        res.json(result);

    } catch (error: any){
        res.status(400).json({
            message:"Kunde inte radera",
            error: error.message})
    }
}
