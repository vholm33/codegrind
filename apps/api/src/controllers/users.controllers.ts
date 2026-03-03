import type { Request, Response } from 'express';
import pool from '../db/mysql.js';
//? Import services ?
//? Import repo ?
import { insertUser, type InsertUserInput } from '../repositories/users.repo.js';

export async function registerUser(req: Request, res: Response) {
    try {
        //? Use interface?
        const { username, email, password_hash } = req.body;

        // input måste vara ett objekt
        const input: InsertUserInput = {
            username,
            email,
            password_hash,
        };
        console.log('Input:', input);

        if (!input.username) {
            console.error(`‼️ Input has no username`);
        }
        if (!input.email) {
            console.error(`‼️ Input has no email`);
        }
        if (!input.password_hash) {
            console.error(`‼️ Input has no hashed password. Password is undefined, can't be null for SQL`);
        }

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
