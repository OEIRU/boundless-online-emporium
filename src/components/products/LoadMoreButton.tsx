
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const LoadMoreButton = ({ onClick, isLoading = false }: LoadMoreButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);
  
  // Reset click state when loading state changes from true to false
  useEffect(() => {
    if (!isLoading && isClicked) {
      setIsClicked(false);
    }
  }, [isLoading]);
  
  const handleClick = () => {
    if (!isLoading && !isClicked) {
      setIsClicked(true);
      onClick();
    }
  };
  
  return (
    <div className="mt-8 text-center">
      <Button
        onClick={handleClick}
        className="bg-store-purple hover:bg-store-purple-dark text-white font-medium py-2 px-6 rounded-md transition-colors"
        disabled={isLoading || isClicked}
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
