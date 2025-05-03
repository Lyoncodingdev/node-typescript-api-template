import { Token } from 'typedi';
export interface ILogger {
    info(message: string): void;
    warning(message: string): void;
    error(message: string): void;
}

export const LoggerToken = new Token<ILogger>('ILogger');