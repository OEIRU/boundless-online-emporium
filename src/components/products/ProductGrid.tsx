
import { useState } from 'react';
import ProductCard, { ProductProps } from '@/components/products/ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample products data
const productsData: ProductProps[] = [
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
  },
  {
    id: '7',
    title: 'Children\'s Educational Toy',
    price: 19.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Kids'
  },
  {
    id: '8',
    title: 'Premium Skincare Set',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    category: 'Beauty'
  }
];

interface ProductGridProps {
  title?: string;
  products?: ProductProps[];
  categoryFilter?: string;
}

const ProductGrid = ({ 
  title = 'Popular Products', 
  products = productsData,
  categoryFilter
}: ProductGridProps) => {
  const isMobile = useIsMobile();
  const [visibleProducts, setVisibleProducts] = useState(8);
  
  // Filter products by category if categoryFilter is provided
  const filteredProducts = categoryFilter 
    ? products.filter(product => product.category === categoryFilter)
    : products;

  const loadMore = () => {
    setVisibleProducts(prev => prev + 8);
  };

  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.slice(0, visibleProducts).map((product) => (
          <div key={product.id}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>
      
      {visibleProducts < filteredProducts.length && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="bg-store-purple hover:bg-store-purple-dark text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
