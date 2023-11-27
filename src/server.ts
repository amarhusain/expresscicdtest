import app from './app';
import { config } from './common/config';

app.listen(config.serverPort, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${config.serverPort}`);
});