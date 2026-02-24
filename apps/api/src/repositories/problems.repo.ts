import pool from "../db/mysql.js";

//SQL-query för att skapa nytt problem i databasen
export async function createProblem(title: string, description: string) {
    const [result]: any = await pool.query(
        "INSERT INTO problems (title, description) VALUES (?, ?)",
        [title, description]
    );
    return result.insertId;
}

//Hämtar ett problem baserat på id
export async function getProblemById(id: number) {
    const [rows]: any = await pool.query (
        "SELECT id, title, description FROM problems WHERE id = ?",
        [id]
    );
    return rows[0]
}