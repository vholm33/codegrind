import type { Request, Response } from 'express';
import { getLatestQuizSessionRepo, getQuizProfileRepo } from '../repositories/quizStats.repo.js';

// =========
// Helpers
// =========

function parseUserId(value: string | string[] | undefined): number | null {
    if (Array.isArray(value)) return null;

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function getValidUserId(req: Request, res: Response): number | null {
    const userId = parseUserId(req.params.userId);

    if (!userId) {
        res.status(400).json({
            success: false,
            message: 'Invalid userId',
        });
        return null;
    }

    return userId;
}

// =========
// Controllers
// =========

export async function getLatestQuizSessionController(req: Request, res: Response) {
    try {
        const userId = getValidUserId(req, res);
        if (!userId) return;

        const session = await getLatestQuizSessionRepo(userId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'No quiz session found',
            });
        }

        return res.status(200).json({
            success: true,
            data: session,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Could not fetch quiz session',
            error: error.message,
        });
    }
}

export async function getQuizProfileController(req: Request, res: Response) {
    try {
        const userId = getValidUserId(req, res);
        if (!userId) return;

        const profile = await getQuizProfileRepo(userId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'No user or stats found',
            });
        }

        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Could not fetch profile stats',
            error: error.message,
        });
    }
}
