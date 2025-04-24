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
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=500',
    category: 'Women'
  },
  {
    id: '2',
    title: 'Men\'s Casual Shirt',
    price: 29.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=500',
    category: 'Men'
  },
  {
    id: '3',
    title: 'Wireless Headphones',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500',
    category: 'Electronics'
  },
  {
    id: '4',
    title: 'Smart Watch Series 5',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=500',
    category: 'Electronics'
  },
  {
    id: '5',
    title: 'Running Shoes',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=500',
    category: 'Sports'
  },
  {
    id: '6',
    title: 'Home Decorative Pillow',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=500',
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
