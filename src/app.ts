import express, { NextFunction, Request, Response } from 'express';

import * as bodyparser from 'body-parser';
import cors from 'cors';
import { config } from './config/config';
import stateRouter from './routes/state.routes';
import districtRouter from './routes/district.routes';
import authRouter from './routes/auth.routes';
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import logger from './library/logger';

declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtPayload;
            uploaderError?: Error;
        }
    }
}

const app: express.Application = express();

app.use(bodyparser.json());
app.use(cors());

// Define the error handling middleware function
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(err.stack);
    res.status(500).send(err.name + ' : ' + err.message);
}

app.use('/api', authRouter);
app.use('/api', stateRouter);
app.use('/api', districtRouter);


app.get('/health', (req: Request, res: Response) => {
    const message = `Server is running at http://localhost:${config.server.port}`;
    const timestamp = new Date().toLocaleString();
    res.status(200).send({ message, timestamp });
});

// Handling non matching request from client
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.error('[ERROR]: No matching API url "' + req.originalUrl + '" found.')
    res.status(404).send('No matching API url "' + req.originalUrl + '" found on the server.');
});

// Register the error handling middleware function
app.use(errorHandler);

// if (!config.mongo.uri) {
//     throw new Error('[ERROR]: Mongo URI must be defined.');
// }

try {
    // let connStr = process.env.AZURE_COSMOS_CONNECTIONSTRING || 'N/A';
    mongoose.connect(config.mongo.uri);
    logger.info(`[DATABASE]: Connected with mongodb ${process.env.NODE_ENV} database.`)
} catch (err) {
    throw new Error('[ERROR]: Error connecting to 1 database.')
}

export default app;