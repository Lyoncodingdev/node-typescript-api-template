import { UseBefore } from 'routing-controllers';
import { AuthMiddleware } from '../../middlewear/AuthMiddleware';

/**
 * Custom decorator for applying logging middleware.
 * @returns Decorator function that applies LoggingMiddleware
 */
export function Authenticated(): ClassDecorator & MethodDecorator {
    return UseBefore(AuthMiddleware) as ClassDecorator & MethodDecorator;
}