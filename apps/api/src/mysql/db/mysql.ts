import { createPool } from 'mysql2/promise';
// import { env } from '../config/env.js';

import dotenv from 'dotenv';
dotenv.config();

// Railway cloud koppling
const pool = createPool({
    host: env.MYSQL_HOST,
    port: Number(env.MYSQL_PORT),
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
    connectTimeout: 60000,
    waitForConnections: true,
    connectionLimit: 10,
});

// Lokal mysql koppling
/* const pool = createPool({
    host: process.env.LOC_MYSQL_HOST ?? '',
    port: Number(process.env.LOC_MYSQL_PORT) || 3306,
    user: process.env.LOC_MYSQL_USER || '',
    password: process.env.LOC_MYSQL_PASSWORD || '',
    database: 'localCodeGrind',
    ssl: {
        rejectUnauthorized: false,
    },
    connectTimeout: 60000,
    waitForConnections: true,
    connectionLimit: 10,
}); */

export default pool;
