
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ChevronLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PageLayout from '@/components/layout/PageLayout';

// Sample cart items
const initialCartItems = [
  {
    id: '1',
    title: 'Premium Cotton T-Shirt',
    price: 29.99,
    quantity: 2,
    size: 'L',
    color: 'Black',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
  },
  {
    id: '5',
    title: 'Running Shoes',
    price: 79.99,
    quantity: 1,
    size: '42',
    color: 'Red',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shippingCost;
  
  return (
    <PageLayout showCategories={false}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to your cart to see them here.</p>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
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
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-medium text-gray-900 hover:text-store-purple">{item.title}</h3>
                          </Link>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Size: {item.size} • Color: {item.color}</p>
                          <p className="mt-1">${item.price.toFixed(2)} each</p>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                            >
                              -
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center border-x border-gray-300">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {index < cartItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
              
              <Link to="/" className="inline-flex items-center text-store-purple hover:text-store-purple-dark">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Continue Shopping
              </Link>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-store-purple hover:bg-store-purple-dark flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>We accept all major credit cards, PayPal, and Apple Pay.</p>
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
