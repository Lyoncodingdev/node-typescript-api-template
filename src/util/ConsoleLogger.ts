import { ILogger } from "./ILogger";

/**
 * Logger for logging to the console.
 */
export class ConsoleLogger implements ILogger {

    /**
     * Logs an info message to the console.
     * @param message Message to log.
     */
    info(message: string) {
        let time: string = new Date().toISOString();
        console.log(`${time} - INFO: ${message}`);
    };

    /**
     * Logs a warning to the console.
     * @param message Message to log.
     */
    warning(message: string): void {
        let time: string = new Date().toISOString();
        console.warn(`${time} - WARN: ${message}`);
    };

    /**
     * Logs an error to the console.
     * @param message Message to log.
     */
    error(message: string): void {
        let time: string = new Date().toISOString();
        console.error(`${time} - ERROR: ${message}`);
    };
};