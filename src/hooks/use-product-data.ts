
import { useState, useEffect, useMemo } from 'react';
import { ProductProps } from '@/components/products/ProductCard';
import { useToast } from '@/components/ui/use-toast';
import { errorService } from '@/services/ErrorService';

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
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        
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
        
        console.log(`Fetching products with params: ${queryString}`);
        const response = await fetch(`/api/products?${queryString}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        let data;
        
        try {
          // Проверяем, если текст пустой
          if (!text.trim()) {
            throw new Error('Получен пустой ответ от сервера');
          }
          
          // Пытаемся распарсить текст как JSON
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError, 'Response text:', text);
          throw new Error(`Ошибка при обработке ответа сервера: ${parseError.message}`);
        }
        
        console.log('Products fetched successfully:', data);
        
        if (data.products && Array.isArray(data.products)) {
          setApiProducts(data.products.map((product: any) => ({
            id: product._id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice || undefined,
            image: product.images?.[0] || '',
            category: product.category?.name || 'Uncategorized'
          })));
          
          setTotalProducts(data.pagination.total);
        } else {
          throw new Error('Неверный формат ответа от сервера');
        }
      } catch (error) {
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
        
        // Отображаем уведомление только для непустых ответов с ошибкой парсинга
        if (!errorMessage.includes('пустой ответ') && !errorMessage.includes('Нет товаров')) {
          toast({
            title: "Не удалось загрузить товары",
            description: "Используем демо-данные для отображения. Повторите попытку позже.",
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts().catch(console.error);
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
