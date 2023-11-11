export interface JwtPayload {
    email: string;
    userId: string;
}

export interface Config {
    mongo: {
        uri: string;
    },
    server: {
        port: number;
    },
    jwt: {
        key: string;
    },
    modelApi: {
        api: string;
    }
}