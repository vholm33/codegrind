import type { Pool, ResultSetHeader } from "mysql2/promise";
export type InsertUserInput = {
    username: string;
    email: string;
    password_hash: string;
};
export declare function insertUser(pool: Pool, input: InsertUserInput): Promise<[ResultSetHeader, import("mysql2/promise").FieldPacket[]]>;
//# sourceMappingURL=users.repo.d.ts.map