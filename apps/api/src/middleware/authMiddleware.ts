import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        username: string;
    };
}
export interface DecodedToken {
    userId: number;
    username: string;
}
export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
    console.log(`verifyToken(req, res, next)`);

    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'Ingen token',
        });
        return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'segredo-grande';

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Felaktig token',
        });
        return;
    }
    console.log('token:', token); //* OK

    try {
        const decoded = jwt.verify(token, jwtSecret) as unknown as DecodedToken;
        console.log('decoded:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
}
