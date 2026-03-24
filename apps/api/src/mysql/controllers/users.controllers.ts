import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import pool from '../db/mysql.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//? Import services ?
//? Import repo ?
import { insertUser, type InsertUserInput } from '../repositories/users.repo.js';
import { loginUser, type LoginUserInput } from '../repositories/users.repo.js';
import { removeProfileRepo } from '../repositories/users.repo.js';
import { getUserProfileById, updateUserProfile, type UpdateUserProfileInput } from '../repositories/users.repo.js';

export async function registerUser(req: Request, res: Response) {
    try {
        console.log('[CONTROLLER] registerUser()');
        console.log('req.body:', req.body); //! has password_hash ?

        //? Use interface?
        const { username, email, password } = req.body;

        // [ ] ta bara emot password och sen hasha
        const passwordHash = await bcrypt.hash(password, 10);

        console.log(`Hashed password: ${passwordHash}`);

        // input måste vara ett objekt
        const input: InsertUserInput = {
            username,
            email,
            passwordHash,
        };
        console.log('Input:', input);

        const registeredUser = await insertUser(pool, input);
        res.status(201).json({
            message: 'Användare registredad!',
            user: registeredUser,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'registerUser kunde inte registrera användare',
            error: error.message,
        });
    }
}

export async function loginUserController(req: Request, res: Response) {
    try {
        console.log('[CONTROLLER] loginUserController(req,res)');
        console.log('req.body:', req.body);

        //! Lösen inte hashat från frontend
        const { username, password } = req.body;

        //! bcrypt compare password
        // console.info('BCRYPT compare with hashed password')

        if (!username || !password) {
            return res.status(400).json({
                message: 'Användarnamn och lösenord krävs',
            });
        }

        // Input Object
        const input: LoginUserInput = {
            username,
            password,
        };
        console.log('input:', input);
        const result = await loginUser(pool, input);

        if (!result.success) {
            console.error(`‼️ [CONTROLLER] result.sucess failed from await loginUser()`);
            return res.status(401).json({
                message: result.message,
            });
        }

        // Login SUCCESS - skapa JWT token
        const token = jwt.sign(
            {
                userId: result.user!.id,
                username: result.user!.username,
            },
            process.env.JWT_SECRET || 'segredo-grande',
            { expiresIn: '100d' },
        );

        // Skicka response med token och user info
        return res.json({
            message: 'Inlogg lyckades',
            token: token,
            user: result.user,
        });
    } catch (error: any) {
        console.error('loginUserController error:', error);
        return res.status(500).json({
            error: error.message,
        });
    }
}

export function verifyTokenhandler(req: AuthRequest, res: Response): void {
    res.status(200).json({
        success: true,
        message: 'Token är giltig',
        user: req.user,
    });
}

export async function getMyProfileController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await getUserProfileById(pool, userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: 'Could not fetch user profile',
            error: error.message,
        });
    }
}

export async function updateMyProfileController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        const { username, email, password } = req.body;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        if (!username || !email) {
            return res.status(401).json({
                message: 'Username and email are required',
            });
        }

        const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

        const input: UpdateUserProfileInput = {
            userId,
            username,
            email,
        };

        if (passwordHash) {
            input.passwordHash = passwordHash;
        }

        const result = await updateUserProfile(pool, input);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'No user was updated',
            });
        }

        const updatedUser = await getUserProfileById(pool, userId);

        return res.status(200).json({
            message: 'Profile updated',
            user: updatedUser,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: 'Could not update profile',
            error: error.message,
        });
    }
}

export async function deleteUserProfileController(req: AuthRequest, res: Response) {
    try {
        console.log('[Kontroller] Ta bort profil');
        const userId: number | undefined  = req.user?.userId;
        console.log('userId:', userId);

        // const { username, email, password } = req.body;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const result = await removeProfileRepo(pool, userId);
        console.log('removed?', result);
        /* if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'No user was updated',
            });
        }

        const updatedUser = await getUserProfileById(pool, userId);
 */
        return res.status(200).json({
            message: 'Profile deleted',
            // user: updatedUser,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: 'Could not delete profile',
            error: error.message,
        });
    }
}
