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
    console.group(`verifyToken(req, res, next)`);

    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'Ingen token',
        });
        return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        res.status(500).json({
            success: false,
            message: 'JWT_SECRET missing',
        });
        return;
    }

    // const token = authHeader.split(' ')[1]!; # non-null assertion
    // const [, token] = authHeader.split(' ')[1]; # destructuring
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
    } finally {
        console.groupEnd();
    }
}

// module.exports = verifyToken;

/* function verifyToken(req: Request, res: Response) {
    try {
        console.log('[MIDDLEWARE] verifyToken()');
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log(`Ingen token i header`);
            return res.status(401).json({
                success: false,
                message: 'Ingen token hittades.',
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token hittad:', token?.substring(0, 20) + '...');

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error(`JWT_TOKEN inte definierad.`);
            return res.status(500).json({
                success: false,
                message: 'Servertoken konfig-fel',
            });
        }

        const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
        console.log(`Token-verifierad användare ${decoded.username}`);
        return res.json({
            success: true,
            message: 'Token giltig',
            user: {
                id: decoded.userId,
                username: decoded.username,
            },
        });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.log('Token har gått ut');
            return res.status(401).json({
                success: false,
                message: 'Token har gått ut',
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            console.log('Ogiltig token');
            return res.status(401).json({
                success: false,
                message: 'Ogiltig token',
            });
        }

        console.error('verifyToken error:', error);
        return res.status(500).json({
            success: false,
            message: 'Serverfel vid token-verifiering',
        });
    }
} */
