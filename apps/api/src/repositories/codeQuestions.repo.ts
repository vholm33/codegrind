import type { Pool, ResultSetHeader } from 'mysql2';
import pool from '../db/mysql.js';
import type { AddCodeQuestion } from '../controllers/codeQuestions.controller.js';

export async function addCodeQuestionRepo(input: AddCodeQuestion) {
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
