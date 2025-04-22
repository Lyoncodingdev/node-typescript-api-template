import { PrismaClient } from '@prisma/client';
import { IDatabaseContext } from './IDatabaseContext';
import { ILogger } from '../util/ILogger';

export class DatabaseContext implements IDatabaseContext {
    private prisma: PrismaClient;
    private logger: ILogger;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Initializes the database connection.
     */
    initializeConnection(): void {
        this.logger.info('Prisma client initialized.');
    }

    /**
     * Tests the connection to the database.
     * @returns True or false depending on if connection was success.
     */
    async testConnection(): Promise<boolean> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (e) {
            console.error('Failed to connect:', e);
            return false;
        }
    }

    /**
     * Returns the database connection client.
     * @returns The prisma client.
     */
    getConnection(): PrismaClient {
        return this.prisma;
    }
}