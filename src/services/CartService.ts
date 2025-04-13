
import { toast } from "sonner";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

const API_URL = '/api/cart';

class CartService {
  private userId: string | null = null;
  
  setUserId(userId: string | null) {
    this.userId = userId;
  }
  
  async getCart(): Promise<Cart> {
    if (!this.userId) {
      return this.getLocalCart();
    }
    
    try {
      const response = await fetch(`${API_URL}/${this.userId}`);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить корзину');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      toast.error('Не удалось загрузить корзину');
      return this.getLocalCart();
    }
  }
  
  private getLocalCart(): Cart {
    const cartJson = localStorage.getItem('cart');
    if (!cartJson) {
      return { items: [], subtotal: 0, shippingCost: 0, total: 0 };
    }
    
    try {
      return JSON.parse(cartJson);
    } catch (e) {
      return { items: [], subtotal: 0, shippingCost: 0, total: 0 };
    }
  }
  
  async addToCart(item: Omit<CartItem, 'quantity'> & { quantity: number }): Promise<Cart> {
    if (!this.userId) {
      return this.addToLocalCart(item);
    }
    
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...item, userId: this.userId }),
      });
      
      if (!response.ok) {
        throw new Error('Не удалось добавить товар в корзину');
      }
      
      toast.success('Товар добавлен в корзину');
      return (await response.json()).cart;
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
      toast.error('Не удалось добавить товар в корзину');
      return this.getLocalCart();
    }
  }
  
  private addToLocalCart(item: Omit<CartItem, 'quantity'> & { quantity: number }): Cart {
    let cart = this.getLocalCart();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => 
        cartItem.productId === item.productId && 
        cartItem.size === item.size && 
        cartItem.color === item.color
    );
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.items.push(item);
    }
    
    // Recalculate totals
    this.calculateCartTotals(cart);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast.success('Товар добавлен в корзину');
    return cart;
  }
  
  async updateCartItemQuantity(
    productId: string, 
    quantity: number, 
    size: string, 
    color: string
  ): Promise<Cart> {
    if (!this.userId) {
      return this.updateLocalCartItemQuantity(productId, quantity, size, color);
    }
    
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          productId,
          quantity,
          size,
          color,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Не удалось обновить количество товара');
      }
      
      return (await response.json()).cart;
    } catch (error) {
      console.error('Ошибка при обновлении количества товара:', error);
      toast.error('Не удалось обновить количество товара');
      return this.getLocalCart();
    }
  }
  
  private updateLocalCartItemQuantity(
    productId: string, 
    quantity: number, 
    size: string, 
    color: string
  ): Cart {
    let cart = this.getLocalCart();
    
    // Find the item to update
    const itemIndex = cart.items.findIndex(
      item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (itemIndex === -1) {
      toast.error('Товар не найден в корзине');
      return cart;
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Recalculate totals
    this.calculateCartTotals(cart);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return cart;
  }
  
  async removeFromCart(productId: string, size: string, color: string): Promise<Cart> {
    if (!this.userId) {
      return this.removeFromLocalCart(productId, size, color);
    }
    
    try {
      const response = await fetch(`${API_URL}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          productId,
          size,
          color,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить товар из корзины');
      }
      
      toast.success('Товар удален из корзины');
      return (await response.json()).cart;
    } catch (error) {
      console.error('Ошибка при удалении товара из корзины:', error);
      toast.error('Не удалось удалить товар из корзины');
      return this.getLocalCart();
    }
  }
  
  private removeFromLocalCart(productId: string, size: string, color: string): Cart {
    let cart = this.getLocalCart();
    
    // Filter out the item to remove
    cart.items = cart.items.filter(
      item => 
        !(item.productId === productId && item.size === size && item.color === color)
    );
    
    // Recalculate totals
    this.calculateCartTotals(cart);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast.success('Товар удален из корзины');
    return cart;
  }
  
  async clearCart(): Promise<Cart> {
    if (!this.userId) {
      return this.clearLocalCart();
    }
    
    try {
      const response = await fetch(`${API_URL}/clear/${this.userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Не удалось очистить корзину');
      }
      
      toast.success('Корзина очищена');
      return (await response.json()).cart;
    } catch (error) {
      console.error('Ошибка при очистке корзины:', error);
      toast.error('Не удалось очистить корзину');
      return this.getLocalCart();
    }
  }
  
  private clearLocalCart(): Cart {
    const emptyCart = { items: [], subtotal: 0, shippingCost: 0, total: 0 };
    localStorage.setItem('cart', JSON.stringify(emptyCart));
    toast.success('Корзина очищена');
    return emptyCart;
  }
  
  private calculateCartTotals(cart: Cart): void {
    // Calculate subtotal
    cart.subtotal = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Calculate shipping cost (free over 5000)
    cart.shippingCost = cart.subtotal >= 5000 ? 0 : 499;
    
    // Calculate total
    cart.total = cart.subtotal + cart.shippingCost;
  }
}

export const cartService = new CartService();
export default cartService;
