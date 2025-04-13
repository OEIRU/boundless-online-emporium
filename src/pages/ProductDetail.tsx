
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, RotateCcw, CheckCircle, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';

// Sample product data
const product = {
  id: '1',
  title: 'Premium Cotton T-Shirt',
  price: 29.99,
  originalPrice: 39.99,
  rating: 4.5,
  reviewCount: 120,
  description: 'This premium cotton t-shirt offers exceptional comfort with its soft, breathable fabric. Perfect for everyday wear, its durable construction ensures it maintains its shape and color wash after wash. The versatile design pairs easily with any outfit, making it a must-have addition to your wardrobe.',
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1715&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1754&q=80',
  ],
  category: 'Men',
  features: [
    '100% Premium Cotton',
    'Reinforced stitching',
    'Pre-shrunk fabric',
    'Machine washable',
    'Classic fit',
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: [
    { name: 'White', value: '#FFFFFF', border: true },
    { name: 'Black', value: '#000000' },
    { name: 'Navy', value: '#0A142F' },
    { name: 'Red', value: '#E63946' },
    { name: 'Green', value: '#40916C' },
  ],
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedColor) {
      toast({
        title: 'Please select a color',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Added to cart',
      description: `${product.title} (${selectedSize}, ${selectedColor}) x ${quantity}`,
    });
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: product.title,
    });
  };
  
  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  return (
    <PageLayout>
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-store-purple">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-store-purple">{product.category}</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-900">{product.title}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={product.images[selectedImage]} 
              alt={product.title} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded border-2 overflow-hidden ${
                  selectedImage === index ? 'border-store-purple' : 'border-transparent'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.title} ${index + 1}`} 
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : i < product.rating
                      ? 'text-yellow-400 fill-yellow-400 opacity-50'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="ml-2 text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="ml-2 bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Size</h3>
              <button className="text-sm text-store-purple">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-10 min-w-[40px] px-3 border rounded-md font-medium ${
                    selectedSize === size
                      ? 'border-store-purple bg-store-purple text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedColor === color.name ? 'ring-2 ring-store-purple ring-offset-2' : ''
                  }`}
                  title={color.name}
                >
                  <span 
                    className={`w-6 h-6 rounded-full block`} 
                    style={{ 
                      backgroundColor: color.value,
                      border: color.border ? '1px solid #e2e8f0' : 'none'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                -
              </button>
              <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-store-purple hover:bg-store-purple-dark gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleWishlist}
              className={isWishlisted ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
            </Button>
          </div>
          
          {/* Shipping info */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-gray-600" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-5 w-5 text-gray-600" />
              <span>30-day easy returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-gray-600" />
              <span>In stock, ready to ship</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="details" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-store-purple data-[state=active]:bg-transparent py-3"
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-store-purple data-[state=active]:bg-transparent py-3"
            >
              Features
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-store-purple data-[state=active]:bg-transparent py-3"
            >
              Reviews ({product.reviewCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-4">
            <div className="prose max-w-none">
              <p>This premium cotton t-shirt offers exceptional comfort with its soft, breathable fabric. Perfect for everyday wear, its durable construction ensures it maintains its shape and color wash after wash.</p>
              <p>The versatile design pairs easily with any outfit, making it a must-have addition to your wardrobe. Whether you're dressing up for a casual day out or lounging at home, this t-shirt provides both style and comfort.</p>
              <h3>Product Specifications</h3>
              <ul>
                <li>Material: 100% Premium Cotton</li>
                <li>Weight: Medium (180 GSM)</li>
                <li>Care Instructions: Machine wash cold, tumble dry low</li>
                <li>Country of Origin: Imported</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="features" className="pt-4">
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-store-purple mt-0.5 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : i < product.rating
                            ? 'text-yellow-400 fill-yellow-400 opacity-50'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    Based on {product.reviewCount} reviews
                  </span>
                </div>
              </div>
              <Button>Write a Review</Button>
            </div>
            <p className="text-gray-500 text-center py-8">Reviews will be displayed here</p>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      <div>
        <ProductGrid title="You May Also Like" />
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
