
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { cacheService } from '@/services/CacheService';
import { errorService } from '@/services/ErrorService';
import { logService } from '@/services/LogService';

/**
 * Хук для получения данных с кэшированием
 * @param queryKey Ключ запроса для React Query
 * @param queryFn Функция запроса
 * @param options Дополнительные опции
 * @returns Результат запроса
 */
export function useCachedQuery<TData, TError>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> & {
    cacheTTL?: number; // Время жизни кэша в миллисекундах
    cacheKey?: string; // Пользовательский ключ кэша
  }
): UseQueryResult<TData, TError> {
  const cacheKey = options?.cacheKey || queryKey.join('_');
  const cacheTTL = options?.cacheTTL;

  // Создаем функцию запроса с кэшированием
  const cachedQueryFn = async (): Promise<TData> => {
    try {
      // Проверяем кэш
      const cachedData = cacheService.get<TData>(cacheKey);
      if (cachedData) {
        logService.info(`Cache hit for key: ${cacheKey}`);
        return cachedData;
      }

      logService.info(`Cache miss for key: ${cacheKey}, fetching data...`);
      
      // Если в кэше нет, делаем запрос
      const data = await queryFn();
      
      // Сохраняем результат в кэш
      if (cacheTTL) {
        cacheService.set(cacheKey, data, cacheTTL);
      } else {
        cacheService.set(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      errorService.handleError(error as Error, 'error', { queryKey, cacheKey });
      throw error;
    }
  };

  return useQuery({
    queryKey,
    queryFn: cachedQueryFn,
    ...options,
  });
}
