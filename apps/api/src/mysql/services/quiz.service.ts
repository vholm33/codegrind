import type { Pool, ResultSetHeader } from 'mysql2';
import pool from '../db/mysql.js';
import type { QuizSessions, QuizAnswers } from '@shared/types.js';

// [x] SUCCESS
export async function saveQuizSessionService(session: QuizSessions) {
    try {
        console.log('[SERVICE] saveQuizSessionService(session)');
        console.log('session:', session);

        // 1. insert Session
        const [sessionResult] = await pool.query(
            `
            INSERT INTO quizSessions(userId, totalQuestions, questionsAnswered, totalPoints)
            VALUES (?,?,?,?)
        `,
            [session.userId, session.totalQuestions, session.questionsAnswered, session.totalPoints],
        );

        console.log('sessionResult:', sessionResult);

        return (sessionResult as any).insertId;
        // returnera bara ren data
        /* return {
            success: true,
            message: "saveQuizSessionService lyckades sätta in quiz resultatet"
        } */
    } catch (error: any) {
        console.error(`‼️ [SERVICE] ERROR in saveQuizSessionService: ${error.message}`);
        throw error;
    }
}

export async function saveQuizAnswersService(sessionId: number, answers: QuizAnswers[]) {
    try {
        console.log('[SERVICE] saveQuizAnswersService(answers)');
        console.log('answers:', answers);

        for (const answer of answers) {
            // 1. insert Session
            await pool.query(
                `
                INSERT INTO quizAnswers(sessionId, questionId, attempts, points, isCorrect)
                VALUES (?,?,?,?,?)
            `,
                [sessionId, answer.questionId, answer.attempts, answer.points, answer.isCorrect],
            );
        }
        /* const values = answers.map(a => [
            sessionId,
            a.questionId,
            a.attempts,
            a.points,
            a.isCorrect
        ]) */

        console.log('EFTER for...of loop');
        // returnera bara ren data
        return {
            success: true,
            message: 'Lyckades lägga till quizSession och quizAnswers i databasen',
        };
    } catch (error: any) {
        console.error(`‼️ [SERVICE] ERROR in saveQuizAnswersService: ${error.message}`);
        throw error;
    }
}
