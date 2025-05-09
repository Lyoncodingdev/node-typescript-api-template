import 'reflect-metadata';
import { UserController } from '../../src/controller/UserController';
import { ILogger, LoggerToken } from '../../src/util/ILogger';
import { UserService } from '../../src/service/UserService';
import { NotFoundError } from 'routing-controllers';
import { UserRequest } from '../../src/model/UserRequest';

import { v4 as uuid } from 'uuid';

describe('Extended UserController Tests', () => {
    let userController: UserController;
    let loggerMock: ILogger;
    let userServiceMock: UserService;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create mocks
        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            warning: jest.fn()
        } as unknown as ILogger;

        userServiceMock = {
            findUserById: jest.fn(),
            createUser: jest.fn()
        } as unknown as UserService;

        // Create controller with mocks
        userController = new UserController(loggerMock, userServiceMock);
    });

    describe('getUser', () => {
        it('should return user when found', async () => {
            // Arrange
            const userId = '123';
            const mockUser = { id: userId, name: 'Test User', email: 'test@example.com' };
            (userServiceMock.findUserById as jest.Mock).mockResolvedValue(mockUser);

            // Act
            const result = await userController.getUser(userId);

            // Assert
            expect(result).toEqual(mockUser);
            expect(loggerMock.info).toHaveBeenCalledWith('Request to get user by id.');
            expect(userServiceMock.findUserById).toHaveBeenCalledWith(userId);
        });

        it('should throw NotFoundError when user not found', async () => {
            // Arrange
            const userId = '999';
            (userServiceMock.findUserById as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(userController.getUser(userId)).rejects.toThrow(NotFoundError);
            expect(loggerMock.error).toHaveBeenCalledWith(`User with id ${userId} not found`);
        });
    });

    describe('createUser', () => {
        it('should create and return a new user', async () => {
            // Arrange
            const userData = new UserRequest(uuid(), 'new@example.com', "John");
            (userServiceMock.createUser as jest.Mock).mockResolvedValue(userData);

            // Act
            const result = await userController.createUser(userData);

            // Assert
            expect(result).toEqual(userData);
            expect(loggerMock.info).toHaveBeenCalledWith('Request to create user.');
            expect(userServiceMock.createUser).toHaveBeenCalledWith(userData);
        });

        it('should handle errors during user creation', async () => {
            // Arrange
            const userData = new UserRequest(uuid(), "bad@example.com", "badUser")
            const error = new Error('Email already exists');
            (userServiceMock.createUser as jest.Mock).mockRejectedValue(error);

            // Act & Assert
            await expect(userController.createUser(userData)).rejects.toThrow('Email already exists');
            expect(loggerMock.error).toHaveBeenCalledWith(`Failed to create user: Email already exists`);
        });
    });
});