
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchService } from '@/services/SearchService';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  compact?: boolean;
  defaultValue?: string;
  fullWidth?: boolean;
  showRecent?: boolean;
  showCategories?: boolean;
  onFilterSelect?: (filter: string, value: string) => void;
}

const SearchBox = ({ 
  placeholder = 'Поиск товаров...', 
  onSearch, 
  className,
  compact = false,
  defaultValue = '',
  fullWidth = false,
  showRecent = true,
  showCategories = true,
  onFilterSelect
}: SearchBoxProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularCategories, setPopularCategories] = useState<{id: string, name: string}[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Update query when defaultValue changes
  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);
  
  // Load recent searches from localStorage
  useEffect(() => {
    if (showRecent) {
      try {
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, [showRecent]);
  
  // Load popular categories
  useEffect(() => {
    if (showCategories) {
      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories/popular');
          if (response.ok) {
            const data = await response.json();
            setPopularCategories(data.slice(0, 4));
          }
        } catch (error) {
          console.error('Failed to load popular categories:', error);
          // Fallback categories if API fails
          setPopularCategories([
            { id: 'electronics', name: 'Электроника' },
            { id: 'clothing', name: 'Одежда' },
            { id: 'home', name: 'Для дома' },
            { id: 'beauty', name: 'Красота' }
          ]);
        }
      };
      
      fetchCategories();
    }
  }, [showCategories]);
  
  // Debounced query для автозаполнения
  const debouncedQuery = useDebounce(query, 300);
  
  // Получаем предложения при изменении запроса
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
          const results = await searchService.getAutocompleteSuggestions(debouncedQuery);
          setSuggestions(results);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
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
  
  // Save search to recent searches
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (showRecent && searchTerm.trim()) {
      try {
        let searches = [];
        const savedSearches = localStorage.getItem('recentSearches');
        
        if (savedSearches) {
          searches = JSON.parse(savedSearches);
        }
        
        // Add to beginning of array and remove duplicates
        searches = [searchTerm, ...searches.filter(s => s !== searchTerm)].slice(0, 5);
        
        localStorage.setItem('recentSearches', JSON.stringify(searches));
        setRecentSearches(searches);
      } catch (error) {
        console.error('Failed to save recent search:', error);
      }
    }
  }, [showRecent]);
  
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      saveRecentSearch(query);
      
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setIsFocused(false);
    }
  }, [query, onSearch, navigate, saveRecentSearch]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    saveRecentSearch(suggestion);
    
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    }
    setIsFocused(false);
  };
  
  const handleRecentSearchClick = (term: string) => {
    setQuery(term);
    
    if (onSearch) {
      onSearch(term);
    } else {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
    setIsFocused(false);
  };
  
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    if (onFilterSelect) {
      onFilterSelect('category', categoryId);
    } else {
      navigate(`/category/${categoryId}`);
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
  
  // Highlight matching part of suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 font-medium">{part}</mark> : part
    );
  };
  
  useEffect(() => {
    if (activeSuggestion >= 0 && suggestions.length > 0) {
      setQuery(suggestions[activeSuggestion]);
    }
  }, [activeSuggestion, suggestions]);
  
  return (
    <div className={cn(
      "relative",
      fullWidth ? "w-full" : "",
      className
    )}>
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
            compact ? "h-9 text-sm" : "h-10",
            "focus-visible:ring-store-purple focus-visible:ring-offset-1"
          )}
          autoComplete="off"
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size={compact ? "sm" : "icon"}
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
          size={compact ? "sm" : "icon"}
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
      
      {isFocused && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg max-h-[400px] overflow-y-auto"
        >
          {/* Автозаполнение */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1.5 text-xs font-medium text-gray-500">
                Предложения
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`suggest-${index}`}
                  className={cn(
                    "cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between",
                    activeSuggestion === index ? "bg-gray-100" : ""
                  )}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center">
                    <Search className="h-3.5 w-3.5 text-gray-400 mr-2" />
                    <span>{highlightMatch(suggestion, query)}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </div>
              ))}
            </div>
          )}
          
          {/* Разделитель, если есть и предложения, и недавние поиски */}
          {suggestions.length > 0 && recentSearches.length > 0 && (
            <Separator className="my-1" />
          )}
          
          {/* Недавние поиски */}
          {showRecent && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1.5 text-xs font-medium text-gray-500">
                Недавние поиски
              </div>
              {recentSearches.map((term, index) => (
                <div
                  key={`recent-${index}`}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => handleRecentSearchClick(term)}
                >
                  <div className="flex items-center">
                    <Search className="h-3.5 w-3.5 text-gray-400 mr-2" />
                    <span>{term}</span>
                  </div>
                  <X 
                    className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentSearches(prev => prev.filter(s => s !== term));
                      localStorage.setItem('recentSearches', JSON.stringify(
                        recentSearches.filter(s => s !== term)
                      ));
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Разделитель перед категориями */}
          {((suggestions.length > 0 || recentSearches.length > 0) && 
            showCategories && popularCategories.length > 0) && (
            <Separator className="my-1" />
          )}
          
          {/* Популярные категории */}
          {showCategories && popularCategories.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1.5 text-xs font-medium text-gray-500">
                Популярные категории
              </div>
              <div className="px-4 py-2 flex flex-wrap gap-2">
                {popularCategories.map((category) => (
                  <Badge 
                    key={category.id}
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100 transition-colors py-1.5 bg-gray-50"
                    onClick={() => handleCategoryClick(category.id, category.name)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Если нет предложений, недавних поисков и категорий */}
          {suggestions.length === 0 && recentSearches.length === 0 && 
           (!showCategories || popularCategories.length === 0) && !isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {query.length < 2 
                ? 'Введите минимум 2 символа для поиска' 
                : 'Нет результатов для отображения'}
            </div>
          )}
          
          {/* Состояние загрузки */}
          {isLoading && suggestions.length === 0 && (
            <div className="px-4 py-3 text-center">
              <Loader2 className="animate-spin h-5 w-5 mx-auto text-gray-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
