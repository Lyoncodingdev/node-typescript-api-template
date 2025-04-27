import { IDatabaseConnection } from "../db/IDatabaseConnection";
import { ILogger } from "../util/ILogger";


export class BaseRepository {
    protected dbConnection: IDatabaseConnection;
    protected logger: ILogger;

    constructor(dbConnection: IDatabaseConnection, logger: ILogger){
        this.dbConnection = dbConnection
        this.logger = logger;
    }
}