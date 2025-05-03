import { JsonController, Get, Param } from 'routing-controllers';
import { ILogger, LoggerToken } from '../util/ILogger';
import { Inject, Service } from 'typedi';
import { UserService } from '../service/UserService';

@Service()
@JsonController('/users')
export class UserController {
    constructor(
        @Inject(LoggerToken) private logger: ILogger,
        @Inject(() => UserService) private userService: UserService
    ) {}

    @Get('/:id')
    getUser(@Param('id') id: string) {
        this.logger.info("Request to get.");
        return { id, name: 'John Doe' };
    }
}