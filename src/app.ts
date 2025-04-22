import express, { Express } from 'express';
import { IDatabaseContext } from './db/IDatabaseContext';
import { ILogger } from './util/ILogger';
import { ConsoleLogger } from './util/ConsoleLogger';

/**
 * Interface to define app functionality.
 */
interface IApp {
    initializeServices(): void;
    start(): void;
};

class App implements IApp {
    private server: Express;
    private logger: ILogger;

    constructor() {
        this.server = express();
        this.logger = new ConsoleLogger();
    }

    public initializeServices(): void {
        
    }

    public start(): void {
        const port = 3000;
        this.server.listen(port, () => {
            this.logger.info(`Express is listening at http://localhost:${port}`);
        });
    }
};


const app = new App();
app.start();

