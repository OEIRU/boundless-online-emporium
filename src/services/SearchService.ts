
import { errorService } from './ErrorService';
import { cacheService } from './CacheService';

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
  colors?: { name: string; value: string }[];
  sizes?: string[];
  rating?: number;
  discount?: number;
  matchScore?: number;
}

// Интерфейс для параметров поиска
export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  minDiscount?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'discount';
  page?: number;
  limit?: number;
}

// Интерфейс для результатов поиска
export interface SearchResults {
  products: ProductSearchResult[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  filters?: {
    categories?: { _id: string; name: string; count: number }[];
    prices?: { min: number; max: number };
    colors?: { name: string; count: number }[];
    sizes?: { name: string; count: number }[];
  };
}

class SearchService {
  private requestQueue: Map<string, Promise<any>> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 минут в миллисекундах
  private readonly AUTOCOMPLETE_CACHE_DURATION = 10 * 60 * 1000; // 10 минут для автозаполнения

  /**
   * Поиск товаров по запросу с расширенной фильтрацией
   * @param params Параметры поиска
   * @returns Промис с результатами поиска
   */
  async searchProducts(params: SearchParams = {}): Promise<SearchResults> {
    try {
      // Формируем ключ кэша на основе параметров
      const cacheKey = this.generateCacheKey(params);
      
      // Проверяем кэш
      const cachedResults = cacheService.get<SearchResults>(cacheKey);
      if (cachedResults) {
        console.log('Returning cached search results for:', params.query || 'all products');
        return cachedResults;
      }
      
      // Проверяем, есть ли уже запрос с такими параметрами в очереди
      if (this.requestQueue.has(cacheKey)) {
        console.log('Request already in queue, reusing promise');
        return this.requestQueue.get(cacheKey)!;
      }
      
      // Создаем параметры запроса
      const queryParams = new URLSearchParams();
      
      if (params.query) {
        queryParams.append('q', params.query);
      }
      
      if (params.category) {
        queryParams.append('category', params.category);
      }
      
      if (params.minPrice !== undefined) {
        queryParams.append('min_price', params.minPrice.toString());
      }
      
      if (params.maxPrice !== undefined) {
        queryParams.append('max_price', params.maxPrice.toString());
      }
      
      if (params.colors && params.colors.length > 0) {
        queryParams.append('colors', params.colors.join(','));
      }
      
      if (params.sizes && params.sizes.length > 0) {
        queryParams.append('sizes', params.sizes.join(','));
      }
      
      if (params.minDiscount !== undefined) {
        queryParams.append('min_discount', params.minDiscount.toString());
      }
      
      if (params.sortBy) {
        queryParams.append('sort', params.sortBy);
      }
      
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      // Создаем промис для запроса и добавляем его в очередь
      const fetchPromise = this.fetchWithRetry(`/api/products/search?${queryParams.toString()}`, 3)
        .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.message || 'Ошибка при поиске товаров');
            });
          }
          return response.text();
        })
        .then(text => {
          if (!text.trim()) {
            throw new Error('Получен пустой ответ от сервера');
          }
          
          try {
            const data = JSON.parse(text);
            
            // Обработка и структурирование результатов
            const results: SearchResults = {
              products: data.products.map((product: any) => ({
                _id: product._id,
                name: product.title || product.name,
                price: product.price,
                image: (product.images && product.images.length > 0) ? product.images[0] : undefined,
                description: product.description,
                category: product.category,
                colors: product.colors,
                sizes: product.sizes,
                rating: product.rating,
                discount: product.discount,
                matchScore: product.score
              })),
              pagination: data.pagination,
              filters: data.filters
            };
            
            // Кэшируем результаты
            cacheService.set(cacheKey, results, this.CACHE_DURATION);
            
            // Удаляем запрос из очереди
            this.requestQueue.delete(cacheKey);
            
            return results;
          } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError, 'Response text:', text);
            throw new Error(`Ошибка при обработке ответа сервера: ${parseError.message}`);
          }
        })
        .catch(error => {
          // Удаляем запрос из очереди в случае ошибки
          this.requestQueue.delete(cacheKey);
          throw error;
        });
      
      // Добавляем промис в очередь
      this.requestQueue.set(cacheKey, fetchPromise);
      
      return fetchPromise;
    } catch (error) {
      errorService.handleError(error, 'error', { 
        context: 'SearchService.searchProducts', 
        params 
      });
      
      // Возвращаем пустой результат в случае ошибки
      return {
        products: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 0
        }
      };
    }
  }
  
  /**
   * Получает предложения для автозаполнения с улучшенной обработкой 
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
      const cachedSuggestions = cacheService.get<string[]>(cacheKey);
      if (cachedSuggestions) {
        return cachedSuggestions;
      }
      
      // Проверяем, есть ли уже запрос в очереди
      if (this.requestQueue.has(cacheKey)) {
        return this.requestQueue.get(cacheKey)!;
      }
      
      // Создаем промис для запроса
      const fetchPromise = this.fetchWithRetry(`/api/products/autocomplete?q=${encodeURIComponent(prefix)}`, 2)
        .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.message || 'Ошибка при получении предложений');
            });
          }
          return response.text();
        })
        .then(text => {
          if (!text.trim()) {
            return [];
          }
          
          try {
            const suggestions = JSON.parse(text);
            
            // Кэшируем результаты
            cacheService.set(cacheKey, suggestions, this.AUTOCOMPLETE_CACHE_DURATION);
            
            // Удаляем запрос из очереди
            this.requestQueue.delete(cacheKey);
            
            return suggestions;
          } catch (parseError) {
            console.error('Failed to parse autocomplete JSON:', parseError);
            return [];
          }
        })
        .catch(error => {
          // Удаляем запрос из очереди в случае ошибки
          this.requestQueue.delete(cacheKey);
          console.error('Autocomplete error:', error);
          return [];
        });
      
      // Добавляем промис в очередь
      this.requestQueue.set(cacheKey, fetchPromise);
      
      return fetchPromise;
    } catch (error) {
      errorService.handleError(error, 'warning', { 
        context: 'SearchService.getAutocompleteSuggestions', 
        prefix 
      });
      return [];
    }
  }
  
  /**
   * Возвращает популярные поисковые запросы
   * @returns Массив популярных запросов
   */
  async getPopularSearchTerms(): Promise<string[]> {
    try {
      const cacheKey = 'popular_search_terms';
      
      // Проверяем кэш
      const cachedTerms = cacheService.get<string[]>(cacheKey);
      if (cachedTerms) {
        return cachedTerms;
      }
      
      const response = await fetch('/api/analytics/popular-searches');
      
      if (!response.ok) {
        throw new Error('Failed to fetch popular search terms');
      }
      
      const terms = await response.json();
      
      // Кэшируем результаты на 1 час
      cacheService.set(cacheKey, terms, 60 * 60 * 1000);
      
      return terms;
    } catch (error) {
      console.error('Error fetching popular search terms:', error);
      
      // Возвращаем стандартные популярные термины в случае ошибки
      return [
        'смартфон',
        'наушники',
        'ноутбук',
        'холодильник',
        'телевизор'
      ];
    }
  }
  
  /**
   * Генерирует ключ кэша на основе параметров запроса
   */
  private generateCacheKey(params: SearchParams): string {
    const parts = [];
    
    if (params.query) {
      parts.push(`q:${params.query.trim().toLowerCase()}`);
    }
    
    if (params.category) {
      parts.push(`cat:${params.category}`);
    }
    
    if (params.minPrice !== undefined) {
      parts.push(`min:${params.minPrice}`);
    }
    
    if (params.maxPrice !== undefined) {
      parts.push(`max:${params.maxPrice}`);
    }
    
    if (params.colors && params.colors.length > 0) {
      parts.push(`colors:${params.colors.sort().join(',')}`);
    }
    
    if (params.sizes && params.sizes.length > 0) {
      parts.push(`sizes:${params.sizes.sort().join(',')}`);
    }
    
    if (params.minDiscount !== undefined) {
      parts.push(`disc:${params.minDiscount}`);
    }
    
    if (params.sortBy) {
      parts.push(`sort:${params.sortBy}`);
    }
    
    if (params.page) {
      parts.push(`page:${params.page}`);
    }
    
    if (params.limit) {
      parts.push(`limit:${params.limit}`);
    }
    
    return `search_${parts.length > 0 ? parts.join('_') : 'all'}`;
  }
  
  /**
   * Выполняет запрос с автоматическими повторами при ошибках
   * @param url URL для запроса
   * @param maxRetries Максимальное количество повторов
   * @param delay Задержка между повторами в мс
   */
  private async fetchWithRetry(url: string, maxRetries: number = 3, delay: number = 500): Promise<Response> {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд таймаут
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300',
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        // Если ответ 429 (Too Many Requests), делаем повтор с увеличенной задержкой
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay * Math.pow(2, retries);
          
          console.log(`Rate limited, retrying after ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries++;
          continue;
        }
        
        // Для других ошибок, кроме сетевых, возвращаем ответ как есть
        return response;
      } catch (error) {
        // Только для сетевых ошибок делаем повтор
        if (error instanceof TypeError && error.message.includes('fetch')) {
          retries++;
          if (retries < maxRetries) {
            const waitTime = delay * Math.pow(2, retries);
            console.log(`Network error, retrying (${retries}/${maxRetries}) after ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        throw error;
      }
    }
    
    throw new Error(`Failed after ${maxRetries} retries`);
  }
  
  /**
   * Очищает кэш результатов поиска
   */
  clearCache(): void {
    cacheService.clear();
  }
  
  /**
   * Очищает конкретный ключ кэша
   */
  clearCacheForKey(key: string): void {
    if (key.startsWith('search_') || key.startsWith('autocomplete_')) {
      cacheService.remove(key);
    }
  }
}

// Экспортируем синглтон
export const searchService = new SearchService();
