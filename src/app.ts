import { Express } from 'express';
import { ILogger } from './util/ILogger';
import { ConsoleLogger } from './util/ConsoleLogger';
import { AppBuilder } from './AppBuilder';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Interface to define app functionality.
 */
export interface IApp {
    start(): void;
};

export class App implements IApp {
    private server: Express;
    private logger: ILogger;

    /**
     * Constructor for making an app.
     * @param builder AppBuilder used to build the instance.
     */
    constructor(builder: AppBuilder) {
        this.server = builder.getServer();
        this.logger = builder.getLogger();
    }

    /**
     * Function for starting the app.
     */
    public start(): void {
        const port = process.env.SERVER_PORT;
        this.server.listen(port, () => {
            this.logger.info(`Express is listening at http://localhost:${port}`);
        });
    }
};


const app = new AppBuilder()
    .withLogger(new ConsoleLogger)
    .withMiddleware()
    .withDatabase()
    .withAuth()
    .withController()
    .build();

app.start();

