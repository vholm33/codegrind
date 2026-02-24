import pool from "../db/mysql.js";

//Lägger till ett test kopplat till ett problem
export async function createTest(
    problemId: number,
    input: any,
    expected: any
) {
    //sparar input och expected som JSON strängar
    await pool.query(
        "INSERT INTO railway.tests (problem_id, input, expected) VALUES (?, ?, ?)",
        [problemId, JSON.stringify(input), JSON.stringify(expected)]
    );
}

//Hämtar alla tester för ett problem
export async function getTestsByProblemId(problemId: number) {
    const [rows]: any = await pool.query(
        "SELECT input, expected FROM tests WHERE problem_id = ?",
        [problemId]
    );

    //Koverterar JSON sträng tillbaka till objekt
    return rows.map((row: any) => ({
        input: JSON.parse(row.input),
        expected: JSON.parse(row.expected),
    }));
}