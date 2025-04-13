
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import cartService, { Cart, CartItem } from '@/services/CartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity: number }) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, size: string, color: string) => Promise<void>;
  removeFromCart: (productId: string, size: string, color: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, shippingCost: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Set user ID for cart service when user changes
  useEffect(() => {
    cartService.setUserId(user?.id || null);
    // Load cart whenever user changes
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'quantity'> & { quantity: number }) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartService.addToCart(item);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number, size: string, color: string) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartService.updateCartItemQuantity(productId, quantity, size, color);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartService.removeFromCart(productId, size, color);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
