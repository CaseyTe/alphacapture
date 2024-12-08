import { AppError } from '../errors';

export class Logger {
  private static prefix = '[AudioCapture]';

  static info(message: string, ...args: any[]) {
    console.info(`${this.prefix} ${message}`, ...args);
  }

  static error(error: Error | AppError, context?: string) {
    const message = error instanceof AppError 
      ? `${error.code}: ${error.message}`
      : error.message;
      
    console.error(
      `${this.prefix} ${context ? `[${context}] ` : ''}${message}`,
      error
    );
  }

  static debug(message: string, ...args: any[]) {
    console.debug(`${this.prefix} ${message}`, ...args);
  }

  static warn(message: string, ...args: any[]) {
    console.warn(`${this.prefix} ${message}`, ...args);
  }
}