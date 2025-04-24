
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';

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
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Cat placeholder images - will use these temporarily
  const catPlaceholders = [
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=500",
    "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=500",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=500",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500"
  ];
  
  // Get a consistent cat image based on product id
  const getCatImage = (productId: string) => {
    const index = productId.charCodeAt(0) % catPlaceholders.length;
    return catPlaceholders[index];
  };
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? "Удалено из избранного" : "Добавлено в избранное",
      duration: 1500,
    });
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: id,
      title: title,
      price: price,
      quantity: 1,
      size: 'M',
      color: 'Черный',
      image: imageError ? getCatImage(id) : image
    });
    
    toast({
      title: "Добавлено в корзину",
      description: `${title} был добавлен в вашу корзину`,
      duration: 1500,
    });
  };
  
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <Link to={`/product/${id}`} className="block h-full">
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
              src={imageError ? getCatImage(id) : image} 
              alt={title}
              onError={handleImageError}
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
              onClick={handleAddToCart}
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
