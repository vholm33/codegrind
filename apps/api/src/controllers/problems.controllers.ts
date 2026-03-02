import { Request, Response } from "express";
import { addProblem } from "../services/problems.services.js";
import { fetchAllProblems, fetchProblemById } from "../services/problems.services.js";
import { removeProblem } from "../services/problems.services.js";
import { editProblem } from "../services/problems.services.js";
import { getProblemById } from "../repositories/problems.repo.js";

//HTTP request för att skapa ett problem, POST /problems
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

//Hämta alla problem, GET /problems
export async function getAllProblemsHandler(req: Request, res: Response) {
    try {
        const problems = await fetchAllProblems();
        
        res.json(problems);
    } catch (error: any) {
        res.status(400).json({
            message: "Kunde inte hämta alla problem",
            error: error.message
        })
    }
}

//Hämta ett problem, GET /problems/:id
export async function getProblemByIdHandler(req: Request, res: Response) {
    try {
        const problemId = Number(req.params.id);
        const problem = await fetchProblemById(problemId);

        res.json(problem)
    } catch (error: any) {
        res.status(400).json({
            message: "Kunde inte hämta problem",
            error: error.message
        })
    }
}

//Updatera ett problem, PUT /problems/:id
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

//Radera ett problem, DELETE /problems/:id
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
