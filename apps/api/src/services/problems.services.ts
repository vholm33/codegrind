import {createProblem} from "../repositories/problems.repo.js"

//Buisness logic för att skapa problem
export async function addProblem(title: string, description: string) {
    
    //Validering
    if (!title || !description) {
        throw new Error("Rubrik och en beskrivning behövs!");
    }

    //Anropar repository för att spara i databasen
    return await createProblem(title, description)
}