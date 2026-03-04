import type { Request, Response } from 'express';
import pool from '../db/mysql.js';
import { getAllCategoriesRepo } from '../repositories/categories.repo.js';

export type Category = {
    name: string;
    description: string | null;
};
export async function getAllCategoriesController(req: Request, res: Response) {
    try {
        console.log('[CONTROLLER] getAllCategories(req,res)');

        const categories = await getAllCategoriesRepo();

        return res.json({
            success: true,
            data: categories,
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Controller: getAllCategories() failed',
            error: error.message,
        });
    }
}

export async function getCategoryById(id: number) {
    const [rows]: any = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
}
