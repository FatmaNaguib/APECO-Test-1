/**
 * Centralized Enterprise Logger
 * Provides structured, timestamped console logs for test execution, steps, and errors.
 */
export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  static step(stepNumber: number | string, description: string): void {
    console.log(this.formatMessage('STEP', `(${stepNumber}) ${description}`));
  }

  static warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }

  static error(message: string, error?: unknown): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error(error);
    }
  }

  static debug(message: string): void {
    if (process.env.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }
}
