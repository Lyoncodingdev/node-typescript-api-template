import { IDatabaseConnection } from "../db/IDatabaseConnection";
import { UserRequest } from "../model/UserRequest";
import { UserRepository } from "../repository/UserRepository";
import { ILogger } from "../util/ILogger";


export class UserService {
    userRepo: UserRepository;
    logger: ILogger;

    constructor(dbConnection: IDatabaseConnection, logger: ILogger){
        this.userRepo = new UserRepository(dbConnection, logger);
        this.logger = logger;
    }

    async getUserByEmail(email: string): Promise<UserRequest> {
        var user = await this.userRepo.findByEmail(email);
        if (user){
            return UserRequest.fromUser(user);
        } else {
            return new UserRequest(-1, "", "");
        }
    }

    async createUser(user: UserRequest){
        var newUser = await this.userRepo.createUser(user.name, user.email);
        if (newUser){
            return UserRequest.fromUser(newUser);
        }
    };
};