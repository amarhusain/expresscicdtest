import dotenv from 'dotenv';
import { Config } from '../common/global';

dotenv.config();

const { NODE_ENV, DEVELOPMENT_DOMAIN, PRODUCTION_DOMAIN, JWT_KEY, JWT_EXPIRES_IN, SERVER_PORT, MODEL_API_URL, MONGO_URI_DEVELOPMENT, DB_NAME_DEVELOPMENT, COMMUNICATION_SERVICES_CONNECTION_STRING, AZURE_COSMOS_CONNECTIONSTRING } = process.env;

const jwtKey = JWT_KEY || '';
const jwtExpiresIn = JWT_EXPIRES_IN || '';
const serverPort = SERVER_PORT ? Number(SERVER_PORT) : 8080;
const modelApiUrl = MODEL_API_URL || '';
const emailConnStr = COMMUNICATION_SERVICES_CONNECTION_STRING || '';

const PROD_MONGO_URI = AZURE_COSMOS_CONNECTIONSTRING || '';
const DEV_MONGO_URI = MONGO_URI_DEVELOPMENT + "/" + DB_NAME_DEVELOPMENT;

const mongoConnUri = NODE_ENV === 'development' ? DEV_MONGO_URI : PROD_MONGO_URI;
const appDomain = NODE_ENV === 'development' ? DEVELOPMENT_DOMAIN : PRODUCTION_DOMAIN;

export const config: Config = {
    mongoConnUri,
    serverPort,
    jwtKey,
    jwtExpiresIn,
    modelApiUrl,
    emailConnStr,
    appDomain
}