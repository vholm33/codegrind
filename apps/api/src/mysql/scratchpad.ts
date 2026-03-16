import 'dotenv/config';
import pool from './db/mysql.js';
import { insertUser } from './repositories/users.repo.js';

console.log(process.env.MYSQL_PUBLIC_URL);

const result = await insertUser(pool, {
    username: 'jerryjohnson',
    email: 'jerry@gmail.com',
    passwordHash: '3848328423KHFDHCsjkdfhajk',
});

console.log(result);
