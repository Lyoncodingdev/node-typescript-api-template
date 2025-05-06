import { JsonController, Get, Param, Post, Body, NotFoundError } from 'routing-controllers';
import { ILogger, LoggerToken } from '../util/ILogger';
import { Inject, Service } from 'typedi';
import { UserService } from '../service/UserService';
import { UserRequest } from '../model/UserRequest';

@Service()
@JsonController('/users')
export class UserController {
    constructor(
        @Inject(LoggerToken) private logger: ILogger,
        @Inject(() => UserService) private userService: UserService
    ) { }

    @Get('/:id')
    async getUser(@Param('id') id: string) {
        this.logger.info("Request to get user by id.");
        const user = await this.userService.findUserById(id);

        if (!user) {
            this.logger.error(`User with id ${id} not found`);
            throw new NotFoundError(`User with id ${id} not found`);
        }

        return user;
    }

    @Post('/')
    async createUser(@Body() userData: UserRequest) {
        this.logger.info("Request to create user.");
        try {
            const newUser = await this.userService.createUser(userData);
            return newUser;
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);
            throw error;
        }
    }
}