
import { useState, useEffect, useMemo, useRef } from 'react';
import { ProductProps } from '@/components/products/ProductCard';
import { useToast } from '@/components/ui/use-toast';
import { errorService } from '@/services/ErrorService';
import { cacheService } from '@/services/CacheService';

interface UseProductDataProps {
  categoryFilter?: string;
  sortOption?: string;
  priceRange?: number[];
  sizeFilters?: string[];
  colorFilters?: string[];
  discountFilter?: number;
  fallbackProducts: ProductProps[];
}

export const useProductData = ({
  categoryFilter,
  sortOption = "featured",
  priceRange = [0, 1000],
  sizeFilters = [],
  colorFilters = [],
  discountFilter = 0,
  fallbackProducts
}: UseProductDataProps) => {
  const [loading, setLoading] = useState(false);
  const [apiProducts, setApiProducts] = useState<ProductProps[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();
  const activeRequestRef = useRef<AbortController | null>(null);
  const lastRequestParamsRef = useRef<string>('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      // Generate a unique key for the current request parameters
      const params: Record<string, string> = {};
      
      if (categoryFilter) {
        params.category = categoryFilter;
      }
      
      if (sortOption) {
        let apiSortOption = sortOption;
        if (sortOption === "price-asc") apiSortOption = "price_asc";
        if (sortOption === "price-desc") apiSortOption = "price_desc";
        if (sortOption === "newest") apiSortOption = "newest";
        if (sortOption === "rating") apiSortOption = "rating";
        if (sortOption === "discount") apiSortOption = "discount";
        
        params.sort = apiSortOption;
      }
      
      if (priceRange && priceRange.length === 2) {
        params.min_price = priceRange[0].toString();
        params.max_price = priceRange[1].toString();
      }
      
      if (sizeFilters && sizeFilters.length > 0) {
        params.sizes = sizeFilters.join(',');
      }
      
      if (colorFilters && colorFilters.length > 0) {
        params.colors = colorFilters.join(',');
      }
      
      if (discountFilter && discountFilter > 0) {
        params.min_discount = discountFilter.toString();
      }
      
      const queryString = new URLSearchParams(params).toString();
      
      // Check if the request parameters are the same as the last request
      if (queryString === lastRequestParamsRef.current) {
        return; // Skip duplicate requests with the same parameters
      }
      
      // Check cache first
      const cacheKey = `products_${queryString}`;
      const cachedData = cacheService.get<{products: ProductProps[], pagination: {total: number}}>(cacheKey);
      
      if (cachedData) {
        console.log('Using cached product data for:', queryString);
        setApiProducts(cachedData.products);
        setTotalProducts(cachedData.pagination.total);
        return;
      }
      
      try {
        // Cancel any previous request
        if (activeRequestRef.current) {
          activeRequestRef.current.abort();
        }
        
        // Create a new abort controller for this request
        const abortController = new AbortController();
        activeRequestRef.current = abortController;
        lastRequestParamsRef.current = queryString;
        
        setLoading(true);
        setFetchError(null);
        
        console.log(`Fetching products with params: ${queryString}`);
        const response = await fetch(`/api/products?${queryString}`, {
          signal: abortController.signal,
          headers: {
            'Cache-Control': 'max-age=300',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        let data;
        
        try {
          // Check if text is empty
          if (!text.trim()) {
            throw new Error('Получен пустой ответ от сервера');
          }
          
          // Try to parse text as JSON
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError, 'Response text:', text);
          throw new Error(`Ошибка при обработке ответа сервера: ${parseError.message}`);
        }
        
        console.log('Products fetched successfully:', data);
        
        if (data.products && Array.isArray(data.products)) {
          const processedProducts = data.products.map((product: any) => ({
            id: product._id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice || undefined,
            image: product.images?.[0] || '',
            category: product.category?.name || 'Uncategorized'
          }));
          
          // Store in cache
          cacheService.set(cacheKey, {
            products: processedProducts,
            pagination: data.pagination
          }, 5 * 60 * 1000); // 5 minutes cache
          
          setApiProducts(processedProducts);
          setTotalProducts(data.pagination.total);
        } else {
          throw new Error('Неверный формат ответа от сервера');
        }
      } catch (error) {
        // Ignore errors from aborted requests
        if (error.name === 'AbortError') {
          console.log('Request was aborted');
          return;
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error('Error fetching products:', error);
        setFetchError(errorMessage);
        
        errorService.handleError(error as Error, 'error', { 
          context: 'ProductGrid.fetchProducts', 
          categoryFilter, 
          sortOption, 
          priceRange,
          sizeFilters,
          colorFilters,
          discountFilter
        });
        
        // Display notification only for non-empty responses with parsing error
        if (!errorMessage.includes('пустой ответ') && !errorMessage.includes('Нет товаров')) {
          toast({
            title: "Не удалось загрузить товары",
            description: "Используем демо-данные для отображения. Повторите попытку позже.",
            variant: "destructive"
          });
        }
      } finally {
        // Only clear loading state if this is still the active request
        if (lastRequestParamsRef.current === queryString) {
          setLoading(false);
          activeRequestRef.current = null;
        }
      }
    };

    fetchProducts().catch(console.error);
    
    // Cleanup function to abort any pending requests when component unmounts
    // or when dependencies change
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
        activeRequestRef.current = null;
      }
    };
  }, [categoryFilter, sortOption, priceRange, sizeFilters, colorFilters, discountFilter, toast]);
  
  const filteredProducts = useMemo(() => {
    if (apiProducts.length > 0) {
      return apiProducts;
    }
    
    let result = categoryFilter 
      ? fallbackProducts.filter(product => product.category === categoryFilter)
      : fallbackProducts;
    
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    if (sortOption) {
      switch (sortOption) {
        case "newest":
          break;
        case "price-asc":
          result = [...result].sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result = [...result].sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result = [...result].sort(() => Math.random() - 0.5);
          break;
        case "discount":
          result = [...result].sort((a, b) => {
            const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
            const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
            return discountB - discountA;
          });
          break;
        default:
          break;
      }
    }
    
    if (sizeFilters && sizeFilters.length > 0) {
      result = result.slice(0, Math.max(4, result.length / 2));
    }
    
    if (colorFilters && colorFilters.length > 0) {
      result = result.slice(0, Math.max(4, result.length / 2));
    }
    
    if (discountFilter && discountFilter > 0) {
      result = result.filter(product => 
        product.originalPrice && 
        ((product.originalPrice - product.price) / product.originalPrice) * 100 >= discountFilter
      );
    }
    
    return result;
  }, [fallbackProducts, categoryFilter, sortOption, priceRange, sizeFilters, colorFilters, discountFilter, apiProducts]);

  return {
    loading,
    filteredProducts,
    totalProducts,
    fetchError
  };
};
