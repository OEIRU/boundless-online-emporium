
type CacheItem<T> = {
  data: T;
  expiry: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 минут по умолчанию

  /**
   * Получить данные из кэша
   * @param key Ключ кэша
   * @returns Данные из кэша или null, если данные отсутствуют или устарели
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Проверяем, не устарели ли данные
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * Сохранить данные в кэш
   * @param key Ключ кэша
   * @param data Данные для сохранения
   * @param ttl Время жизни в миллисекундах (по умолчанию 5 минут)
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  /**
   * Удалить данные из кэша
   * @param key Ключ кэша
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Очистить весь кэш
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Установить время жизни по умолчанию для всех кэшированных данных
   * @param ttl Время жизни в миллисекундах
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}

// Экспортируем один экземпляр для использования во всем приложении
export const cacheService = new CacheService();
