
import React from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NoProductsFoundProps {
  fetchError: string | null;
  onRetry?: () => void;
  searchQuery?: string;
  searchFilters?: boolean;
}

const NoProductsFound = ({ fetchError, onRetry, searchQuery, searchFilters = false }: NoProductsFoundProps) => {
  // Process error message for more user-friendly display
  const getErrorMessage = (error: string): string => {
    if (error.includes('JSON.parse') || error.includes('unexpected character')) {
      return 'Ошибка при загрузке данных с сервера. Возможно, сервер временно недоступен.';
    }
    if (error.includes('Failed to fetch') || error.includes('NetworkError')) {
      return 'Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.';
    }
    if (error.includes('пустой ответ')) {
      return 'Сервер вернул пустой ответ. Попробуйте обновить страницу.';
    }
    if (error.includes('timeout') || error.includes('time out')) {
      return 'Превышено время ожидания ответа от сервера. Попробуйте позже.';
    }
    if (error.includes('aborted')) {
      return 'Запрос был прерван. Пожалуйста, попробуйте снова.';
    }
    return error;
  };

  if (fetchError) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <p className="text-gray-700 font-medium text-lg">Произошла ошибка при загрузке товаров</p>
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg max-w-md mx-auto">
          <p className="text-red-600 text-sm">
            {getErrorMessage(fetchError)}
          </p>
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="mt-3 text-sm bg-white"
              size="sm"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Попробовать снова
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-10">
      <Search className="mx-auto h-16 w-16 text-gray-300 mb-6" />
      <h3 className="text-xl font-medium text-gray-800 mb-2">
        {searchQuery 
          ? `По запросу "${searchQuery}" ничего не найдено`
          : 'Товары не найдены'}
      </h3>
      
      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        {searchFilters 
          ? 'Попробуйте изменить параметры фильтра или сбросить все фильтры.'
          : 'Возможно, товар был удален или перемещен в другую категорию.'}
      </p>
      
      <div className="mt-8 space-y-3">
        {searchFilters && (
          <Button 
            variant="outline" 
            className="mr-4"
            onClick={onRetry}
          >
            Сбросить фильтры
          </Button>
        )}
        
        <Link to="/">
          <Button className="bg-store-purple hover:bg-store-purple-dark text-white">
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NoProductsFound;
