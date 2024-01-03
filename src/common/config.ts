import dotenv from 'dotenv';
import { Config } from '../common/global';

dotenv.config();

const { DEVELOPMENT_DOMAIN, PRODUCTION_DOMAIN, JWT_KEY, JWT_EXPIRES_IN, SERVER_PORT, MONGO_URI_DEVELOPMENT, DB_NAME_DEVELOPMENT, COMMUNICATION_SERVICES_CONNECTION_STRING, AZURE_COSMOS_CONNECTIONSTRING } = process.env;

const jwtKey = JWT_KEY || 'E3229B4313A5EA2DBE7B229B4313A5EAEF954E31CE32EF954E31CE32DBE7B29B4313A5EA2EE3';
const jwtExpiresIn = JWT_EXPIRES_IN || '';
const serverPort = SERVER_PORT ? Number(SERVER_PORT) : 8080;
const emailConnStr = COMMUNICATION_SERVICES_CONNECTION_STRING || '';

// ------------ Uncomment for production -----------//
const mongoConnUri = AZURE_COSMOS_CONNECTIONSTRING || '';
const appDomain = PRODUCTION_DOMAIN;

// ------------ Uncomment for development -----------//
// const mongoConnUri = MONGO_URI_DEVELOPMENT + "/" + DB_NAME_DEVELOPMENT;
// const appDomain =  DEVELOPMENT_DOMAIN ;

export const config: Config = {
    mongoConnUri,
    serverPort,
    jwtKey,
    jwtExpiresIn,
    emailConnStr,
    appDomain
}