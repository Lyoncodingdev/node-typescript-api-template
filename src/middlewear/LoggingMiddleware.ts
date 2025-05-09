import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { ILogger, LoggerToken } from '../util/ILogger';
import { Inject } from 'typedi';

/**
 * Class for logging requests through middleware.
 */
@Service()
export class LoggingMiddleware implements ExpressMiddlewareInterface {
    constructor(@Inject(LoggerToken) private logger: ILogger) { }

    /**
     * Logs request information coming into and going out of the server.
     * @param request The incoming request.
     * @param response The outgoing response.
     * @param next The next thing to continue to.
     */
    async use(request: Request, response: Response, next: NextFunction): Promise<void> {
        const requestId = Math.random().toString(36).substring(2, 15);
        const startTime = Date.now();
        
        response.setHeader('X-Request-ID', requestId);
        (request as any).requestId = requestId;
        this.logger.info(`Request [${requestId}] ${request.method} ${request.originalUrl} | IP: ${request.ip} | User-Agent: ${request.get('user-agent')} | Body: ${JSON.stringify(this.sanitizeBody(request.body))} | Query: ${JSON.stringify(request.query)}`);


        const originalSend = response.send;
        response.send = function(body) {
            (response as any).responseBody = body;
            return originalSend.call(this, body);
        };

        response.on('finish', () => {
            const duration = Date.now() - startTime;
            const userId = (request as any).user?.id || 'unauthenticated';
            this.logger.info(`Response [${requestId}] ${request.method} ${request.originalUrl} | Status: ${response.statusCode} | Duration: ${duration}ms | User: ${userId}`);
        });

        next();
    }

    /**
     * Removes any fields that should not be sent back to client.
     * @param body the body to sanatize.
     * @returns Sanatized body.
     */
    private sanitizeBody(body: any): any {
        if (!body) return {};
        
        const sanitized = { ...body };
        
        // List of fields to sanitize
        const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'key', 'apiKey', 'api_key'];
        
        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        }
        
        return sanitized;
    }
}