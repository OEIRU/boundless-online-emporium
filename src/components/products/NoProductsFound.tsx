
import React from 'react';

interface NoProductsFoundProps {
  fetchError: string | null;
}

const NoProductsFound = ({ fetchError }: NoProductsFoundProps) => {
  return (
    <div className="text-center py-10">
      <p className="text-gray-500">Товары не найдены.</p>
      <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтра.</p>
      {fetchError && (
        <p className="text-red-500 mt-4">Причина: {fetchError}</p>
      )}
    </div>
  );
};

export default NoProductsFound;
