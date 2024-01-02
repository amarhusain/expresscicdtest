export interface JwtPayload {
    email: string;
    userId: string;
}

export interface JwtPayloadResponse {
    email: string;
    iat: number;
    exp: number;
    userId: string;
}

export interface Config {
    mongoConnUri: string;
    serverPort: number;
    jwtKey: string;
    jwtExpiresIn: string;
    modelApiUrl: string;
    emailConnStr: string;
    appDomain: string | undefined;
}

export interface RecipientAddress {
    address: string;
}