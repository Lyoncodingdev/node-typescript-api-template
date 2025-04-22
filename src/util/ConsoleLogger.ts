import { ILogger } from "./ILogger";


export class ConsoleLogger implements ILogger {
    info(message: string) {
        console.log(`INFO: ${message}`);
    };

    warning(message: string): void {
        console.log(`INFO: ${message}`);
    };

    error(message: string): void {
        console.log(`INFO: ${message}`);
    };
};