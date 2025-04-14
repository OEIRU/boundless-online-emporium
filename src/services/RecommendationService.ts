
import { cookieService } from './CookieService';
import { logService } from './LogService';
import { errorService } from './ErrorService';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: any;
  [key: string]: any;
}

class RecommendationService {
  private viewedProducts: string[] = [];
  private userPreferences: Record<string, number> = {};
  private categoryWeights: Record<string, number> = {};
  private priceRangePreference: { min: number; max: number } | null = null;
  
  constructor() {
    this.loadUserData();
    
    // Set up event listeners
    window.addEventListener('beforeunload', () => {
      this.saveUserData();
    });
  }
  
  /**
   * Track product view
   * @param product Viewed product
   */
  trackProductView(product: Product): void {
    try {
      if (!product || !product._id) return;
      
      // Add to recently viewed (max 20)
      this.viewedProducts = [
        product._id,
        ...this.viewedProducts.filter(id => id !== product._id)
      ].slice(0, 20);
      
      // Update category weights
      if (product.category && product.category._id) {
        const categoryId = product.category._id;
        this.categoryWeights[categoryId] = (this.categoryWeights[categoryId] || 0) + 1;
      }
      
      // Update price range preference
      if (typeof product.price === 'number') {
        if (!this.priceRangePreference) {
          this.priceRangePreference = { min: product.price, max: product.price };
        } else {
          // Gradually shift the price range preference
          this.priceRangePreference.min = (this.priceRangePreference.min * 0.8) + (product.price * 0.2);
          this.priceRangePreference.max = (this.priceRangePreference.max * 0.8) + (product.price * 0.2);
        }
      }
      
      // Save after each view if cookies are allowed
      if (cookieService.isCategoryAllowed('functional')) {
        this.saveUserData();
      }
      
      logService.debug('Tracked product view', { productId: product._id });
    } catch (error) {
      errorService.handleError(error, 'warning', { context: 'RecommendationService.trackProductView' });
    }
  }
  
  /**
   * Track product purchase
   * @param product Purchased product
   */
  trackPurchase(product: Product): void {
    try {
      if (!product || !product._id) return;
      
      // Increase weight for this product's category
      if (product.category && product.category._id) {
        const categoryId = product.category._id;
        this.categoryWeights[categoryId] = (this.categoryWeights[categoryId] || 0) + 3; // Higher weight for purchase
      }
      
      // Save after purchase if cookies are allowed
      if (cookieService.isCategoryAllowed('functional')) {
        this.saveUserData();
      }
      
      logService.debug('Tracked product purchase', { productId: product._id });
    } catch (error) {
      errorService.handleError(error, 'warning', { context: 'RecommendationService.trackPurchase' });
    }
  }
  
  /**
   * Get personalized product recommendations
   * @param products Array of available products
   * @param limit Maximum number of recommendations
   * @returns Array of recommended products
   */
  getRecommendations(products: Product[], limit: number = 4): Product[] {
    try {
      if (!products || products.length === 0) {
        return [];
      }
      
      // Calculate score for each product
      const productsWithScores = products
        .filter(product => !this.viewedProducts.includes(product._id)) // Exclude already viewed
        .map(product => {
          let score = 0;
          
          // Category score
          if (product.category && product.category._id) {
            const categoryId = product.category._id;
            if (this.categoryWeights[categoryId]) {
              score += this.categoryWeights[categoryId] * 10;
            }
          }
          
          // Price range score
          if (this.priceRangePreference && typeof product.price === 'number') {
            const priceRange = this.priceRangePreference.max - this.priceRangePreference.min;
            
            // Higher score if price is within preferred range (+/- 20%)
            if (product.price >= this.priceRangePreference.min * 0.8 &&
                product.price <= this.priceRangePreference.max * 1.2) {
              score += 5;
            }
          }
          
          // Add some randomness (1-3 points)
          score += Math.floor(Math.random() * 3) + 1;
          
          return { ...product, score };
        });
      
      // Sort by score (descending) and take top N
      return productsWithScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ score, ...product }) => product as Product); // Remove score property
    } catch (error) {
      errorService.handleError(error, 'warning', { context: 'RecommendationService.getRecommendations' });
      return [];
    }
  }
  
  /**
   * Get recently viewed products
   * @returns Array of product IDs
   */
  getRecentlyViewedProductIds(): string[] {
    return [...this.viewedProducts];
  }
  
  /**
   * Save user data to cookies
   */
  private saveUserData(): void {
    if (!cookieService.isCategoryAllowed('functional')) return;
    
    try {
      const userData = {
        viewed: this.viewedProducts,
        categories: this.categoryWeights,
        priceRange: this.priceRangePreference
      };
      
      cookieService.set('user_pref', JSON.stringify(userData), {
        expires: 30,        // 30 days
        path: '/',
        sameSite: 'strict'
      });
    } catch (error) {
      errorService.handleError(error, 'warning', { context: 'RecommendationService.saveUserData' });
    }
  }
  
  /**
   * Load user data from cookies
   */
  private loadUserData(): void {
    try {
      if (!cookieService.isCategoryAllowed('functional')) return;
      
      const userDataStr = cookieService.get('user_pref');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        
        if (userData.viewed && Array.isArray(userData.viewed)) {
          this.viewedProducts = userData.viewed;
        }
        
        if (userData.categories && typeof userData.categories === 'object') {
          this.categoryWeights = userData.categories;
        }
        
        if (userData.priceRange && 
            typeof userData.priceRange === 'object' &&
            typeof userData.priceRange.min === 'number' &&
            typeof userData.priceRange.max === 'number') {
          this.priceRangePreference = userData.priceRange;
        }
        
        logService.debug('Loaded user data from cookies');
      }
    } catch (error) {
      errorService.handleError(error, 'warning', { context: 'RecommendationService.loadUserData' });
    }
  }
  
  /**
   * Clear all user preferences
   */
  clearUserData(): void {
    this.viewedProducts = [];
    this.userPreferences = {};
    this.categoryWeights = {};
    this.priceRangePreference = null;
    
    cookieService.delete('user_pref');
    logService.debug('Cleared user preference data');
  }
}

// Export a singleton instance
export const recommendationService = new RecommendationService();
