
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, RotateCcw, CheckCircle, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { useCart } from '@/contexts/CartContext';

// Каталог товаров (в реальном приложении это бы было получено с сервера)
const products = [
  {
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
  },
  {
    id: '2',
    title: 'Designer Jeans',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.2,
    reviewCount: 85,
    description: 'These premium designer jeans combine style and comfort with a perfect fit. Made from high-quality denim that offers just the right amount of stretch for all-day comfort. The classic cut and wash make them versatile for both casual and semi-formal occasions.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    ],
    category: 'Men',
    features: [
      '98% Cotton, 2% Elastane',
      'Premium denim fabric',
      'Regular fit',
      'Machine washable',
      'Five-pocket styling',
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Blue', value: '#1E40AF' },
      { name: 'Black', value: '#000000' },
      { name: 'Gray', value: '#6B7280' },
    ],
  },
  {
    id: '3',
    title: 'Summer Floral Dress',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviewCount: 112,
    description: 'This beautiful floral dress is perfect for summer days and special occasions. The lightweight fabric keeps you cool and comfortable, while the flattering cut and vibrant pattern ensure you look your best. Pair with sandals for a casual look or dress up with heels for evening events.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1383&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80',
      'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=930&q=80',
    ],
    category: 'Women',
    features: [
      '100% Rayon',
      'Floral pattern',
      'Midi length',
      'V-neckline',
      'Hand wash cold',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blue', value: '#93C5FD' },
      { name: 'Pink', value: '#F9A8D4' },
      { name: 'Green', value: '#86EFAC' },
    ],
  },
  // Добавляем новые товары для демонстрации функциональности
  {
    id: '4',
    title: 'Running Shoes',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviewCount: 156,
    description: 'Engineered for performance and comfort, these running shoes feature responsive cushioning and breathable mesh upper. The durable rubber outsole provides excellent traction on various surfaces, making them ideal for both daily runs and intense training sessions.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
    ],
    category: 'Sports',
    features: [
      'Breathable mesh upper',
      'Responsive cushioning',
      'Durable rubber outsole',
      'Lightweight design',
      'Reflective details',
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Black/Red', value: '#000000' },
      { name: 'Blue/White', value: '#1e40af' },
      { name: 'Gray/Orange', value: '#6B7280' },
    ],
  },
  {
    id: '5',
    title: 'Leather Wallet',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.6,
    reviewCount: 92,
    description: 'Crafted from genuine leather, this wallet combines classic style with modern functionality. With multiple card slots, bill compartments, and RFID protection, it keeps your essentials organized and secure. The slim design fits comfortably in your pocket.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
      'https://images.unsplash.com/photo-1611010344444-5f9e4d86a6e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80',
      'https://images.unsplash.com/photo-1640476576024-afe208227beb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
    ],
    category: 'Accessories',
    features: [
      'Genuine leather',
      'RFID protection',
      'Multiple card slots',
      'Bill compartments',
      'Slim design',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Brown', value: '#8B4513' },
      { name: 'Black', value: '#000000' },
      { name: 'Tan', value: '#D2B48C' },
    ],
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<typeof products[0] | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Находим соответствующий товар при изменении ID
  useEffect(() => {
    setLoading(true);
    // Имитация загрузки данных с сервера
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(0); // Сбрасываем выбранное изображение
        setSelectedSize(''); // Сбрасываем размер
        setSelectedColor(''); // Сбрасываем цвет
        setQuantity(1); // Сбрасываем количество
      } else {
        // Если товар не найден, используем дефолтный первый товар
        setProduct(products[0]);
      }
      setLoading(false);
    }, 300);
  }, [id]);

  // Если товар загружается или не найден, показываем заглушку
  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Товар не найден</h2>
          <p className="text-gray-600 mb-6">К сожалению, запрашиваемый товар не существует или был удален.</p>
          <Button asChild>
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Выберите размер',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedColor) {
      toast({
        title: 'Выберите цвет',
        variant: 'destructive',
      });
      return;
    }
    
    // Добавляем товар в корзину
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0]
    });
    
    toast({
      title: 'Добавлено в корзину',
      description: `${product.title} (${selectedSize}, ${selectedColor}) x ${quantity}`,
    });
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? 'Удалено из избранного' : 'Добавлено в избранное',
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
              <p>{product.description}</p>
              <p>The versatile design pairs easily with any outfit, making it a must-have addition to your wardrobe. Whether you're dressing up for a casual day out or lounging at home, this product provides both style and comfort.</p>
              <h3>Product Specifications</h3>
              <ul>
                <li>Material: Premium quality materials</li>
                <li>Care Instructions: Please check the product label</li>
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
