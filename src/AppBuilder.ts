// AppBuilder.ts
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import { App } from './app';
import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';

import { IDatabaseConnection } from './db/IDatabaseConnection';
import { DatabaseConnection } from './db/DatabaseConnection';
import { ILogger } from './util/ILogger';

import { UserRepository } from './repository/UserRepository';
import { UserService } from './service/UserService';

import { UserController } from './controller/UserController';

export class AppBuilder {
    private server: Express;
    private logger?: ILogger;
    private db?: IDatabaseConnection;
    private userRepo?: UserRepository;
    private userService?: UserService;

    constructor() {
        this.server = express();
    }

    /**
     * Inject your own logger implementation.
     */
    public withLogger(logger: ILogger): AppBuilder {
        this.logger = logger;
        return this;
    }

    /**
     * Adds database to the application.
     * @returns this
     */
    public withDatabase(): AppBuilder {
        if (!this.logger) {
            throw new Error("withDatabase() called before withLogger()");
        }
        this.db = new DatabaseConnection(this.logger);
        return this;
    }

    /**
     * Adds user repo to the application.
     * @returns this
     */
    public withUserRepository(): AppBuilder {
        if (!this.db || !this.logger) {
            throw new Error("withUserRepository() called before withDatabase()");
        }
        this.userRepo = new UserRepository(this.db, this.logger);
        return this;
    }

    /**
     * Adds user service to the application.
     * @returns this
     */
    public withUserService(): AppBuilder {
        if (!this.userRepo || !this.logger) {
            throw new Error("withUserService() called before withUserRepository()");
        }
        this.userService = new UserService(this.userRepo, this.logger);
        return this;
    }

    /**
     * Adds middlewear to the app.
     * @returns this
     */
    public withMiddleware(): AppBuilder {
        // JSON body limit
        this.server.use(express.json({ limit: '1mb' }));
        // basic rate-limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
            message: 'Too many requests, try again later',
        });
        this.server.use(limiter);
        // hide Express header
        this.server.disable('x-powered-by');
        return this;
    }

    /**
     * Maps the controllers to the server.
     * @returns this.
     */
    public withController(): AppBuilder {
        useExpressServer(this.server, {
            controllers: [UserController],
        });
        return this;
    }

    /**
     * Getter for builder logger.
     * @returns the logger
     */
    public getLogger(): ILogger {
        return this.logger;
    }

    /**
     * Getter for the database.
     * @returns builder database.
     */
    public getDatabase(): IDatabaseConnection {
        return this.db;
    }

    /**
     * Getter for the server.
     * @returns builder server.
     */
    public getServer(): Express {
        return this.server;
    }

    /**
     * Build function to finally create the App.
     * @returns App
     */
    public build(): App {
        this.db.testConnection();
        return new App(this)
    }
}
