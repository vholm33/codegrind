import { createPool } from "mysql2/promise";
const pool = createPool({
    host: "shinkansen.proxy.rlwy.net",
    port: 35189,
    user: "root",
    password: "KWUfJXmtNJVamQUTnLKEHcpNqAndnfIe",
    database: "railway",
    ssl: {
        rejectUnauthorized: false,
    },
    connectTimeout: 60000,
    waitForConnections: true,
    connectionLimit: 10,
});
export default pool;
//# sourceMappingURL=mysql.js.map