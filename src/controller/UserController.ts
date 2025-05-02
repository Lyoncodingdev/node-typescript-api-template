import { JsonController, Get, Param } from 'routing-controllers';

@JsonController('/users')
export class UserController {
    
    @Get('/:id')
    getUser(@Param('id') id: number) {
        return { id, name: 'John Doe' };
    }
}