
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  totalItems?: number;
  loadedItems?: number;
  className?: string;
}

const LoadMoreButton = ({ 
  onClick, 
  isLoading = false, 
  totalItems,
  loadedItems,
  className
}: LoadMoreButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  // Reset click state when loading state changes from true to false
  useEffect(() => {
    if (!isLoading && isClicked) {
      setIsClicked(false);
      
      // Add a brief cooldown to prevent rapid clicks
      setCooldown(true);
      setRemainingTime(1);
      
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            setCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLoading, isClicked]);
  
  const handleClick = () => {
    if (!isLoading && !isClicked && !cooldown) {
      setIsClicked(true);
      onClick();
    }
  };
  
  // Calculate remaining items text
  const getRemainingItemsText = () => {
    if (!totalItems || !loadedItems) return '';
    
    const remaining = totalItems - loadedItems;
    if (remaining <= 0) return '';
    
    return `(осталось ${remaining} ${getRussianWordForm(remaining, ['товар', 'товара', 'товаров'])})`;
  };
  
  // Helper function to get correct Russian word form based on number
  const getRussianWordForm = (number: number, forms: [string, string, string]) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)];
    return forms[index];
  };
  
  const buttonDisabled = isLoading || isClicked || cooldown;
  
  return (
    <div className={`mt-8 text-center ${className || ''}`}>
      <Button
        onClick={handleClick}
        className="bg-store-purple hover:bg-store-purple-dark text-white font-medium py-2 px-6 rounded-md transition-colors"
        disabled={buttonDisabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Загрузка...
          </>
        ) : cooldown ? (
          `Загрузить еще (${remainingTime})`
        ) : (
          <>
            Загрузить еще {getRemainingItemsText()}
          </>
        )}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
