import { User } from "../../generated/prisma";
import { DatabaseContext } from "../db/DatabaseContext";

/**
 * Class for accessing users from the database.
 */
export class UserRepository {
    constructor(private dbContext: DatabaseContext) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.dbContext.getConnection().user.findUnique({
            where: { email },
        });
    }

    async createUser(name: string, email: string): Promise<User> {
        return this.dbContext.getConnection().user.create({
            data: { name, email },
        });
    }

    async deleteUser(userId: number): Promise<void> {
        await this.dbContext.getConnection().user.delete({
            where: { id: userId },
        });
    }
}
