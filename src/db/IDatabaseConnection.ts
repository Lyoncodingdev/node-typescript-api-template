import { PrismaClient } from '@prisma/client';

/**
 * Interface to define public facing functionality for the Database connection.
 */
export interface IDatabaseConnection {
    testConnection(): Promise<boolean>;
    getConnection(): PrismaClient;
}