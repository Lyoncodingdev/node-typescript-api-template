// tests/repositories/UserRepository.test.ts
import 'reflect-metadata'; // Add this import to make TypeDI work
import { UserRepository } from '../../src/repository/UserRepository';
import { PrismaClient } from '@prisma/client';
import { User } from '../../generated/prisma';
import { ILogger, LoggerToken } from '../../src/util/ILogger';
import { DatabaseConnection } from '../../src/db/DatabaseConnection';
import { Container } from 'typedi';

describe('UserRepository', () => {
    let repo: UserRepository;
    let loggerMock: ILogger;
    let mockPrisma: PrismaClient; 
    let mockDbContext: DatabaseConnection;

    beforeEach(() => {
        // Reset container to ensure clean state
        Container.reset();

        // Create mocks
        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
            warning: jest.fn(),
        } as unknown as ILogger;

        mockPrisma = {
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        } as unknown as PrismaClient;

        mockDbContext = {
            getConnection: jest.fn().mockReturnValue(mockPrisma),
            testConnection: jest.fn().mockResolvedValue(true)
        } as unknown as DatabaseConnection;

        // Set up the container - this is key to making dependency injection work in tests
        Container.set(LoggerToken, loggerMock);
        Container.set(DatabaseConnection, mockDbContext);
        
        // Create repository either directly or from container
        repo = Container.get(UserRepository);
    });

    it('should have proper mocks set up', () => {
        expect(typeof repo['logger'].error).toBe('function');
        expect(typeof repo['logger'].info).toBe('function');
        expect(typeof repo['logger'].warning).toBe('function');
        expect(typeof repo['dbConnection'].getConnection).toBe('function');
        const connection = repo['dbConnection'].getConnection();
        expect(connection).toBe(mockPrisma);
    });

    it('should find a user by id', async () => {
        const fakeUser: User = {
            id: "newUser",
            name: 'John',
            email: 'john@example.com',
        };

        mockPrisma.user.findUnique = jest.fn().mockResolvedValue(fakeUser);

        const result = await repo.findById('newUser');
        
        expect(result).toEqual(fakeUser);
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 'newUser' },
        });
    });

    it('should create a user', async () => {
        const fakeUser: User = {
            id: "newUser",
            name: 'Jane',
            email: 'jane@example.com',
        };

        mockPrisma.user.create = jest.fn().mockResolvedValue(fakeUser);
        
        const result = await repo.createUser(fakeUser);
        
        expect(result).toEqual(fakeUser);
        expect(mockPrisma.user.create).toHaveBeenCalledWith({
            data: fakeUser,
        });
    });
    
    it('should handle errors when creating a user', async () => {
        const fakeUser: User = {
            id: "newUser",
            name: 'Jane',
            email: 'jane@example.com',
        };
        
        const error = new Error('Database error');
        mockPrisma.user.create = jest.fn().mockRejectedValue(error);
        
        const result = await repo.createUser(fakeUser);
        
        expect(result).toBeNull();
        expect(loggerMock.error).toHaveBeenCalledWith(`Could not create new user: Database error`);
    });
    
    it('should update a user', async () => {
        const fakeUser: User = {
            id: "existingUser",
            name: 'Updated Name',
            email: 'updated@example.com',
        };
        
        mockPrisma.user.update = jest.fn().mockResolvedValue(fakeUser);
        
        const result = await repo.updateUser(fakeUser);
        
        expect(result).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: 'existingUser' },
            data: {
                name: 'Updated Name',
                email: 'updated@example.com',
            },
        });
        expect(loggerMock.info).toHaveBeenCalledWith(`Updated user with ID existingUser`);
    });
    
    it('should handle errors when updating a user', async () => {
        const fakeUser: User = {
            id: "existingUser",
            name: 'Updated Name',
            email: 'updated@example.com',
        };
        
        const error = new Error('Update error');
        mockPrisma.user.update = jest.fn().mockRejectedValue(error);
        
        const result = await repo.updateUser(fakeUser);
        
        expect(result).toBe(false);
        expect(loggerMock.error).toHaveBeenCalledWith(`Error when trying to update user existingUser: Update error`);
    });
    
    it('should delete a user', async () => {
        mockPrisma.user.delete = jest.fn().mockResolvedValue({});
        
        const result = await repo.deleteUser('userId123');
        
        expect(result).toBe(true);
        expect(mockPrisma.user.delete).toHaveBeenCalledWith({
            where: { id: 'userId123' },
        });
        expect(loggerMock.info).toHaveBeenCalledWith(`Deleted user with user ID userId123`);
    });
    
    it('should handle errors when deleting a user', async () => {
        const error = new Error('Delete error');
        mockPrisma.user.delete = jest.fn().mockRejectedValue(error);
        
        const result = await repo.deleteUser('userId123');
        
        expect(result).toBe(false);
        expect(loggerMock.error).toHaveBeenCalledWith(`Could not delete user with user ID: userId123`);
    });
});