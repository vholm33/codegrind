import express from 'express';
import {
    registerUser,
    loginUserController,
    verifyTokenhandler,
    getMyProfileController,
    updateMyProfileController,
} from '../controllers/users.controllers.js';
import { verifyToken } from '../../middleware/authMiddleware.js';
const router = express.Router();

// /api/users/register
router.post('/register', registerUser);
router.post('/login', loginUserController);
router.get('/verify', verifyToken, verifyTokenhandler);
router.get('/profile/me', verifyToken, getMyProfileController);
router.put('/profile/me', verifyToken, updateMyProfileController);

export default router;
