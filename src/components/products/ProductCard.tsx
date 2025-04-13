
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export interface ProductProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
}

const ProductCard = ({ id, title, price, originalPrice, image, category }: ProductProps) => {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      duration: 1500,
    });
  };
  
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart`,
      duration: 1500,
    });
  };
  
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  return (
    <Link to={`/product/${id}`}>
      <Card className="product-card h-full flex flex-col">
        <div className="relative overflow-hidden">
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
              -{discount}%
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-10 bg-white bg-opacity-70 hover:bg-opacity-100"
            onClick={toggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <div className="overflow-hidden aspect-[3/4]">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
          </div>
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="mb-1">
            <span className="category-badge">{category}</span>
          </div>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 flex-grow">{title}</h3>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-gray-900">${price.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-2">${originalPrice.toFixed(2)}</span>
              )}
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 bg-store-purple text-white hover:bg-store-purple-dark"
              onClick={addToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
