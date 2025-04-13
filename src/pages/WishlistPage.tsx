
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/use-toast';

// Примерные данные для избранных товаров
const initialWishlistItems = [
  {
    id: '1',
    title: 'Высококачественная хлопковая футболка',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    title: 'Стильная куртка из эко-кожи',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80',
    rating: 4.8,
    reviewCount: 94
  },
  {
    id: '3',
    title: 'Комфортные джинсы прямого кроя',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80',
    rating: 4.3,
    reviewCount: 76
  }
];

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  
  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    toast({
      title: "Товар удален",
      description: "Товар был удален из избранного",
    });
  };
  
  const addToCart = (id: string) => {
    // Здесь будет реальная логика добавления в корзину
    toast({
      title: "Товар добавлен в корзину",
      description: "Товар был добавлен в вашу корзину",
    });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price);
  };
  
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Избранное</h1>
          <span className="text-gray-500">{wishlistItems.length} товаров</span>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-store-purple" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Ваш список избранного пуст</h2>
            <p className="text-gray-600 mb-6">Добавляйте товары в избранное, чтобы вернуться к ним позже</p>
            <Link to="/">
              <Button>Перейти к покупкам</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden relative group">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute right-2 top-2 p-1.5 bg-white rounded-full shadow-md z-10 text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Удалить из избранного"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                
                <Link to={`/product/${item.id}`} className="block">
                  <div className="h-64 bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{item.rating}</span>
                      </span>
                      <span className="mx-2">•</span>
                      <span>{item.reviewCount} отзывов</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-lg">{formatPrice(item.price)}</span>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(item.id);
                        }}
                        className="bg-store-purple hover:bg-store-purple-dark"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        В корзину
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default WishlistPage;
