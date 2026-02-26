import pool from "../db/mysql.js";

//SQL-query för att skapa nytt problem i databasen
export async function createProblem(title: string, description: string) {
    const [result]: any = await pool.query(
        "INSERT INTO railway.problems (title, description) VALUES (?, ?)",
        [title, description]
    );
    return result.insertId;
}

//Hämta alla problem
export async function getAllProblems() {
    const [rows]: any = await pool.query(
        "SELECT id, title, description, created_at FROM railway.problems"
    );
    return rows;
}

//Hämtar ett problem baserat på id
export async function getProblemById(problemId: number) {
    const [rows]: any = await pool.query (
        "SELECT id, title, description FROM railway.problems WHERE id = ?",
        [problemId]
    );
    return rows[0]
}

//UPDATE - För att updatera ett problem
export async function updateProblem(problemId: number, title: string, description:string) {
    await pool.query(
        "UPDATE railway.problems SET title = ?, description = ? WHERE id = ?",
        [title, description, problemId]
    );
}

// DELETE - För att radera ett problem
export async function deleteProblem(problemId: number) {
    await pool.query(
        "DELETE FROM railway.problems WHERE id = ?", [problemId]
    );
}