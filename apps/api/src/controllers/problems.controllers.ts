import {Request, Response} from "express";
import {addProblem} from "../services/problems.services.js";

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