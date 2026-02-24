import { createPool } from "mysql2/promise";
import { env } from "../config/env.js";

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

export default pool;
