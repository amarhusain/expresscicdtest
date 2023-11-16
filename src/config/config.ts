import dotenv from 'dotenv';
import { Config } from '../common/global';

dotenv.config();

const JWT_KEY = process.env.JWT_KEY || '';
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8080;
const MODEL_API_URL = process.env.MODEL_API_URL || '';

let MONGO_URI = '';


if (process.env.NODE_ENV === 'test') {
    MONGO_URI = process.env.MONGO_URI_TEST || '';
}

if (process.env.NODE_ENV === 'development') {
    MONGO_URI = process.env.MONGO_URI_DEVELOPMENT || '';
}

if (process.env.NODE_ENV === 'production') {
    MONGO_URI = process.env.AZURE_COSMOS_CONNECTIONSTRING || '';
}

export const config: Config = {
    mongo: {
        uri: MONGO_URI
    },
    server: {
        port: SERVER_PORT
    },
    jwt: {
        key: JWT_KEY
    },
    modelApi: {
        api: MODEL_API_URL
    }
}