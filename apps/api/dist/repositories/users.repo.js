import pool from "../db/mysql.js";
export async function insertUser(pool, input) {
    const sql = `
  INSERT into users 
  (username, email, password_hash) 
  VALUES
  (?, ?, ?)
  `;
    const params = [input.username, input.email, input.password_hash];
    const result = await pool.execute(sql, params);
    return result;
}
//# sourceMappingURL=users.repo.js.map