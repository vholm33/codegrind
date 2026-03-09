import type { Request, Response } from 'express';
import pool from '../db/mysql.js';
import { getAllCategoriesRepo, addCategoriesRepo, removeCategoryRepo } from '../repositories/categories.repo.js';
import { realpathSync } from 'fs';

export type Category = {
    name: string;
    handout: string | null;
};
export async function getAllCategoriesController(_req: Request, res: Response) {
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

export async function addCategoriesController(req: Request, res: Response) {
    try {
        console.log(`[CONTROLLER] addCategoryController(req, res)`);
        const { name, handout } = req.body;

        if (!name || !handout) {
            return res.status(400).json({
                success: false,
                message: 'Name or handout missing',
            });
        }

        const input = { name, handout };

        const addedCategory = await addCategoriesRepo(input);
        return res.status(201).json({
            success: true,
            data: addedCategory,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: 'Adding category failed',
            error: error.message,
        });
    }
}

export async function removeCategoryController(req: Request, res: Response) {
    try {
        console.log(`[CONTROLLER] removeCategory(req, res)`);
        const { id } = req.params;

     if(!id) {
        return res.status(400).json({
            success: false,
            message: "Ange id!"
        });
    }
    
    const result: any = await removeCategoryRepo(Number(id));
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Kategorin kunde inte hittas"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Kategorin har raderats"
        }); 
        } catch(error) {
            return res.status(400).json({
                success: false,
                message: "Controller: removeCategoryController() misslyckades"
            })
        }
    }