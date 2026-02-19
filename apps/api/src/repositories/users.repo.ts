import pool from "../db/mysql.js";
import type { Pool, ResultSetHeader } from "mysql2/promise";

export type InsertUserInput = {
  username: string;
  email: string;
  password_hash: string;
};

export async function insertUser(pool: Pool, input: InsertUserInput) {
  const sql = `
  INSERT into users 
  (username, email, password_hash) 
  VALUES
  (?, ?, ?)
  `;

  const params = [input.username, input.email, input.password_hash];

  const result = await pool.execute<ResultSetHeader>(sql, params);

  return result;
}
