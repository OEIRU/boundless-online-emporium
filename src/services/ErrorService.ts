
type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

type ErrorDetails = {
  message: string;
  code?: string | number;
  stack?: string;
  context?: Record<string, any>;
};

class ErrorService {
  private errorHandlers: ((error: ErrorDetails, level: ErrorLevel) => void)[] = [];

  /**
   * Handle an error
   * @param error Error or error details
   * @param level Error severity level
   * @param context Additional error context
   */
  handleError(error: Error | ErrorDetails, level: ErrorLevel = 'error', context?: Record<string, any>): void {
    let errorDetails: ErrorDetails;

    if (error instanceof Error) {
      errorDetails = {
        message: error.message,
        stack: error.stack,
        context
      };
    } else {
      errorDetails = {
        ...error,
        context: {...(error.context || {}), ...(context || {})}
      };
    }

    // Call all registered error handlers
    this.errorHandlers.forEach(handler => {
      try {
        handler(errorDetails, level);
      } catch (e) {
        console.error('Error in error handler:', e);
      }
    });

    // Always log to console
    this.logToConsole(errorDetails, level);
  }

  /**
   * Add an error handler
   * @param handler Error handler function
   */
  addErrorHandler(handler: (error: ErrorDetails, level: ErrorLevel) => void): void {
    this.errorHandlers.push(handler);
  }

  /**
   * Remove an error handler
   * @param handler Error handler function to remove
   */
  removeErrorHandler(handler: (error: ErrorDetails, level: ErrorLevel) => void): void {
    this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
  }

  /**
   * Log error to console
   * @param error Error details
   * @param level Error severity level
   */
  private logToConsole(error: ErrorDetails, level: ErrorLevel): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'info':
        console.info(`${prefix} ${error.message}`, error);
        break;
      case 'warning':
        console.warn(`${prefix} ${error.message}`, error);
        break;
      case 'error':
      case 'critical':
        console.error(`${prefix} ${error.message}`, error);
        break;
    }
  }
}

// Export a single instance for use throughout the application
export const errorService = new ErrorService();
