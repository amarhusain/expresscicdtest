import app from './app';
import { config } from './config/config';
import logger from './library/logger';


const PORT = config.server.port;

app.listen(PORT, () => {
    logger.info(`[SERVER]: Server 1 is running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`);
});