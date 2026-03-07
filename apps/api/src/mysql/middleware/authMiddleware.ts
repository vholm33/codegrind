/* import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function verifyToken(req: Request, res: Response, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, 'our-secret-key');
        req.userID = decoded.userID;
        next();
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token',
        });
    }
}
 */
