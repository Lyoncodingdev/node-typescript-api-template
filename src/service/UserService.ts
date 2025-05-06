import { UserRequest } from "../model/UserRequest";
import { UserRepository } from "../repository/UserRepository";
import { ILogger, LoggerToken } from "../util/ILogger";
import { Inject, Service } from 'typedi';

/**
 * Class for interacting with users.
 */
@Service()
export class UserService {
    
    /**
     * Constructor
     * @param userRepo User repository object to use.
     * @param logger Logger to use.
     */
    constructor(
        @Inject(LoggerToken) private logger: ILogger,
        @Inject(() => UserRepository) private userRepo: UserRepository
    ){
    }

    /**
     * Gets a user by the email.
     * @param email The email for the user.
     * @returns User with the correspoinding email.
     */
    async findUserById(id: string): Promise<UserRequest> {
        var user = await this.userRepo.findById(id);
        if (user){
            this.logger.info(`User found ${user.id}`);
            return UserRequest.fromUser(user);
        }
        this.logger.info("User was not found, returning an empty user.");
        return UserRequest.emptyUser();
    }

    /**
     * Function to create a new user.
     * @param user The new user to create.
     * @returns The created user.
     */
    async createUser(user: UserRequest){
        let newUser = user.toUser();
        var createdUser = await this.userRepo.createUser(newUser);
        if (createdUser){
            return UserRequest.fromUser(createdUser);
        }

        this.logger.error("User could not be created.")
        return UserRequest.emptyUser();
    };
};