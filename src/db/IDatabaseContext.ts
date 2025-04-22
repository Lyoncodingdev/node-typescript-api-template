import { PrismaClient } from '@prisma/client';

export interface IDatabaseContext {
    initializeConnection(): void;
    testConnection(): Promise<boolean>;
    getConnection(): PrismaClient;
}