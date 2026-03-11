import express from 'express';
import { getAllCategoriesController, addCategoriesController, removeCategoryController } from '../controllers/categories.controller.js';

const router = express.Router();

router.get('/get', getAllCategoriesController);
router.post('/add', addCategoriesController);
router.delete('/remove/:id', removeCategoryController);

export default router;
