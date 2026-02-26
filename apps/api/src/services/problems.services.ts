import { createProblem } from "../repositories/problems.repo.js"
import { updateProblem } from "../repositories/problems.repo.js";
import { deleteProblem } from "../repositories/problems.repo.js";

//Buisness logic för att skapa problem
export async function addProblem(title: string, description: string) {
    
    //Validering
    if (!title || !description) {
        throw new Error("Rubrik och en beskrivning behövs!");
    }
    //Anropar repository för att spara i databasen
    return await createProblem(title, description)
}

//UPDATE
export async function editProblem(problemId: number, title: string, description: string) {
    if (!problemId || !title || !description) {
        throw new Error("Ogiltig data");
    }     

    await updateProblem(problemId, title, description);

    return {message:"Problemet har uppdaterats!", success: true}
}

//DELETE
export async function removeProblem(problemId: number) {
    if (!problemId) {
        throw new Error("Problem id krävs!");
    }

    await deleteProblem(problemId);

    return {message:"Problemet har raderats!", success: true}
}