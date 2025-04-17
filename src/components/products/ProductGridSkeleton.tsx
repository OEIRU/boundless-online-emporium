
import React from 'react';

const ProductGridSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-5 w-48 bg-gray-200 mb-4 rounded"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGridSkeleton;
