
import { useState, useEffect } from 'react';
import ProductCard, { ProductProps } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Sample data for featured products
const featuredProductsData: ProductProps[] = [
  {
    id: '1',
    title: 'Stylish Summer Dress',
    price: 39.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Women'
  },
  {
    id: '2',
    title: 'Men\'s Casual Shirt',
    price: 29.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Men'
  },
  {
    id: '3',
    title: 'Wireless Headphones',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Electronics'
  },
  {
    id: '4',
    title: 'Smart Watch Series 5',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
    category: 'Electronics'
  },
  {
    id: '5',
    title: 'Running Shoes',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Sports'
  },
  {
    id: '6',
    title: 'Home Decorative Pillow',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Home'
  }
];

const FeaturedProducts = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef) {
      setMaxScroll(containerRef.scrollWidth - containerRef.clientWidth);
    }
  }, [containerRef]);

  const scrollLeft = () => {
    if (containerRef) {
      const newPosition = Math.max(0, scrollPosition - 300);
      containerRef.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    if (containerRef) {
      const newPosition = Math.min(maxScroll, scrollPosition + 300);
      containerRef.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollLeft} 
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollRight} 
            disabled={scrollPosition >= maxScroll}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={setContainerRef}
        className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar" 
        onScroll={handleScroll}
      >
        {featuredProductsData.map((product) => (
          <div key={product.id} className="min-w-[220px] md:min-w-[250px]">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
