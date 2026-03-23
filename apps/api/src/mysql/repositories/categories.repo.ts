import type { Pool, ResultSetHeader } from 'mysql2';
import pool from '../db/mysql.js';
import type { Category } from '../controllers/categories.controller.js';

export async function getAllCategoriesRepo() {
    try {
        console.log('[REPO] getAllCategoriesRepo()');

        const [rows] = await pool.query(`
            SELECT id, name, handout
            FROM categories
            ORDER BY name
        `);

        // console.log('[REPO] existing categories:', rows); //  visar alla kategorier
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

export async function addCategoriesRepo(input: Category) {
    try {
        console.log(`[REPO] addCategoriesRepo()`);
        const [rows] = await pool.query(
            `
            INSERT INTO categories(
                name, handout
            )
            VALUES (?, ?)
        `,
            [input.name, input.handout],
        );
        return rows;
    } catch (error: any) {
        console.error(`‼️ [REPO] ERROR in addCategoriesRepo: ${error.message}`);

        return {
            success: false,
            error: error.message,
            sqlMessage: error.sqlMessage,
        };
    }
}

export async function removeCategoryRepo(id: number) {
    try {
        console.log('[REPO] removeCategoryRepo()');
        const [result]: any = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return result;
    } catch (error: any) {
        console.error(`!! [REPO] ERROR in removeCateoryRepo: ${error.message}`);

        return {
            success: false,
            error: error.message,
            sqlMessage: error.sqlMessage,
        };
    }
}
