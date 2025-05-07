import { User } from "../../generated/prisma";
import { UserRequest } from "../../src/model/UserRequest";
import { UserRepository } from "../../src/repository/UserRepository";
import { UserService } from "../../src/service/UserService";
import { ILogger, LoggerToken } from '../../src/util/ILogger';
import { Container } from 'typedi';

describe('UserService', () => {
    let userService: UserService;
    let loggerMock: ILogger;
    let mockUserRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        Container.reset();

        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
            warning: jest.fn(),
        } as unknown as ILogger;

        mockUserRepo = {
            findById: jest.fn(),
            createUser: jest.fn(),
            deleteUser: jest.fn()
        } as unknown as jest.Mocked<UserRepository>;

        Container.set(LoggerToken, loggerMock);
        Container.set(UserRepository, mockUserRepo);

        userService = Container.get(UserService);
    });

    it('GetUserValidEmail', async () => {
        // Make the fake user
        const fakeUser: User = {
            id: "fakeID",
            name: 'John',
            email: 'john@example.com',
        }
        const expectedUserDTO = UserRequest.fromUser(fakeUser);
        mockUserRepo.findById.mockResolvedValue(fakeUser);

        var actualUser = await userService.findUserById(fakeUser.email);
        expect(actualUser).toEqual(expectedUserDTO);
        expect(mockUserRepo.findById).toHaveBeenCalledWith(fakeUser.email);
    })

    it('GetUserNoEmail', async () => {
        const emptyUserDTO = UserRequest.emptyUser();
        var actualUser = await userService.findUserById("NoEmail");
        expect(actualUser).toEqual(emptyUserDTO);
        expect(mockUserRepo.findById).toHaveBeenCalledWith("NoEmail");
    })
});