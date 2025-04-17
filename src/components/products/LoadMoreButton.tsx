
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoadMoreButtonProps {
  onClick: () => void;
}

const LoadMoreButton = ({ onClick }: LoadMoreButtonProps) => {
  return (
    <div className="mt-8 text-center">
      <Button
        onClick={onClick}
        className="bg-store-purple hover:bg-store-purple-dark text-white font-medium py-2 px-6 rounded-md transition-colors"
      >
        Загрузить еще
      </Button>
    </div>
  );
};

export default LoadMoreButton;
