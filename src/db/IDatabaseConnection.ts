import { PrismaClient } from '@prisma/client';

/**
 * Interface to define public facing functionality for the Database connection.
 */
export interface IDatabaseConnection {
    initializeConnection(): void;
    testConnection(): Promise<boolean>;
    getConnection(): PrismaClient;
}