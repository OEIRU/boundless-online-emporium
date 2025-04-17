
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoProductsFoundProps {
  fetchError: string | null;
  onRetry?: () => void;
}

const NoProductsFound = ({ fetchError, onRetry }: NoProductsFoundProps) => {
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
    return error;
  };

  return (
    <div className="text-center py-10">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-600 font-medium text-lg">Товары не найдены.</p>
      <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтра.</p>
      {fetchError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg max-w-md mx-auto">
          <p className="text-red-600 text-sm">
            {getErrorMessage(fetchError)}
          </p>
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="mt-3 text-sm"
              size="sm"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Попробовать снова
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NoProductsFound;
