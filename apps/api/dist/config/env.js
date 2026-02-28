function required(variable) {
    const value = process.env[variable];
    if (!value) {
        throw new Error(`Missing environment variable ${variable}`);
    }
    return value;
}
export const env = {
    MYSQL_PUBLIC_URL: required("MYSQL_PUBLIC_URL"),
    MYSQL_ROOT_PASSWORD: required("MYSQL_ROOT_PASSWORD"),
    MYSQL_URL: required("MYSQL_URL"),
    MYSQL_DATABASE: required("MYSQL_DATABASE"),
    MYSQL_HOST: required("MYSQL_HOST"),
    MYSQL_PASSWORD: required("MYSQL_PASSWORD"),
    MYSQL_PORT: required("MYSQL_PORT"),
    MYSQL_USER: required("MYSQL_USER"),
};
//# sourceMappingURL=env.js.map