
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Filter, SlidersHorizontal, Search, X, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import SearchBox from '@/components/search/SearchBox';
import ProductCard from '@/components/products/ProductCard';
import NoProductsFound from '@/components/products/NoProductsFound';
import LoadMoreButton from '@/components/products/LoadMoreButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchService, ProductSearchResult, SearchParams } from '@/services/SearchService';
import { useToast } from '@/components/ui/use-toast';

const sortOptions = [
  { value: 'relevance', label: 'По релевантности' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'newest', label: 'Новинки' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'discount', label: 'По скидке' }
];

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialCategory = queryParams.get('category') || '';
  
  // Состояния
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<{id: string, name: string, count?: number}[]>([]);
  const [availableColors, setAvailableColors] = useState<{name: string, count: number}[]>([]);
  const [availableSizes, setAvailableSizes] = useState<{name: string, count: number}[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState<{
    category: string;
    colors: string[];
    sizes: string[];
    priceRange: [number, number];
    minDiscount: number;
    sortBy: string;
  }>({
    category: initialCategory,
    colors: [],
    sizes: [],
    priceRange: [0, 50000],
    minDiscount: 0,
    sortBy: 'relevance'
  });
  
  // Для отслеживания изменения URL
  const lastQueryParams = useRef<string>(location.search);
  
  // Загрузка категорий при монтировании
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };
    
    fetchCategories();
    
    // Обновление состояния при изменении параметров URL
    const handleURLChange = () => {
      if (location.search !== lastQueryParams.current) {
        lastQueryParams.current = location.search;
        const params = new URLSearchParams(location.search);
        
        const query = params.get('q') || '';
        const category = params.get('category') || '';
        const colors = params.getAll('color');
        const sizes = params.getAll('size');
        const minPrice = parseInt(params.get('min_price') || '0');
        const maxPrice = parseInt(params.get('max_price') || '50000');
        const minDiscount = parseInt(params.get('min_discount') || '0');
        const sortBy = params.get('sort') || 'relevance';
        
        setSearchQuery(query);
        setActiveFilters({
          category,
          colors,
          sizes,
          priceRange: [minPrice, maxPrice],
          minDiscount,
          sortBy
        });
        
        setCurrentPage(1);
      }
    };
    
    handleURLChange();
    
    // Слушаем изменения истории браузера
    window.addEventListener('popstate', handleURLChange);
    
    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, [location.search]);
  
  // Выполнение поиска при изменении фильтров или страницы
  useEffect(() => {
    const searchWithFilters = async (loadMore = false) => {
      try {
        if (loadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          setFetchError(null);
        }
        
        const searchParams: SearchParams = {
          query: searchQuery,
          page: loadMore ? currentPage : 1,
          limit: 12,
          sortBy: activeFilters.sortBy as any,
          minPrice: activeFilters.priceRange[0],
          maxPrice: activeFilters.priceRange[1],
          minDiscount: activeFilters.minDiscount
        };
        
        if (activeFilters.category) {
          searchParams.category = activeFilters.category;
        }
        
        if (activeFilters.colors.length > 0) {
          searchParams.colors = activeFilters.colors;
        }
        
        if (activeFilters.sizes.length > 0) {
          searchParams.sizes = activeFilters.sizes;
        }
        
        const searchResults = await searchService.searchProducts(searchParams);
        
        if (loadMore) {
          setResults(prev => [...prev, ...searchResults.products]);
        } else {
          setResults(searchResults.products);
          
          // Обновляем доступные фильтры на основе полученных данных
          if (searchResults.filters) {
            if (searchResults.filters.categories) {
              setAvailableCategories(searchResults.filters.categories.map(c => ({
                id: c._id,
                name: c.name,
                count: c.count
              })));
            }
            
            if (searchResults.filters.colors) {
              setAvailableColors(searchResults.filters.colors);
            }
            
            if (searchResults.filters.sizes) {
              setAvailableSizes(searchResults.filters.sizes);
            }
          }
        }
        
        setTotalResults(searchResults.pagination.total);
        setTotalPages(searchResults.pagination.pages);
        
        if (!loadMore) {
          // Прокручиваем страницу вверх при новом поиске
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Ошибка поиска:', error);
        setFetchError(error instanceof Error ? error.message : 'Ошибка при выполнении поиска');
        
        toast({
          title: "Ошибка при поиске",
          description: "Не удалось загрузить результаты поиска. Пожалуйста, попробуйте снова.",
          variant: "destructive"
        });
      } finally {
        if (loadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    };
    
    // Выполняем поиск только если на странице поиска и есть запрос или категория
    if (location.pathname === '/search' && (searchQuery || activeFilters.category)) {
      searchWithFilters();
    }
  }, [searchQuery, activeFilters.category, activeFilters.colors, activeFilters.sizes, 
      activeFilters.priceRange, activeFilters.minDiscount, activeFilters.sortBy, location.pathname, toast]);
  
  // Загрузка дополнительных результатов
  const loadMoreResults = useCallback(() => {
    if (currentPage < totalPages && !isLoadingMore) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage, totalPages, isLoadingMore]);
  
  // Обновление URL при изменении фильтров
  const updateURL = useCallback((filters: typeof activeFilters, query: string) => {
    const params = new URLSearchParams();
    
    if (query) {
      params.set('q', query);
    }
    
    if (filters.category) {
      params.set('category', filters.category);
    }
    
    filters.colors.forEach(color => {
      params.append('color', color);
    });
    
    filters.sizes.forEach(size => {
      params.append('size', size);
    });
    
    params.set('min_price', filters.priceRange[0].toString());
    params.set('max_price', filters.priceRange[1].toString());
    
    if (filters.minDiscount > 0) {
      params.set('min_discount', filters.minDiscount.toString());
    }
    
    if (filters.sortBy !== 'relevance') {
      params.set('sort', filters.sortBy);
    }
    
    navigate({
      pathname: '/search',
      search: params.toString()
    }, { replace: true });
    
    lastQueryParams.current = params.toString();
  }, [navigate]);
  
  // Обработчики событий
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateURL(activeFilters, query);
  };
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      category: checked ? categoryId : ''
    }));
    
    updateURL({
      ...activeFilters,
      category: checked ? categoryId : ''
    }, searchQuery);
  };
  
  const handleColorChange = (color: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      colors: checked 
        ? [...prev.colors, color]
        : prev.colors.filter(c => c !== color)
    }));
    
    updateURL({
      ...activeFilters,
      colors: checked 
        ? [...activeFilters.colors, color]
        : activeFilters.colors.filter(c => c !== color)
    }, searchQuery);
  };
  
  const handleSizeChange = (size: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      sizes: checked 
        ? [...prev.sizes, size]
        : prev.sizes.filter(s => s !== size)
    }));
    
    updateURL({
      ...activeFilters,
      sizes: checked 
        ? [...activeFilters.sizes, size]
        : activeFilters.sizes.filter(s => s !== size)
    }, searchQuery);
  };
  
  const handlePriceChange = (value: number[]) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number]
    }));
    
    updateURL({
      ...activeFilters,
      priceRange: [value[0], value[1]] as [number, number]
    }, searchQuery);
  };
  
  const handleDiscountChange = (value: number) => {
    setActiveFilters(prev => ({
      ...prev,
      minDiscount: value
    }));
    
    updateURL({
      ...activeFilters,
      minDiscount: value
    }, searchQuery);
  };
  
  const handleSortChange = (value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      sortBy: value
    }));
    
    updateURL({
      ...activeFilters,
      sortBy: value
    }, searchQuery);
  };
  
  const clearAllFilters = () => {
    setActiveFilters({
      category: '',
      colors: [],
      sizes: [],
      priceRange: [0, 50000],
      minDiscount: 0,
      sortBy: 'relevance'
    });
    
    updateURL({
      category: '',
      colors: [],
      sizes: [],
      priceRange: [0, 50000],
      minDiscount: 0,
      sortBy: 'relevance'
    }, searchQuery);
  };
  
  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case 'category':
        setActiveFilters(prev => ({
          ...prev,
          category: ''
        }));
        break;
      case 'color':
        if (value) {
          setActiveFilters(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== value)
          }));
        }
        break;
      case 'size':
        if (value) {
          setActiveFilters(prev => ({
            ...prev,
            sizes: prev.sizes.filter(s => s !== value)
          }));
        }
        break;
      case 'price':
        setActiveFilters(prev => ({
          ...prev,
          priceRange: [0, 50000]
        }));
        break;
      case 'discount':
        setActiveFilters(prev => ({
          ...prev,
          minDiscount: 0
        }));
        break;
      case 'sort':
        setActiveFilters(prev => ({
          ...prev,
          sortBy: 'relevance'
        }));
        break;
    }
    
    const updatedFilters = { ...activeFilters };
    
    if (type === 'category') updatedFilters.category = '';
    if (type === 'color' && value) updatedFilters.colors = updatedFilters.colors.filter(c => c !== value);
    if (type === 'size' && value) updatedFilters.sizes = updatedFilters.sizes.filter(s => s !== value);
    if (type === 'price') updatedFilters.priceRange = [0, 50000];
    if (type === 'discount') updatedFilters.minDiscount = 0;
    if (type === 'sort') updatedFilters.sortBy = 'relevance';
    
    updateURL(updatedFilters, searchQuery);
  };
  
  // Получаем имя категории по ID
  const getCategoryName = (categoryId: string) => {
    const category = availableCategories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  // Подсчет активных фильтров
  const activeFilterCount = [
    activeFilters.category ? 1 : 0,
    activeFilters.colors.length,
    activeFilters.sizes.length,
    (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 50000) ? 1 : 0,
    activeFilters.minDiscount > 0 ? 1 : 0,
    activeFilters.sortBy !== 'relevance' ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);
  
  // Проверка на наличие активных фильтров
  const hasActiveFilters = activeFilterCount > 0;
  
  const handleRetry = () => {
    setFetchError(null);
    updateURL(activeFilters, searchQuery);
  };
  
  return (
    <PageLayout showCategories={false}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Поиск товаров</h1>
          <SearchBox 
            defaultValue={searchQuery} 
            onSearch={handleSearch} 
            className="max-w-xl" 
            fullWidth={true}
            onFilterSelect={(filter, value) => {
              if (filter === 'category') {
                handleCategoryChange(value, true);
              }
            }}
          />
        </div>
        
        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Активные фильтры:</span>
            
            {activeFilters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Категория: {getCategoryName(activeFilters.category)}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => removeFilter('category')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Удалить фильтр</span>
                </Button>
              </Badge>
            )}
            
            {activeFilters.colors.map(color => (
              <Badge key={`color-${color}`} variant="secondary" className="flex items-center gap-1">
                Цвет: {color}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => removeFilter('color', color)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Удалить фильтр</span>
                </Button>
              </Badge>
            ))}
            
            {activeFilters.sizes.map(size => (
              <Badge key={`size-${size}`} variant="secondary" className="flex items-center gap-1">
                Размер: {size}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => removeFilter('size', size)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Удалить фильтр</span>
                </Button>
              </Badge>
            ))}
            
            {(activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 50000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Цена: {activeFilters.priceRange[0]} ₽ - {activeFilters.priceRange[1]} ₽
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => removeFilter('price')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Удалить фильтр</span>
                </Button>
              </Badge>
            )}
            
            {activeFilters.minDiscount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Скидка от {activeFilters.minDiscount}%
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => removeFilter('discount')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Удалить фильтр</span>
                </Button>
              </Badge>
            )}
            
            {activeFilters.sortBy !== 'relevance' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Сортировка: {sortOptions.find(o => o.value === activeFilters.sortBy)?.label}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => removeFilter('sort')}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Удалить фильтр</span>
                </Button>
              </Badge>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 text-xs" 
              onClick={clearAllFilters}
            >
              Очистить все
            </Button>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile filters button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Фильтры
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-store-purple text-white">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                  <SheetDescription>
                    Настройте параметры поиска
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-4">
                  {/* Sort options */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Сортировка</h3>
                    <Select value={activeFilters.sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сортировку" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Price range */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Цена</h3>
                    <div className="px-2">
                      <Slider
                        value={activeFilters.priceRange}
                        min={0}
                        max={50000}
                        step={100}
                        onValueChange={handlePriceChange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{activeFilters.priceRange[0]} ₽</span>
                        <span>{activeFilters.priceRange[1]} ₽</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Discount filter */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Скидка от {activeFilters.minDiscount}%</h3>
                    <div className="px-2">
                      <Slider
                        value={[activeFilters.minDiscount]}
                        min={0}
                        max={90}
                        step={10}
                        onValueChange={(values) => handleDiscountChange(values[0])}
                        className="mb-2"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Категории</h3>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                      {availableCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-category-${category.id}`}
                            checked={activeFilters.category === category.id}
                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                          />
                          <Label 
                            htmlFor={`mobile-category-${category.id}`}
                            className="text-sm font-normal cursor-pointer flex justify-between w-full"
                          >
                            <span>{category.name}</span>
                            {category.count !== undefined && (
                              <span className="text-gray-500 text-xs">({category.count})</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {availableColors.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      
                      {/* Colors */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Цвета</h3>
                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                          {availableColors.map((color) => (
                            <div key={`color-${color.name}`} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`mobile-color-${color.name}`}
                                checked={activeFilters.colors.includes(color.name)}
                                onCheckedChange={(checked) => handleColorChange(color.name, checked === true)}
                              />
                              <Label 
                                htmlFor={`mobile-color-${color.name}`}
                                className="text-sm font-normal cursor-pointer flex justify-between w-full"
                              >
                                <span>{color.name}</span>
                                <span className="text-gray-500 text-xs">({color.count})</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {availableSizes.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      
                      {/* Sizes */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Размеры</h3>
                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                          {availableSizes.map((size) => (
                            <div key={`size-${size.name}`} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`mobile-size-${size.name}`}
                                checked={activeFilters.sizes.includes(size.name)}
                                onCheckedChange={(checked) => handleSizeChange(size.name, checked === true)}
                              />
                              <Label 
                                htmlFor={`mobile-size-${size.name}`}
                                className="text-sm font-normal cursor-pointer flex justify-between w-full"
                              >
                                <span>{size.name}</span>
                                <span className="text-gray-500 text-xs">({size.count})</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <SheetFooter>
                  <SheetClose asChild>
                    <Button onClick={clearAllFilters} variant="outline" className="w-full mb-2">
                      Сбросить фильтры
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="w-full">
                      Применить
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop filters sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg border sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-lg flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Фильтры
                </h2>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs" 
                    onClick={clearAllFilters}
                  >
                    Сбросить
                  </Button>
                )}
              </div>
              
              {/* Sort options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Сортировка</h3>
                <Select value={activeFilters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите сортировку" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-4" />
              
              {/* Price range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Цена</h3>
                <div className="px-2">
                  <Slider
                    value={activeFilters.priceRange}
                    min={0}
                    max={50000}
                    step={100}
                    onValueChange={handlePriceChange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{activeFilters.priceRange[0]} ₽</span>
                    <span>{activeFilters.priceRange[1]} ₽</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Discount filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Скидка от {activeFilters.minDiscount}%</h3>
                <div className="px-2">
                  <Slider
                    value={[activeFilters.minDiscount]}
                    min={0}
                    max={90}
                    step={10}
                    onValueChange={(values) => handleDiscountChange(values[0])}
                    className="mb-2"
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Категории</h3>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {availableCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`}
                        checked={activeFilters.category === category.id}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                      />
                      <Label 
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer flex justify-between w-full"
                      >
                        <span>{category.name}</span>
                        {category.count !== undefined && (
                          <span className="text-gray-500 text-xs">({category.count})</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {availableColors.length > 0 && (
                <>
                  <Separator className="my-4" />
                  
                  {/* Colors */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Цвета</h3>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                      {availableColors.map((color) => (
                        <div key={`color-${color.name}`} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`color-${color.name}`}
                            checked={activeFilters.colors.includes(color.name)}
                            onCheckedChange={(checked) => handleColorChange(color.name, checked === true)}
                          />
                          <Label 
                            htmlFor={`color-${color.name}`}
                            className="text-sm font-normal cursor-pointer flex justify-between w-full"
                          >
                            <span>{color.name}</span>
                            <span className="text-gray-500 text-xs">({color.count})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {availableSizes.length > 0 && (
                <>
                  <Separator className="my-4" />
                  
                  {/* Sizes */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Размеры</h3>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                      {availableSizes.map((size) => (
                        <div key={`size-${size.name}`} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`size-${size.name}`}
                            checked={activeFilters.sizes.includes(size.name)}
                            onCheckedChange={(checked) => handleSizeChange(size.name, checked === true)}
                          />
                          <Label 
                            htmlFor={`size-${size.name}`}
                            className="text-sm font-normal cursor-pointer flex justify-between w-full"
                          >
                            <span>{size.name}</span>
                            <span className="text-gray-500 text-xs">({size.count})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <Button className="w-full mt-6" onClick={() => updateURL(activeFilters, searchQuery)}>
                Применить
              </Button>
            </div>
          </div>
          
          {/* Search results */}
          <div className="flex-1">
            {/* Search summary */}
            <div className="bg-white p-4 rounded-lg border mb-4">
              <h2 className="text-lg font-medium">
                {isLoading 
                  ? 'Поиск...' 
                  : results.length > 0 
                    ? `Найдено ${totalResults} товаров${searchQuery ? ` по запросу "${searchQuery}"` : ''}`
                    : searchQuery
                      ? `По запросу "${searchQuery}" ничего не найдено`
                      : 'Все товары'
                }
              </h2>
            </div>
            
            {/* Loading state */}
            {isLoading ? (
              <div className="flex justify-center items-center h-60">
                <Loader2 className="h-10 w-10 animate-spin text-store-purple" />
              </div>
            ) : (
              <>
                {/* Results grid */}
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((product) => (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        title={product.name}
                        price={product.price}
                        image={product.image || '/placeholder.svg'} 
                        category={product.category?.name || 'Без категории'}
                      />
                    ))}
                  </div>
                ) : (
                  // No results state
                  <NoProductsFound 
                    fetchError={fetchError} 
                    onRetry={handleRetry} 
                  />
                )}
                
                {/* Load more button */}
                {results.length > 0 && currentPage < totalPages && (
                  <LoadMoreButton 
                    onClick={loadMoreResults} 
                    isLoading={isLoadingMore} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPage;
