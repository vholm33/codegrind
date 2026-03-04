import type { Pool, ResultSetHeader } from 'mysql2';
import pool from '../db/mysql.js';
import type { Category } from '../controllers/categories.controller.js';

export async function getAllCategoriesRepo() {
    try {
        console.log('[REPO] addCodeQuestionRepo()');

        const [rows] = await pool.query(`
            SELECT id, name, description
            FROM categories
            ORDER BY name
        `);

        console.log('[REPO] existing categories:', rows);
        return rows;
    } catch (error: any) {
        console.error(`‼️ [REPO] ERROR in addCodeQuestionRepo: ${error.message}`);

        return {
            success: false,
            error: error.message,
            sqlMessage: error.sqlMessage,
        };
    }
}
