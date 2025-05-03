// AppBuilder.ts
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import { App } from './app';
import 'reflect-metadata';
import { useExpressServer, useContainer as rcUseContainer } from 'routing-controllers';

import { IDatabaseConnection } from './db/IDatabaseConnection';
import { DatabaseConnection } from './db/DatabaseConnection';
import { ILogger, LoggerToken } from './util/ILogger';

import { UserRepository } from './repository/UserRepository';
import { UserService } from './service/UserService';

import { UserController } from './controller/UserController';

import { Container } from 'typedi';

export class AppBuilder {
    private server: Express;
    private logger?: ILogger;

    constructor() {
        this.server = express();
    }

    /**
     * Inject your own logger implementation.
     */
    public withLogger(logger: ILogger): AppBuilder {
        this.logger = logger;
        Container.set(LoggerToken, logger);
        return this;
    }

    /**
     * Adds database to the application.
     * @returns this
     */
    public withDatabase(): AppBuilder {
        this.logger.info("Generating database connection.");
        Container.set(DatabaseConnection, new DatabaseConnection(this.logger));
        return this;
    }

    /**
     * Adds user repo to the application.
     * @returns this
     */
    public withUserRepository(): AppBuilder {
        let db = Container.get(DatabaseConnection);
        if (!db){
            this.logger.error("Could not find database connection.");
        }
        Container.set(UserRepository, new UserRepository(db, this.logger));
        this.logger.info("Generated repositories.");
        return this;
    }

    /**
     * Adds user service to the application.
     * @returns this
     */
    public withUserService(): AppBuilder {
        let userRepo = Container.get(UserRepository);
        if (!userRepo) {
            this.logger.error("withUserService() called before withUserRepository()");
        }
        Container.set(UserService, new UserService(userRepo, this.logger))
        this.logger.info("Generated services.");
        return this;
    }

    /**
     * Adds middlewear to the app.
     * @returns this
     */
    public withMiddleware(): AppBuilder {
        if (!this.logger){
            throw new Error("Trying to generate middlewear without logging functionality.");
        }

        this.logger.info("Attaching middlewear.");
        this.server.use(express.json({ limit: '1mb' }));
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
        this.logger.info("Attaching controllers.")
        rcUseContainer(Container);
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
        return Container.get(DatabaseConnection);
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
        this.logger.info("Building App.");
        this.getDatabase().testConnection();
        return new App(this)
    }
}
