import dotenv from 'dotenv';
import { Config } from '../common/global';

dotenv.config();

const JWT_KEY = process.env.JWT_KEY || '';
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8080;
const MODEL_API_URL = process.env.MODEL_API_URL || '';

let MONGO_USERNAME = '';
let MONGO_PASSWORD = '';
let MONGO_URI = '';
let DB_NAME = '';


if (process.env.NODE_ENV === 'test') {
    MONGO_USERNAME = process.env.MONGO_USERNAME_TEST || '';
    MONGO_PASSWORD = process.env.MONGO_PASSWORD_TEST || '';
    MONGO_URI = process.env.MONGO_URI_TEST || '';
    DB_NAME = process.env.DB_NAME__TEST || '';
}

if (process.env.NODE_ENV === 'development') {
    MONGO_USERNAME = process.env.MONGO_USERNAME_DEVELOPMENT || '';
    MONGO_PASSWORD = process.env.MONGO_PASSWORD_DEVELOPMENT || '';
    MONGO_URI = process.env.MONGO_URI_DEVELOPMENT || '';
    DB_NAME = process.env.DB_NAME_DEVELOPMENT || '';
}

if (process.env.NODE_ENV === 'production') {
    MONGO_USERNAME = process.env.MONGO_USERNAME_PRODUCTION || '';
    MONGO_PASSWORD = process.env.MONGO_PASSWORD_PRODUCTION || '';
    MONGO_URI = process.env.MONGO_URI_PRODUCTION || '';
    DB_NAME = process.env.DB_NAME_PRODUCTION || '';
}

export const config: Config = {
    mongo: {
        uri: MONGO_URI + '/' + DB_NAME
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