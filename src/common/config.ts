import dotenv from 'dotenv';
import { Config } from '../common/global';

dotenv.config();

const JWT_KEY = process.env.JWT_KEY || '';
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8080;
const MODEL_API_URL = process.env.MODEL_API_URL || '';

const PROD_MONGO_URI = process.env.AZURE_COSMOS_CONNECTIONSTRING || '';

const DEV_MONGO_URI = process.env.MONGO_URI_DEVELOPMENT + "/" + process.env.DB_NAME_DEVELOPMENT;

export const config: Config = {
    mongoUri: {
        dev: DEV_MONGO_URI,
        prod: PROD_MONGO_URI
    },
    serverPort: SERVER_PORT,
    jwtKey: JWT_KEY,
    modelApi: MODEL_API_URL
}