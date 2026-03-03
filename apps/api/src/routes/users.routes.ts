import express from 'express';
import {
    registerUser,
    loginUserController
} from '../controllers/users.controllers.js';

const router = express.Router();

// /api/users/register
router.post('/register', registerUser);

router.post('/login', loginUserController)

export default router;
