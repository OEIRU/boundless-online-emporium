
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const LoadMoreButton = ({ onClick, isLoading = false }: LoadMoreButtonProps) => {
  return (
    <div className="mt-8 text-center">
      <Button
        onClick={onClick}
        className="bg-store-purple hover:bg-store-purple-dark text-white font-medium py-2 px-6 rounded-md transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Загрузка...
          </>
        ) : (
          'Загрузить еще'
        )}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
