
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface NoProductsFoundProps {
  fetchError: string | null;
}

const NoProductsFound = ({ fetchError }: NoProductsFoundProps) => {
  // Обработка сообщения об ошибке для более дружественного отображения
  const getErrorMessage = (error: string): string => {
    if (error.includes('JSON.parse') || error.includes('unexpected character')) {
      return 'Ошибка при загрузке данных с сервера. Возможно, сервер временно недоступен.';
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
        </div>
      )}
    </div>
  );
};

export default NoProductsFound;
