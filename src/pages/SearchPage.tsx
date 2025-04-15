
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2, Filter, SlidersHorizontal } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import SearchBox from '@/components/search/SearchBox';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { searchService, ProductSearchResult } from '@/services/SearchService';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 50000] as [number, number],
    categories: {} as Record<string, boolean>,
  });
  const [availableCategories, setAvailableCategories] = useState<{id: string, name: string}[]>([]);
  
  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data);
          
          // Инициализируем фильтры категорий
          const categoryFilters = data.reduce((acc: Record<string, boolean>, category: {id: string, name: string}) => {
            acc[category.id] = false;
            return acc;
          }, {});
          
          setFilters(prev => ({
            ...prev,
            categories: categoryFilters
          }));
        }
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Поиск при изменении запроса или фильтров
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery]);
  
  // Обновляем URL при изменении строки запроса
  useEffect(() => {
    const newQueryParams = new URLSearchParams();
    if (searchQuery) {
      newQueryParams.set('q', searchQuery);
    }
    
    // Добавляем фильтры в URL
    // Здесь можно добавить больше фильтров по мере необходимости
    
    const newUrl = `${location.pathname}?${newQueryParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, location.pathname]);
  
  const performSearch = async (query: string) => {
    setIsLoading(true);
    
    // Формируем объект фильтров для API
    const apiFilters: Record<string, any> = {
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
    };
    
    // Добавляем выбранные категории
    const selectedCategories = Object.entries(filters.categories)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    
    if (selectedCategories.length > 0) {
      apiFilters.categories = selectedCategories.join(',');
    }
    
    try {
      const searchResults = await searchService.searchProducts(query, apiFilters);
      setResults(searchResults);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const applyFilters = () => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };
  
  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number]
    }));
  };
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: checked
      }
    }));
  };
  
  return (
    <PageLayout showCategories={false}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Поиск товаров</h1>
          <SearchBox value={searchQuery} onSearch={handleSearch} className="max-w-xl" />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Мобильный фильтр */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Фильтры
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                  <SheetDescription>
                    Настройте параметры поиска
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Цена</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={filters.priceRange}
                        min={0}
                        max={50000}
                        step={100}
                        onValueChange={handlePriceChange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{filters.priceRange[0]} ₽</span>
                        <span>{filters.priceRange[1]} ₽</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Категории</h3>
                    <div className="space-y-3">
                      {availableCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-category-${category.id}`}
                            checked={filters.categories[category.id] || false}
                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                          />
                          <Label 
                            htmlFor={`mobile-category-${category.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button onClick={applyFilters}>Применить</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Десктопные фильтры */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg border">
              <h2 className="font-medium text-lg mb-4 flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Фильтры
              </h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Цена</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={filters.priceRange}
                    min={0}
                    max={50000}
                    step={100}
                    onValueChange={handlePriceChange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.priceRange[0]} ₽</span>
                    <span>{filters.priceRange[1]} ₽</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Категории</h3>
                <div className="space-y-3">
                  {availableCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`}
                        checked={filters.categories[category.id] || false}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                      />
                      <Label 
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button className="w-full mt-6" onClick={applyFilters}>
                Применить
              </Button>
            </div>
          </div>
          
          {/* Результаты поиска */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg border mb-4">
              <h2 className="text-lg font-medium">
                {isLoading 
                  ? 'Поиск...' 
                  : results.length > 0 
                    ? `Найдено ${results.length} товаров по запросу "${searchQuery}"` 
                    : `По запросу "${searchQuery}" ничего не найдено`
                }
              </h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-60">
                <Loader2 className="h-10 w-10 animate-spin text-store-purple" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image || '/placeholder.svg'}
                    category={product.category?.name}
                  />
                ))}
              </div>
            )}
            
            {!isLoading && results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">К сожалению, по вашему запросу ничего не найдено</p>
                <p className="text-gray-500">Попробуйте изменить параметры поиска или выберите другие категории</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPage;
