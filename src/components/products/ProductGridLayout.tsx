
import React from 'react';
import ProductCard from '@/components/products/ProductCard';
import { ProductProps } from '@/components/products/ProductCard';

interface ProductGridLayoutProps {
  products: ProductProps[];
  visibleCount: number;
}

const ProductGridLayout = ({ products, visibleCount }: ProductGridLayoutProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.slice(0, visibleCount).map((product) => (
        <div key={product.id}>
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGridLayout;
