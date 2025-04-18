
import { useState, useCallback } from 'react';
import { ProductProps } from '@/components/products/ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProductData } from '@/hooks/use-product-data';
import ProductGridLayout from '@/components/products/ProductGridLayout';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';
import NoProductsFound from '@/components/products/NoProductsFound';
import LoadMoreButton from '@/components/products/LoadMoreButton';

// Sample products data (оставлен для fallback)
const productsData: ProductProps[] = [
  // Women's category
  {
    id: 'w1',
    title: 'Стильное летнее платье',
    price: 39.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Женщинам'
  },
  {
    id: 'w2',
    title: 'Женская блузка с цветочным принтом',
    price: 29.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Женщинам'
  },
  {
    id: 'w3',
    title: 'Джинсы с высокой талией',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Женщинам'
  },
  {
    id: 'w4',
    title: 'Элегантное вечернее платье',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Женщинам'
  },
  
  // Men's category
  {
    id: 'm1',
    title: 'Мужская повседневная рубашка',
    price: 29.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Мужчинам'
  },
  {
    id: 'm2',
    title: 'Джинсы прямого кроя',
    price: 39.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Мужчинам'
  },
  {
    id: 'm3',
    title: 'Спортивная куртка',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Мужчинам'
  },
  {
    id: 'm4',
    title: 'Классический костюм',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Мужчинам'
  },
  
  // Kids category
  {
    id: 'k1',
    title: 'Детская футболка с принтом',
    price: 14.99,
    originalPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=772&q=80',
    category: 'Детям'
  },
  {
    id: 'k2',
    title: 'Детский комбинезон',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Детям'
  },
  {
    id: 'k3',
    title: 'Образовательная игрушка',
    price: 19.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Детям'
  },
  {
    id: 'k4',
    title: 'Детская зимняя куртка',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Детям'
  },
  
  // Home category
  {
    id: 'h1',
    title: 'Декоративная подушка',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Дом'
  },
  {
    id: 'h2',
    title: 'Керамическая ваза',
    price: 34.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1612230337141-903f3d330205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Дом'
  },
  {
    id: 'h3',
    title: 'Набор кухонных полотенец',
    price: 19.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1583845112203-29329902332e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Дом'
  },
  {
    id: 'h4',
    title: 'Комплект постельного белья',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Дом'
  },
  
  // Electronics category
  {
    id: 'e1',
    title: 'Беспроводные наушники',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Электроника'
  },
  {
    id: 'e2',
    title: 'Умные часы серии 5',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
    category: 'Электроника'
  },
  {
    id: 'e3',
    title: 'Bluetooth колонка',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Электроника'
  },
  {
    id: 'e4',
    title: 'Портативное зарядное устройство',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1583863788301-8ec3e9d2db03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Электроника'
  },
  
  // Beauty category
  {
    id: 'b1',
    title: 'Набор для ухода за кожей',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    category: 'Красота'
  },
  {
    id: 'b2',
    title: 'Набор косметики для макияжа',
    price: 39.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1583241801905-a5ff8871a3b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Красота'
  },
  {
    id: 'b3',
    title: 'Парфюмерная вода',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1004&q=80',
    category: 'Красота'
  },
  {
    id: 'b4',
    title: 'Набор для ухода за волосами',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1599751449029-3bfee05dc37c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=869&q=80',
    category: 'Красота'
  },
  
  // Sports category
  {
    id: 's1',
    title: 'Беговые кроссовки',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Спорт'
  },
  {
    id: 's2',
    title: 'Комплект для йоги',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Спорт'
  },
  {
    id: 's3',
    title: 'Спортивная бутылка',
    price: 14.99,
    originalPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1625708458528-778d2689ea0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Спорт'
  },
  {
    id: 's4',
    title: 'Гантели набор 10 кг',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    category: 'Спорт'
  },
  
  // Shoes category
  {
    id: 'sh1',
    title: 'Женские туфли на каблуке',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    category: 'Обувь'
  },
  {
    id: 'sh2',
    title: 'Мужские классические туфли',
    price: 89.99,
    originalPrice: 109.99,
    image: 'https://images.unsplash.com/photo-1613987876445-fcb353cd8e27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Обувь'
  },
  {
    id: 'sh3',
    title: 'Детские сандалии',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1412&q=80',
    category: 'Обувь'
  },
  {
    id: 'sh4',
    title: 'Женские кроссовки',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1479&q=80',
    category: 'Обувь'
  }
];

interface ProductGridProps {
  title?: string;
  products?: ProductProps[];
  categoryFilter?: string;
  sortOption?: string;
  priceRange?: number[];
  sizeFilters?: string[];
  colorFilters?: string[];
  discountFilter?: number;
}

const ProductGrid = ({ 
  title = 'Popular Products', 
  products = productsData,
  categoryFilter,
  sortOption = "featured",
  priceRange = [0, 1000],
  sizeFilters = [],
  colorFilters = [],
  discountFilter = 0
}: ProductGridProps) => {
  const isMobile = useIsMobile();
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [requestKey, setRequestKey] = useState(0); // Add a key to force re-fetch

  const { loading, filteredProducts, fetchError } = useProductData({
    categoryFilter,
    sortOption,
    priceRange,
    sizeFilters,
    colorFilters,
    discountFilter,
    fallbackProducts: products
  });

  const loadMore = useCallback(() => {
    setVisibleProducts(prev => prev + 8);
  }, []);

  const handleRetry = useCallback(() => {
    // Force a re-fetch by updating the request key
    setRequestKey(prev => prev + 1);
  }, []);

  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
      
      {loading ? (
        <div className="text-center py-10">
          <ProductGridSkeleton />
        </div>
      ) : filteredProducts.length === 0 ? (
        <NoProductsFound fetchError={fetchError} onRetry={handleRetry} />
      ) : (
        <>
          <ProductGridLayout 
            products={filteredProducts} 
            visibleCount={visibleProducts} 
          />
          
          {visibleProducts < filteredProducts.length && (
            <LoadMoreButton onClick={loadMore} isLoading={loading} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
