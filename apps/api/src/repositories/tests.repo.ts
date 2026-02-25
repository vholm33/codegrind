import pool from "../db/mysql.js";

//Lägger till ett test kopplat till ett problem
export async function createTest(
    problemId: number,
    input: any,
    expected: any,
    isHidden: boolean = true
) {
    //sparar input och expected som JSON strängar
    await pool.query(
        "INSERT INTO railway.tests (problem_id, input, expected, is_hidden) VALUES (?, ?, ?, ?)",
        [problemId, JSON.stringify(input), JSON.stringify(expected), isHidden]
    );
}

//Hämtar alla tester för SUBMIT
export async function getTestsByProblemId(problemId: number) {
    const [rows]: any = await pool.query(
        "SELECT input, expected FROM railway.tests WHERE problem_id = ?",
        [problemId]
    );

    //Koverterar JSON sträng tillbaka till objekt
    return rows.map((row: any) => ({
        input: JSON.parse(row.input),
        expected: JSON.parse(row.expected),
    }));
}

//Hämtar bara synliga tester för TEST knappen
export async function getVisibleTests(problemId: number) {
    const [rows]: any = await pool.query(
        "SELECT input, expected FROM railway.tests WHERE problem_id = ? AND is_hidden = FALSE",
        [problemId]
    );

    return rows.map((row:any) => ({
        input: JSON.parse(row.input),
        expected: JSON.parse(row.expected)
    }));
}