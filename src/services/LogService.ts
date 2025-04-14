
type LogLevel = 'debug' | 'info' | 'warning' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class LogService {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private logHandlers: ((entry: LogEntry) => void)[] = [];
  private minLevel: LogLevel = 'info'; // По умолчанию логируем info и выше

  /**
   * Добавить запись в лог
   * @param level Уровень лога
   * @param message Сообщение
   * @param data Дополнительные данные
   */
  log(level: LogLevel, message: string, data?: any): void {
    // Проверяем, должен ли лог этого уровня быть записан
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const entry: LogEntry = { timestamp, level, message, data };

    // Добавляем в массив логов
    this.logs.push(entry);

    // Проверяем, не превышен ли максимальный размер
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Удаляем самый старый лог
    }

    // Вызываем все обработчики
    this.logHandlers.forEach(handler => {
      try {
        handler(entry);
      } catch (e) {
        console.error('Error in log handler:', e);
      }
    });

    // Всегда выводим в консоль
    this.logToConsole(entry);
  }

  /**
   * Логирование с уровнем debug
   * @param message Сообщение
   * @param data Дополнительные данные
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Логирование с уровнем info
   * @param message Сообщение
   * @param data Дополнительные данные
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Логирование с уровнем warning
   * @param message Сообщение
   * @param data Дополнительные данные
   */
  warning(message: string, data?: any): void {
    this.log('warning', message, data);
  }

  /**
   * Логирование с уровнем error
   * @param message Сообщение
   * @param data Дополнительные данные
   */
  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  /**
   * Получить все записи логов
   * @returns Массив записей логов
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Очистить все логи
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Установить максимальное количество хранимых логов
   * @param maxLogs Максимальное количество логов
   */
  setMaxLogs(maxLogs: number): void {
    this.maxLogs = maxLogs;
    
    // Сразу обрезаем лишние логи, если нужно
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Установить минимальный уровень логирования
   * @param level Минимальный уровень логирования
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Добавить обработчик логов
   * @param handler Функция-обработчик логов
   */
  addLogHandler(handler: (entry: LogEntry) => void): void {
    this.logHandlers.push(handler);
  }

  /**
   * Удалить обработчик логов
   * @param handler Функция-обработчик логов для удаления
   */
  removeLogHandler(handler: (entry: LogEntry) => void): void {
    this.logHandlers = this.logHandlers.filter(h => h !== handler);
  }

  /**
   * Проверить, должен ли лог данного уровня быть записан
   * @param level Уровень лога
   * @returns true, если лог должен быть записан
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warning', 'error'];
    const minLevelIndex = levels.indexOf(this.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= minLevelIndex;
  }

  /**
   * Вывести лог в консоль
   * @param entry Запись лога
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(`${prefix} ${entry.message}`, entry.data);
        break;
      case 'info':
        console.info(`${prefix} ${entry.message}`, entry.data);
        break;
      case 'warning':
        console.warn(`${prefix} ${entry.message}`, entry.data);
        break;
      case 'error':
        console.error(`${prefix} ${entry.message}`, entry.data);
        break;
    }
  }
}

// Экспортируем один экземпляр для использования во всем приложении
export const logService = new LogService();
