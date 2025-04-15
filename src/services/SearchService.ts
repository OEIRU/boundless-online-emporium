
import { errorService } from './ErrorService';
import { CacheService } from './CacheService';

// Определение типа данных для товара
export interface ProductSearchResult {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: {
    _id: string;
    name: string;
  };
}

class SearchService {
  private cacheService: CacheService;
  private cachedSearchResults: Map<string, {timestamp: number, results: ProductSearchResult[]}> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 минут в миллисекундах

  constructor() {
    this.cacheService = new CacheService('search', 5 * 60); // 5 минут в секундах
  }

  /**
   * Поиск товаров по запросу
   * @param query Строка запроса
   * @param filters Объект с фильтрами
   * @returns Промис с результатами поиска
   */
  async searchProducts(query: string, filters: Record<string, any> = {}): Promise<ProductSearchResult[]> {
    try {
      // Формируем ключ кэша на основе запроса и фильтров
      const cacheKey = this.generateCacheKey(query, filters);
      
      // Проверяем кэш
      const cachedResults = this.cacheService.get<ProductSearchResult[]>(cacheKey);
      if (cachedResults) {
        console.log('Returning cached search results for:', query);
        return cachedResults;
      }
      
      // Если в кэше нет, выполняем запрос
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      // Добавляем фильтры в запрос
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await fetch(`/api/products/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при поиске товаров');
      }
      
      const results = await response.json();
      
      // Кэшируем результаты
      this.cacheService.set(cacheKey, results);
      
      return results;
    } catch (error) {
      errorService.handleError(error, 'error', { context: 'SearchService.searchProducts', query });
      return [];
    }
  }
  
  /**
   * Генерирует ключ кэша на основе запроса и фильтров
   */
  private generateCacheKey(query: string, filters: Record<string, any>): string {
    const normalizedQuery = query.trim().toLowerCase();
    const filterString = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}:${value}`)
      .sort()
      .join(',');
    
    return `search_${normalizedQuery}_${filterString}`;
  }
  
  /**
   * Очищает кэш результатов поиска
   */
  clearCache(): void {
    this.cacheService.clear();
  }
  
  /**
   * Получает предложения для автозаполнения
   * @param prefix Начало запроса
   * @returns Промис с предложениями для автозаполнения
   */
  async getAutocompleteSuggestions(prefix: string): Promise<string[]> {
    try {
      if (!prefix || prefix.length < 2) {
        return [];
      }
      
      const cacheKey = `autocomplete_${prefix.trim().toLowerCase()}`;
      
      // Проверяем кэш
      const cachedSuggestions = this.cacheService.get<string[]>(cacheKey);
      if (cachedSuggestions) {
        return cachedSuggestions;
      }
      
      const response = await fetch(`/api/products/autocomplete?q=${encodeURIComponent(prefix)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при получении предложений');
      }
      
      const suggestions = await response.json();
      
      // Кэшируем результаты
      this.cacheService.set(cacheKey, suggestions);
      
      return suggestions;
    } catch (error) {
      errorService.handleError(error, 'warning', { 
        context: 'SearchService.getAutocompleteSuggestions', 
        prefix 
      });
      return [];
    }
  }
}

// Экспортируем синглтон
export const searchService = new SearchService();
