// import pool from "../db/mysql.js";
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import bcrypt from 'bcrypt'; // flytta till middleware?

export type InsertUserInput = {
    username: string;
    email: string;
    passwordHash: string;
};

export async function insertUser(pool: Pool, input: InsertUserInput) {
    console.log('[REPO] insertUser - input:', input);
    console.log('[REPO] passwordHash length:', input.passwordHash.length);

    const sql = `
      INSERT INTO users(username, email, passwordHash)
      VALUES (?, ?, ?)
  `;

    const params = [input.username, input.email, input.passwordHash];

    const result = await pool.execute<ResultSetHeader>(sql, params);

    return result;
}

export type LoginUserInput = {
    username: string;
    password: string; // från frontend, så ej hashat än
};
export async function loginUser(pool: Pool, input: LoginUserInput) {
    console.log('[REPO] loginUser(pool, input)');
    console.log('[REPO] input:', input);
    try {
        // se om har input.username
        console.log('[REPO] Försöker hämta username från SQL:', input.username); //* OK 'test'

        // Hämta username från databas
        const [rows]: any = await pool.execute(
            `SELECT * FROM users
      WHERE username = ?`,
            [input.username],
        );

        const user = rows[0];
        if (!user) {
            console.error('[REPO] Ingen användare i SQL med angivet username:', input.username);
            return {
                success: false,
                message: 'Fel användarnamn eller lösenord',
                // Specifiera inte vilket!
            };
        }

        console.log('Jämför password input med hashat lösenord från databasen');
        // Jämför med lagrat hashat lösen
        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
            console.error('lösenord inte giltligt!');
            return {
                success: false,
                message: 'Fel användarnamn eller lösenord',
            };
        }

        console.log('Lösenord är korrekt');
        // Lösen är korrekt, returnera user info utan lösen
        return {
            success: true,
            message: 'Login lyckades',
            user: {
                id: user.id,
                username: user.username,
            },
        };
    } catch (error) {
        console.error(`‼️ Login error: ${error}`);
        return {
            success: false,
            message: 'Fel under inloggs repo funktion',
        };
    }
}

export async function getUserProfileById(pool: Pool, userId: number) {
    const [rows]: any = await pool.execute(
        `
            SELECT id, username, email
            FROM users
            WHERE id = ?
            LIMIT 1
        `,
        [userId],
    );

    return rows[0] ?? null;
}

export type UpdateUserProfileInput = {
    userId: number;
    username: string;
    email: string;
    passwordHash?: string;
};

export async function updateUserProfile(pool: Pool, input: UpdateUserProfileInput) {
    const sql = input.passwordHash
        ? `
              UPDATE users
              SET username = ?, email = ?, passwordHash = ?
              WHERE id = ?
          `
        : `
              UPDATE users
              SET username = ?, email = ?
              WHERE id = ?
          `;

    const params = input.passwordHash
        ? [input.username, input.email, input.passwordHash, input.userId]
        : [input.username, input.email, input.userId];

    const [result] = await pool.execute<ResultSetHeader>(sql, params);
    return result;
}

export async function removeProfileRepo(pool: Pool, userId: number) {
    console.log('[Repo] In remove profile ');

    console.log('userId to be removed:', userId);
    const [rows]: any = await pool.execute(
        `
            DELETE FROM users WHERE id = ?
        `,
        [userId],
    );

    console.log('User removed?');
    return rows[0] ?? null;
}
