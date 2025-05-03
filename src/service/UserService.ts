import { UserRequest } from "../model/UserRequest";
import { UserRepository } from "../repository/UserRepository";
import { ILogger } from "../util/ILogger";

/**
 * Class for interacting with users.
 */
export class UserService {
    /**
     * User repository for data access.
     */
    userRepo: UserRepository;

    /**
     * Logger for logging.
     */
    logger: ILogger;

    /**
     * Constructor
     * @param userRepo User repository object to use.
     * @param logger Logger to use.
     */
    constructor(userRepo: UserRepository, logger: ILogger){
        this.userRepo = userRepo;
        this.logger = logger;
    }

    /**
     * Gets a user by the email.
     * @param email The email for the user.
     * @returns User with the correspoinding email.
     */
    async getUserByEmail(email: string): Promise<UserRequest> {
        var user = await this.userRepo.findByEmail(email);
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