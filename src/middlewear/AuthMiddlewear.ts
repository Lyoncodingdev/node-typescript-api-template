import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { ILogger, LoggerToken } from '../util/ILogger';
import { Inject } from 'typedi';
import * as admin from 'firebase-admin';

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
    constructor(@Inject(LoggerToken) private logger: ILogger) { }

    /**
     * Middlewear for authentication. Requests have to be validated through here
     * before they can go further.
     * @param request The request incoming.
     * @param response The response.
     * @param next What to do next.
     * @returns 
     */
    async use(request: Request, response: Response, next: NextFunction): Promise<void> {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.error('Authentication failed: No token provided');
            response.status(401).json({ message: 'Authentication required' });
            return;
        }

        const token = authHeader.split(' ')[1];

        try {
            // Pull the token
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Add user details to request.
            (request as any).user = {
                id: decodedToken.uid,
                email: decodedToken.email,
                emailVerified: decodedToken.email_verified,
            };

            // Log the user trying to access.
            this.logger.info(`User ${decodedToken.uid} authenticated successfully`);
            next();
        } catch (error) {
            this.logger.error(`Authentication failed: ${error.message}`);
            response.status(401).json({ message: 'Invalid authentication token' });
        }
    }
}