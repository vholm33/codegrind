import express from 'express';
import { getAllCategoriesController } from '../controllers/categories.controller.js';

const router = express.Router();

router.post('/add', getAllCategoriesController);

export default router;
