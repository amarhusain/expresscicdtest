export interface JwtPayload {
    email: string;
    userId: string;
}

export interface Config {
    mongoUri: {
        dev: string;
        prod: string;
    };
    serverPort: number;
    jwtKey: string;
    jwtExpiresIn: string;
    modelApi: string;
}