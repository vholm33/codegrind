import express from 'express';
import { getAllCategoriesController, addCategoriesController } from '../controllers/categories.controller.js';

const router = express.Router();

router.get('/get', getAllCategoriesController);
router.post('/add', addCategoriesController);
router.delete('/remove', addCategoriesController);

export default router;
