import type { Pool, ResultSetHeader } from 'mysql2';
import pool from '../db/mysql.js';
import type { CodeQuestion } from '@shared/types.js';

export async function addCodeQuestionRepo(input: CodeQuestion) {
    try {
        console.log('[REPO] addCodeQuestionRepo()');
        console.log('[REPO] input:', input);

        const [result]: any = await pool.query<ResultSetHeader>(
            `
            INSERT INTO railway.codeQuestions(
                codeTitle, codeQuestion, codeAnswer
            ) VALUES (?, ?, ?)
        `,
            [input.codeTitle, input.codeQuestion, input.codeAnswer],
        );

        console.log('[REPO] insert result:', result);
        return {
            success: true,
            insertId: result.insertId,
            affectedRows: result.affectedRows,
        };
    } catch (error: any) {
        console.error(`‼️ [REPO] ERROR in addCodeQuestionRepo: ${error.message}`);

        return {
            success: false,
            error: error.message,
            sqlMessage: error.sqlMessage,
        };
    }
}

export async function getAllCodeQuestionsRepo(id: number) {
    try {
        console.log('[REPO] addCodeQuestionRepo()');
        console.log('[REPO] ID from SQL codeQuestions:', id);

        const [result]: any = await pool.query<ResultSetHeader>(
            `SELECT * FROM codeQuestions
            WHERE id = ?
            `,
            [id],
        );

        console.log('[REPO] insert result:', result);
        return {
            success: true,
            data: result,
        };
    } catch (error: any) {
        console.error(`‼️ [REPO] ERROR in addCodeQuestionRepo: ${error.message}`);

        return {
            success: false,
            error: error.message,
            sqlMessage: error.sqlMessage,
        };
    }
}
// Get question and categoryName
export async function getAllQuestionsRepo() {
    try {
        const [result]: any = await pool.query<ResultSetHeader>(`
            SELECT
                q.id,
                q.categoryId,
                q.codeQuestion,
                q.codeAnswer,
                c.name as categoryName
            FROM codeQuestions q
            LEFT JOIN categories c ON q.categoryId = c.id
            ORDER BY q.id
        `);

        console.log(`[REPO] result: ${result}`);
        return {
            success: true,
            data: result,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            sqlMessage: error.sqlMessage,
        };
    }
}
