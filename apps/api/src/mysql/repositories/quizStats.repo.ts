import type { RowDataPacket } from 'mysql2';
import pool from '../db/mysql.js';

// =========
// Query rows
// =========

interface SessionRow extends RowDataPacket {
    id: number;
    userId: number;
    username: string;
    totalQuestions: number;
    questionsAnswered: number;
    totalPoints: number;
}

interface AnswerRow extends RowDataPacket {
    questionId: number;
    categoryName: string | null;
    attempts: number;
    points: number;
    isCorrect: number;
}

interface ProfileSessionRow extends RowDataPacket {
    id: number;
    totalQuestions: number;
    questionsAnswered: number;
    totalPoints: number;
    accuracy: number | null;
}

interface ProfileCategoryRow extends RowDataPacket {
    categoryName: string | null;
    sessionsSeen: number;
    accuracy: number | null;
    averagePoints: number | null;
}

// =========
// Mappers
// =========

function mapLatestSession(session: SessionRow, answers: AnswerRow[]) {
    return {
        id: session.id,
        userId: session.userId,
        userName: session.username,
        totalQuestions: session.totalQuestions,
        questionsAnswered: session.questionsAnswered,
        totalPoints: session.totalPoints,
        answers: answers.map((row) => ({
            questionId: row.questionId,
            categoryName: row.categoryName ?? 'Unknown category',
            attempts: row.attempts,
            points: row.points,
            isCorrect: Boolean(row.isCorrect),
        })),
    };
}

function mapProfileData(userName: string, sessions: ProfileSessionRow[], categories: ProfileCategoryRow[]) {
    return {
        userName,
        levelTitle: 'Consistent grinder',
        sessions: sessions.map((row) => ({
            id: row.id,
            totalQuestions: row.totalQuestions,
            questionsAnswered: row.questionsAnswered,
            totalPoints: row.totalPoints,
            accuracy: Number(row.accuracy ?? 0),
        })),
        categories: categories.map((row) => ({
            categoryName: row.categoryName ?? 'Unknown category',
            sessionsSeen: Number(row.sessionsSeen),
            accuracy: Number(row.accuracy ?? 0),
            averagePoints: Number(row.averagePoints ?? 0),
        })),
    };
}

// =========
// Repositories
// =========

export async function getLatestQuizSessionRepo(userId: number) {
    const [sessionRows] = await pool.query<SessionRow[]>(
        `
            SELECT
                qs.id,
                qs.userId,
                u.username,
                qs.totalQuestions,
                qs.questionsAnswered,
                qs.totalPoints
            FROM quizSessions qs
            INNER JOIN users u ON u.id = qs.userId
            WHERE qs.userId = ?
            ORDER BY qs.id DESC
            LIMIT 1
        `,
        [userId],
    );

    const session = sessionRows[0];
    if (!session) return null;

    const [answerRows] = await pool.query<AnswerRow[]>(
        `
            SELECT
                qa.questionId,
                c.name AS categoryName,
                qa.attempts,
                qa.points,
                qa.isCorrect
            FROM quizAnswers qa
            LEFT JOIN codeQuestions cq ON cq.id = qa.questionId
            LEFT JOIN categories c ON c.id = cq.categoryId
            WHERE qa.sessionId = ?
            ORDER BY qa.id
        `,
        [session.id],
    );

    return mapLatestSession(session, answerRows);
}

export async function getQuizProfileRepo(userId: number) {
    const [userRows] = await pool.query<RowDataPacket[]>(
        `
            SELECT id, username
            FROM users
            WHERE id = ?
            LIMIT 1
        `,
        [userId],
    );

    const user = userRows[0];
    if (!user) return null;

    const [sessionRows] = await pool.query<ProfileSessionRow[]>(
        `
            SELECT
                qs.id,
                qs.totalQuestions,
                qs.questionsAnswered,
                qs.totalPoints,
                ROUND(
                    100 * SUM(CASE WHEN qa.isCorrect = 1 THEN 1 ELSE 0 END) / NULLIF(qs.questionsAnswered, 0)
                ) AS accuracy
            FROM quizSessions qs
            LEFT JOIN quizAnswers qa ON qa.sessionId = qs.id
            WHERE qs.userId = ?
            GROUP BY qs.id, qs.totalQuestions, qs.questionsAnswered, qs.totalPoints
            ORDER BY qs.id
        `,
        [userId],
    );

    const [categoryRows] = await pool.query<ProfileCategoryRow[]>(
        `
            SELECT
                c.name AS categoryName,
                COUNT(DISTINCT qs.id) AS sessionsSeen,
                ROUND(
                    100 * SUM(CASE WHEN qa.isCorrect = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)
                ) AS accuracy,
                ROUND(AVG(qa.points), 1) AS averagePoints
            FROM quizAnswers qa
            INNER JOIN quizSessions qs ON qs.id = qa.sessionId
            LEFT JOIN codeQuestions cq ON cq.id = qa.questionId
            LEFT JOIN categories c ON c.id = cq.categoryId
            WHERE qs.userId = ?
            GROUP BY c.name
            ORDER BY accuracy DESC, averagePoints DESC
        `,
        [userId],
    );

    return mapProfileData(user.username as string, sessionRows, categoryRows);
}
