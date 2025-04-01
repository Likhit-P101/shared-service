import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env.NODE_ENV || 'development';
const HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3003;

const VERSION_API = process.env.VERSION_API || '/v1';
const PREFIX_API = process.env.PREFIX_API || '/api';
const PATH_API = process.env.PATH_API || '/v1/api';

export enum ENV_TYPE {
    Dev = 'Dev',
    Uat = 'Uat',
    Prd = 'Prd'
}

export const SERVER = {
    HOSTNAME,
    PORT,
    ENV
};

export const PATH = {
    VERSION_API,
    PREFIX_API,
    PATH_API
};

export const LOG_DIR = process.env.LOG_DIRECTORY;
