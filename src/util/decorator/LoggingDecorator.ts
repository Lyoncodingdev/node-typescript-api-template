import { UseBefore } from 'routing-controllers';
import { LoggingMiddleware } from '../../middlewear/LoggingMiddleware';

/**
 * Custom decorator for applying logging middleware.
 * @returns Decorator function that applies LoggingMiddleware
 */
export function LogRequests(): ClassDecorator & MethodDecorator {
    return UseBefore(LoggingMiddleware) as ClassDecorator & MethodDecorator;
}