// tests/repositories/UserRepository.test.ts
import { UserRepository } from '../../src/repository/UserRepository';
import { PrismaClient } from '@prisma/client';
import { User } from '../../generated/prisma';



describe('UserRepository', () => {
    let repo: UserRepository;
    
    /**
     * Mocks the prisma functionality.
     */
    const mockPrisma = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        },
    } as unknown as PrismaClient;

    const mockLogger = {
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn()
    }
    
    /**
     * Mocks the database getConnection.
     */
    const mockDbContext = {
        getConnection: () => mockPrisma,
    };

    beforeEach(() => {
        repo = new UserRepository(mockDbContext as any, mockLogger as any);
    });

    it('should find a user by email', async () => {
        const fakeUser: User = {
            id: "newUser",
            name: 'John',
            email: 'john@example.com',
        };

        mockPrisma.user.findUnique = jest.fn().mockResolvedValue(fakeUser);

        const result = await repo.findByEmail('john@example.com');
        expect(result).toEqual(fakeUser);
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'john@example.com' },
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
});
