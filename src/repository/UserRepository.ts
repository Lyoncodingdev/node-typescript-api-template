import { User } from "../../generated/prisma";
import { BaseRepository } from "./BaseRepository";

/**
 * Class for accessing users from the database.
 */
export class UserRepository extends BaseRepository {
    async findByEmail(email: string): Promise<User | null> {
        return this.dbConnection.getConnection().user.findUnique({
            where: { email },
        });
    }

    async createUser(name: string, email: string): Promise<User> {
        return this.dbConnection.getConnection().user.create({
            data: { name, email },
        });
    }

    async deleteUser(userId: number): Promise<void> {
        await this.dbConnection.getConnection().user.delete({
            where: { id: userId },
        });
    }
}
