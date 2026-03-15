import 'dotenv/config';
import pool from './mysql/db/mysql.js';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
/* import helmet from 'helmet' */

const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Använder development/production
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    console.log(`DEVELOPMENT running`);
    // Development: Allow Vite dev server
    app.use(
        cors({
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
            credentials: true,
        }),
    );
    console.log('🔓 CORS enabled for Vite dev server');
}
if (isProduction){
    console.log(`PRODUCTION running`);
    // Production
    const distPath = path.join(__dirname, '../../web/dist');
    const manifestPath = path.join(distPath, '.vite/manifest.json');
    console.log(`distPath: ${distPath}`);
    console.log(`manifestPath: ${manifestPath}`);

    app.use(
        cors({
            origin: process.env.FRONTEND_URL || true,
            credentials: true,
        }),
    );
    app.use(express.static(distPath));

    app.get('/', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });

    app.get('/login', (_req, res) => {
        res.sendFile(path.join(__dirname, '../../web/dist/login.html'));
    });

    app.get('/register', (_req, res) => {
        res.sendFile(path.join(__dirname, '../../web/dist/register.html'));
    });

    app.get('/addProblem', (_req, res) => {
        res.sendFile(path.join(distPath, 'addProblem.html'));
    });

    app.get('/src', express.static(path.join(distPath, 'src')));
}
/*

let manifest = {};
try {
    if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        console.log('Manifest loaded:', manifest);
    } else {
        console.log(`Manifest not found at: ${manifestPath}`);

        // Vad finns i dist?
        if (fs.existsSync(distPath)) {
            console.log('Content in dist/ :', fs.readdirSync(distPath));
            if (fs.existsSync(path.join(distPath, '.vite'))) {
                console.log('Innehåll .vite :', fs.readdirSync(path.join(distPath, '.vite')));
            }
        }
    }
} catch (error: any) {
    console.warn('Error när laddar manifest:', error.message);
} */

// ====== MONGODB ======
// import { mdbConn } from './mongodb/connection.js';
// console.log('Starting MongoDB connection'); // Starta MongoDB connection
// const ratings = mdbConn.collection('ratings');

/* app.use(helmet({contentSecurityPolicy: false})) */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//====== SQL - Routes ======
import userRoutes from './mysql/routes/users.routes.js';
app.use('/api/users', userRoutes);

import problemRoutes from './mysql/routes/problems.routes.js';
app.use('/api/problems', problemRoutes);

import submissionRoutes from './mysql/routes/submissions.routes.js';
app.use('/api/submissions', submissionRoutes);

import codeQuestionRoutes from './mysql/routes/codeQuestion.routes.js';
app.use('/api/codeQuestions', codeQuestionRoutes);

import categoriesRoute from './mysql/routes/categories.routes.js';
app.use('/api/categories', categoriesRoute);

import quizSessionRoutes from './mysql/routes/quizSessions.routes.js'
app.use('/api/quiz', quizSessionRoutes)

//====== MongoDB - Routes ======
import ratingRoutes from './mongodb/routes/ratingRoute.js';
app.use('/api/', ratingRoutes);
console.log('Rating routes --> /api/ratings/');

app.use('/src', express.static(path.join(__dirname, '../../web/src')));

app.listen(PORT, () => {
    console.log('Server running on port: ', PORT);
});

export default app;
