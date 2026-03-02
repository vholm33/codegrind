import 'dotenv/config';
import pool from './db/mysql.js';
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

const distPath = path.join(__dirname, '../../web/dist');
const manifestPath = path.join(distPath, '.vite/manifest.json');

let manifest = {};
try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    console.log('Manifest loaded:', manifest);
} catch (error: any) {
    console.warn(error.message);
}

/* app.use(helmet({contentSecurityPolicy: false})) */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.get('/src', express.static(path.join(distPath, 'src')));

app.listen(PORT, () => {
    console.log('Server running on port: ', PORT);
});

export default app;
/* import { insertUser } from './repositories/users.repo.js';

console.log(process.env.MYSQL_PUBLIC_URL);

const result = await insertUser(pool, {
    username: 'jerryjohnson',
    email: 'jerry@gmail.com',
    password_hash: '3848328423KHFDHCsjkdfhajk',
});

console.log(result);
 */
