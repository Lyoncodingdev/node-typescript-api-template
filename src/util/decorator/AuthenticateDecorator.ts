import { UseBefore } from 'routing-controllers';
import { AuthMiddleware } from '../../middlewear/AuthMiddleware';

/**
 * Custom decorator for applying authentication middleware.
 * @returns Decorator function that applies AuthMiddleware.
 */
export function Authenticated(): ClassDecorator & MethodDecorator {
    return UseBefore(AuthMiddleware) as ClassDecorator & MethodDecorator;
}