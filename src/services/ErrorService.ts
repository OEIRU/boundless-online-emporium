
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
   * Обработать ошибку
   * @param error Ошибка или детали ошибки
   * @param level Уровень серьезности ошибки
   * @param context Дополнительный контекст ошибки
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

    // Вызываем все зарегистрированные обработчики ошибок
    this.errorHandlers.forEach(handler => {
      try {
        handler(errorDetails, level);
      } catch (e) {
        console.error('Error in error handler:', e);
      }
    });

    // Всегда логируем в консоль
    this.logToConsole(errorDetails, level);
  }

  /**
   * Добавить обработчик ошибок
   * @param handler Функция-обработчик ошибок
   */
  addErrorHandler(handler: (error: ErrorDetails, level: ErrorLevel) => void): void {
    this.errorHandlers.push(handler);
  }

  /**
   * Удалить обработчик ошибок
   * @param handler Функция-обработчик ошибок для удаления
   */
  removeErrorHandler(handler: (error: ErrorDetails, level: ErrorLevel) => void): void {
    this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
  }

  /**
   * Логировать ошибку в консоль
   * @param error Детали ошибки
   * @param level Уровень серьезности ошибки
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

// Экспортируем один экземпляр для использования во всем приложении
export const errorService = new ErrorService();
