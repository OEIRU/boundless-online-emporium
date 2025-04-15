
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchService } from '@/services/SearchService';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  compact?: boolean;
}

const SearchBox = ({ 
  placeholder = 'Поиск товаров...', 
  onSearch, 
  className,
  compact = false
}: SearchBoxProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Debounced query для автозаполнения
  const debouncedQuery = useDebounce(query, 300);
  
  // Получаем предложения при изменении запроса
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        const results = await searchService.getAutocompleteSuggestions(debouncedQuery);
        setSuggestions(results);
        setIsLoading(false);
      };
      
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);
  
  // Обработка клика вне компонента для закрытия списка предложений
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setIsFocused(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    }
    setIsFocused(false);
  };
  
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={cn(
            "pr-16",
            compact ? "h-9 text-sm" : "h-10"
          )}
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size={compact ? "icon-sm" : "icon"}
            onClick={clearSearch}
            className="absolute right-8 top-0 h-full"
          >
            <X className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
            <span className="sr-only">Очистить</span>
          </Button>
        )}
        
        <Button
          type="button"
          variant="ghost"
          size={compact ? "icon-sm" : "icon"}
          onClick={handleSearch}
          className="absolute right-0 top-0 h-full"
        >
          {isLoading ? (
            <Loader2 className={cn("animate-spin", compact ? "h-4 w-4" : "h-5 w-5")} />
          ) : (
            <Search className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
          )}
          <span className="sr-only">Поиск</span>
        </Button>
      </div>
      
      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
