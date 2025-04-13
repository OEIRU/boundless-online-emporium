
import { Link } from 'react-router-dom';
import { Trash2, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PageLayout from '@/components/layout/PageLayout';
import { useCart } from '@/contexts/CartContext';

const CartPage = () => {
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart();
  
  return (
    <PageLayout showCategories={false}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Ваша корзина</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-store-purple" />
          </div>
        ) : cart.items.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Ваша корзина пуста</h2>
            <p className="text-gray-600 mb-6">Добавьте товары в корзину, чтобы увидеть их здесь.</p>
            <Link to="/">
              <Button>Продолжить покупки</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                {cart.items.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`}>
                    <div className="flex py-4">
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="font-medium text-gray-900 hover:text-store-purple">{item.title}</h3>
                          </Link>
                          <span className="font-medium">{(item.price * item.quantity).toFixed(2)} ₽</span>
                        </div>
                        
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Размер: {item.size} • Цвет: {item.color}</p>
                          <p className="mt-1">{item.price.toFixed(2)} ₽ за шт.</p>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              disabled={isLoading}
                            >
                              -
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center border-x border-gray-300">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              disabled={isLoading}
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.productId, item.size, item.color)}
                            className="text-gray-500 hover:text-red-500"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {index < cart.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
              
              <Link to="/" className="inline-flex items-center text-store-purple hover:text-store-purple-dark">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Продолжить покупки
              </Link>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Итого заказа</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Подытог</span>
                    <span>{cart.subtotal.toFixed(2)} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка</span>
                    <span>{cart.shippingCost === 0 ? 'Бесплатно' : `${cart.shippingCost.toFixed(2)} ₽`}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Итого</span>
                    <span>{cart.total.toFixed(2)} ₽</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-store-purple hover:bg-store-purple-dark flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Оформить заказ
                </Button>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>Мы принимаем все основные кредитные карты, PayPal и СБП.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CartPage;
