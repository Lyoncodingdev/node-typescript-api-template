import express, { Express } from 'express';
import { IDatabaseContext } from './db/IDatabaseContext';
import { ILogger } from './util/ILogger';
import { ConsoleLogger } from './util/ConsoleLogger';
import rateLimit from 'express-rate-limit';

/**
 * Interface to define app functionality.
 */
interface IApp {
    start(): void;
};

class App implements IApp {
    private server: Express;
    private logger: ILogger;

    constructor() {
        this.server = express();
        this.logger = new ConsoleLogger();
    }

    private configureMiddlewear(): void {

        // Limit the request sizes
        this.server.use(express.json({limit: '1mb'}));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
            message: 'Too many requests from this IP, please try again after 15 minutes'
        });
        this.server.use(limiter);

        // Remove certain headers
        this.server.disable('x-powered-by');

        // Add logging to each request.
    }

    private initializeServices(): void {
        this.logger.info("Services initialized.")
    }

    public start(): void {
        const port = 3000;
        this.configureMiddlewear();
        this.initializeServices();

        this.server.listen(port, () => {
            this.logger.info(`Express is listening at http://localhost:${port}`);
        });
    }
};


const app = new App();
app.start();

