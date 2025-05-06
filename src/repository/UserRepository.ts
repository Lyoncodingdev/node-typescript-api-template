import { User } from "../../generated/prisma";
import { Inject, Service } from 'typedi';
import { ILogger, LoggerToken } from "../util/ILogger";
import { DatabaseConnection } from "../db/DatabaseConnection";
import { IDatabaseConnection } from "../db/IDatabaseConnection";

/**
 * Class for accessing users from the database.
 */
@Service()
export class UserRepository {

    constructor(
        @Inject(LoggerToken) private logger: ILogger,
        @Inject(() => DatabaseConnection) private dbConnection: IDatabaseConnection
    ) {}

    /**
     * Finds a user by their email.
     * @param id The email to search for.
     * @returns The user if found.
     */
    async findById(id: string): Promise<User> {
        return this.dbConnection.getConnection().user.findUnique({
            where: { id },
        });
    }

    /**
     * Creates a new user.
     * @param user The user object to add to the database.
     * @returns the new user from the database.
     */
    async createUser(user: User): Promise<User> {
        try {
            return await this.dbConnection.getConnection().user.create({data: user});
        } catch (e) {
            this.logger.error(`Could not create new user: ${e.message}`);
            return null;
        } 
    }

    async updateUser(user: User): Promise<boolean> {
        try {
            await this.dbConnection.getConnection().user.update({
                where: {id: user.id},
                data: {
                    email: user.email,
                    name: user.name,
                },
            });
            this.logger.info(`Updated user with ID ${user.id}`);
            return true;
        } catch (e) {
            this.logger.error(`Error when trying to update user ${user.id}: ${e.message}`)
            return false;
        }
    }

    /**
     * Deletes a user from the database.
     * @param userId The user ID to delete.
     */
    async deleteUser(userId: string): Promise<boolean> {
        try {
            await this.dbConnection.getConnection().user.delete({
                where: { id: userId },
            });
            this.logger.info(`Deleted user with user ID ${userId}`);
            return true;
        } catch (e) {
            this.logger.error(`Could not delete user with user ID: ${userId}`);
            return false;
        }
        
    }
}
