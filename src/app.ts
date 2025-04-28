import express, { Express } from 'express';
import { IDatabaseConnection } from './db/IDatabaseConnection';
import { ILogger } from './util/ILogger';
import { ConsoleLogger } from './util/ConsoleLogger';
import rateLimit from 'express-rate-limit';
import { DatabaseConnection } from './db/DatabaseConnection';
import { UserService } from './service/UserService';
import { UserRepository } from './repository/UserRepository';

/**
 * Interface to define app functionality.
 */
interface IApp {
    start(): void;
};

class App implements IApp {
    private server: Express;
    private logger: ILogger;
    private databaseConnection: IDatabaseConnection;
    private userRepo: UserRepository;
    private userService: UserService;
    constructor() {
        this.server = express();
        this.logger = new ConsoleLogger();
        this.databaseConnection = new DatabaseConnection(this.logger);
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

    private initializeRepos(): void {
        this.databaseConnection.testConnection();
        this.userRepo = new UserRepository(this.databaseConnection, this.logger);

    }

    private initializeServices(): void {
        this.databaseConnection.testConnection();
        this.logger.info("Services initialized.");
        this.userService = new UserService(this.userRepo, this.logger);
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

