import type { Request, Response } from 'express';
import pool from '../db/mysql.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//? Import services ?
//? Import repo ?
import { insertUser, type InsertUserInput } from '../repositories/users.repo.js';
import { loginUser, type LoginUserInput } from '../repositories/users.repo.js';

export async function registerUser(req: Request, res: Response) {
    try {
        console.log('[CONTROLLER] registerUser()');
        console.log('req.body:', req.body); //! has password_hash ?

        //? Use interface?
        const { username, email, password } = req.body;

        // [ ] ta bara emot password och sen hasha
        const password_hash = await bcrypt.hash(password, 10);

        console.log(`Hashed password: ${password_hash}`);

        // input måste vara ett objekt
        const input: InsertUserInput = {
            username,
            email,
            password_hash,
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
