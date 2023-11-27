import * as bodyparser from 'body-parser';
import cors from 'cors';
import stateRouter from './routes/state.routes';
import districtRouter from './routes/district.routes';
import authRouter from './routes/auth.routes';
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import logger from './common/logger';

import express, { NextFunction, Request, Response } from 'express';
import { config } from './common/config';
import path from 'path';



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
app.use('/api/district', districtRouter);


app.get('/health', (req: Request, res: Response) => {
    const message = `Server is running at http://localhost:${process.env.port}`;
    const timestamp = new Date().toLocaleString();
    res.status(200).send({ message, timestamp });
});

// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, '../out')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../out/index.html'));
// })

// Handling non matching request from client
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.error('[ERROR]: No matching API url "' + req.originalUrl + '" found.')
    res.status(404).send('No matching API url "' + req.originalUrl + '" found on the server.');
});

// Register the error handling middleware function
app.use(errorHandler);


try {

    // ------------ Uncomment for production -----------//
    // mongoose.connect(config.mongoUri.prod);

    // ------------ Uncomment for development -----------//
    mongoose.connect(config.mongoUri.dev);
    logger.info(`[DATABASE]: Connected with mongodb database.`)
} catch (err) {
    throw new Error('[ERROR]: Error connecting to database.')
}

export default app;