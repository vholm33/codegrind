import pool from "../db/mysql.js";

export async function createProblem(title: string, description: string) {
    const [result]: any = await db.query(
        "INSERT INTO problems (title, description) VALUES (?, ?)",
        [title, description]
    );
    return result.insertId;
}