declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";
        REFRESH_TOKEN_SECRET: string;
        ACCESS_TOKEN_SECRET: string;
    }
}
