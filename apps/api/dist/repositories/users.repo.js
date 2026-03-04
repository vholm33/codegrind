import bcrypt from 'bcrypt'; // flytta till middleware?
export async function insertUser(pool, input) {
    console.log('[REPO] insertUser - input:', input);
    console.log('[REPO] password_hash length:', input.password_hash.length);
    const sql = `
      INSERT INTO users(username, email, password_hash)
      VALUES (?, ?, ?)
  `;
    const params = [input.username, input.email, input.password_hash];
    const result = await pool.execute(sql, params);
    return result;
}
export async function loginUser(pool, input) {
    console.log('[REPO] loginUser(pool, input)');
    console.log('[REPO] input:', input);
    try {
        // se om har input.username
        console.log('[REPO] Försöker hämta username från SQL:', input.username); //* OK 'test'
        // Hämta username från databas
        const [rows] = await pool.execute(`SELECT * FROM users
      WHERE username = ?`, [input.username]);
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
        const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);
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
    }
    catch (error) {
        console.error(`‼️ Login error: ${error}`);
        return {
            success: false,
            message: 'Fel under inloggs repo funktion',
        };
    }
}
//# sourceMappingURL=users.repo.js.map