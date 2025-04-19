type CookieOptions = {
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

class CookieService {
  /**
   * Set cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (options.expires) {
      if (typeof options.expires === 'number') {
        const days = options.expires;
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        options.expires = date;
      }
      
      if (options.expires instanceof Date) {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      } else {
        cookieString += `; expires=${options.expires}`;
      }
    }
    
    if (options.path) {
      cookieString += `; path=${options.path}`;
    } else {
      cookieString += '; path=/'; // Default path
    }
    
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }
    
    if (options.secure) {
      cookieString += '; secure';
    }
    
    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }
    
    document.cookie = cookieString;
  }
  
  /**
   * Get cookie by name
   * @param name Cookie name
   * @returns Cookie value or empty string if not found
   */
  get(name: string): string {
    const matches = document.cookie.match(new RegExp(
      `(?:^|; )${encodeURIComponent(name).replace(/[[\]/+()^$|{}]/g, '\\$&')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(matches[1]) : '';
  }
  
  /**
   * Check if cookie exists
   * @param name Cookie name
   * @returns true if cookie exists
   */
  exists(name: string): boolean {
    return this.get(name) !== '';
  }
  
  /**
   * Delete cookie
   * @param name Cookie name
   * @param options Cookie options (only path and domain are relevant)
   */
  delete(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0) // Set expiration to past date to delete the cookie
    });
  }
  
  /**
   * Get all cookies as an object
   * @returns Object with all cookies
   */
  getAll(): Record<string, string> {
    return document.cookie
      .split('; ')
      .reduce((result: Record<string, string>, cookie) => {
        if (cookie) {
          const [name, value] = cookie.split('=');
          result[decodeURIComponent(name)] = decodeURIComponent(value);
        }
        return result;
      }, {});
  }
  
  /**
   * Set consent status for cookies
   * @param categories Object with consent status for each category
   */
  setConsent(categories: Record<string, boolean>): void {
    this.set('cookie_consent', JSON.stringify(categories), {
      expires: 365, // Store for 1 year
      path: '/',
      sameSite: 'strict'
    });
    
    // If marketing cookies are rejected, delete existing ones
    if (categories.marketing === false) {
      // Delete marketing related cookies
      // Example: this.delete('_fbp');
    }
    
    // If analytics cookies are rejected, delete existing ones
    if (categories.analytics === false) {
      // Delete analytics related cookies
      // Example: this.delete('_ga');
    }
  }
  
  /**
   * Get consent status
   * @returns Object with consent status for each category
   */
  getConsent(): Record<string, boolean> {
    const consent = this.get('cookie_consent');
    if (consent) {
      try {
        return JSON.parse(consent);
      } catch (e) {
        return { necessary: true };
      }
    }
    return { necessary: true }; // Necessary cookies are always allowed
  }
  
  /**
   * Check if a specific cookie category is allowed
   * @param category Cookie category
   * @returns true if category is allowed
   */
  isCategoryAllowed(category: string): boolean {
    const consent = this.getConsent();
    return consent[category] === true;
  }

  /**
   * Sync user preferences with server after login
   * @param userId User ID for preferences sync
   */
  async syncUserPreferences(userId: string): Promise<void> {
    try {
      // Get all current preferences
      const localPreferences = this.getAll();
      
      // Send to server
      await fetch('/api/users/preferences/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          userId,
          preferences: localPreferences
        })
      });
    } catch (error) {
      console.error('Error syncing preferences:', error);
    }
  }

  /**
   * Load user preferences from server
   * @param userId User ID to load preferences for
   */
  async loadUserPreferences(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/preferences/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const serverPreferences = await response.json();
        
        // Update local cookies with server data
        Object.entries(serverPreferences).forEach(([key, value]) => {
          if (key !== 'cookie_consent') { // Don't override consent settings
            this.set(key, String(value), {
              expires: 365,
              path: '/',
              sameSite: 'strict'
            });
          }
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }
}

// Export a singleton instance
export const cookieService = new CookieService();
