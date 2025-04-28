import { User } from "../../generated/prisma";
import { UserRequest } from "../../src/model/UserRequest";
import { UserService } from "../../src/service/UserService";
import { ILogger } from "../../src/util/ILogger";

describe('UserService', () => {
    let userService: UserService;
    const mockUserRepo = {
        findByEmail: jest.fn(),
        createUser: jest.fn(),
        deleteUser: jest.fn()
    };

    const mockLogger = {
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn()
    }

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();

        userService = new UserService(mockUserRepo as any, mockLogger as any);
    });

    it('GetUserValidEmail', async () => {
        // Make the fake user
        const fakeUser: User = {
            id: 1,
            name: 'John',
            email: 'john@example.com',
        }
        const expectedUserDTO = UserRequest.fromUser(fakeUser);
        mockUserRepo.findByEmail.mockResolvedValue(fakeUser);

        var actualUser = await userService.getUserByEmail(fakeUser.email);
        expect(actualUser).toEqual(expectedUserDTO);
        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(fakeUser.email);
    })

    it('GetUserNoEmail', async () => {
        const emptyUserDTO = UserRequest.emptyUser();
        var actualUser = await userService.getUserByEmail("NoEmail");
        expect(actualUser).toEqual(emptyUserDTO);
        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("NoEmail");
    })

    it('CreateValidUser', async () => {
        var userDTO = new UserRequest(-1, "James", "White");
        
    })
});