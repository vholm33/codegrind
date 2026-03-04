import type { Pool, ResultSetHeader } from 'mysql2/promise';
export type InsertUserInput = {
    username: string;
    email: string;
    password_hash: string;
};
export declare function insertUser(pool: Pool, input: InsertUserInput): Promise<[ResultSetHeader, import("mysql2/promise").FieldPacket[]]>;
export type LoginUserInput = {
    username: string;
    password: string;
};
export declare function loginUser(pool: Pool, input: LoginUserInput): Promise<{
    success: boolean;
    message: string;
    user?: never;
} | {
    success: boolean;
    message: string;
    user: {
        id: any;
        username: any;
    };
}>;
//# sourceMappingURL=users.repo.d.ts.map