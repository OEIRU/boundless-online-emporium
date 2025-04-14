
import { errorService } from './ErrorService';
import { logService } from './LogService';
import { getCsrfToken, generateCsrfToken, storeCsrfToken } from '@/utils/security';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Request options type
type RequestOptions = {
  headers?: Record<string, string>;
  withCredentials?: boolean;
  skipAuthHeader?: boolean;
};

class ApiService {
  private token: string | null = null;
  private requestInterceptors: ((config: RequestInit) => RequestInit)[] = [];
  private responseInterceptors: ((response: Response) => Promise<Response>)[] = [];
  
  constructor() {
    // Initialize CSRF token
    const csrfToken = getCsrfToken() || generateCsrfToken();
    storeCsrfToken(csrfToken);
    
    // Initialize token from localStorage
    this.token = localStorage.getItem('token');
  }
  
  /**
   * Set authentication token
   * @param token JWT token
   */
  setToken(token: string | null): void {
    this.token = token;
    
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
  
  /**
   * Get the current token
   * @returns Current token or null if not set
   */
  getToken(): string | null {
    return this.token;
  }
  
  /**
   * Add request interceptor
   * @param interceptor Function that receives and returns request config
   */
  addRequestInterceptor(interceptor: (config: RequestInit) => RequestInit): void {
    this.requestInterceptors.push(interceptor);
  }
  
  /**
   * Add response interceptor
   * @param interceptor Function that receives and returns response
   */
  addResponseInterceptor(interceptor: (response: Response) => Promise<Response>): void {
    this.responseInterceptors.push(interceptor);
  }
  
  /**
   * Process request config through all interceptors
   * @param config Request config
   * @returns Processed config
   */
  private processRequestInterceptors(config: RequestInit): RequestInit {
    return this.requestInterceptors.reduce(
      (acc, interceptor) => interceptor(acc),
      config
    );
  }
  
  /**
   * Process response through all interceptors
   * @param response Response object
   * @returns Processed response
   */
  private async processResponseInterceptors(response: Response): Promise<Response> {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse.clone());
    }
    
    return processedResponse;
  }
  
  /**
   * Make a request to the API
   * @param method HTTP method
   * @param endpoint API endpoint
   * @param data Request data
   * @param options Request options
   * @returns Promise with response data
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add CSRF token for non-GET requests
    if (method !== 'GET') {
      headers['X-CSRF-Token'] = getCsrfToken() || '';
    }
    
    // Add auth token if available and not explicitly skipped
    if (this.token && !options.skipAuthHeader) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    // Prepare request config
    let config: RequestInit = {
      method,
      headers,
      credentials: options.withCredentials ? 'include' : 'same-origin',
      body: data ? JSON.stringify(data) : undefined,
    };
    
    // Process through request interceptors
    config = this.processRequestInterceptors(config);
    
    try {
      // Make the request
      const response = await fetch(url, config);
      
      // Process through response interceptors
      const processedResponse = await this.processResponseInterceptors(response);
      
      // Handle error status codes
      if (!processedResponse.ok) {
        let errorMessage = `Request failed with status ${processedResponse.status}`;
        let errorData: any = null;
        
        try {
          errorData = await processedResponse.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, continue with default error message
        }
        
        const error = new Error(errorMessage);
        (error as any).status = processedResponse.status;
        (error as any).data = errorData;
        
        throw error;
      }
      
      // For 204 No Content
      if (processedResponse.status === 204) {
        return {} as T;
      }
      
      // Parse response
      return await processedResponse.json();
    } catch (error) {
      // Log the error
      errorService.handleError(error, 'error', {
        context: 'ApiService.request',
        method,
        url,
        data,
      });
      
      throw error;
    }
  }
  
  /**
   * Make a GET request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns Promise with response data
   */
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }
  
  /**
   * Make a POST request
   * @param endpoint API endpoint
   * @param data Request data
   * @param options Request options
   * @returns Promise with response data
   */
  post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }
  
  /**
   * Make a PUT request
   * @param endpoint API endpoint
   * @param data Request data
   * @param options Request options
   * @returns Promise with response data
   */
  put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }
  
  /**
   * Make a PATCH request
   * @param endpoint API endpoint
   * @param data Request data
   * @param options Request options
   * @returns Promise with response data
   */
  patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  }
  
  /**
   * Make a DELETE request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns Promise with response data
   */
  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Setup default interceptors
apiService.addResponseInterceptor(async (response) => {
  // Log all responses for debugging
  const responseClone = response.clone();
  const url = responseClone.url;
  const status = responseClone.status;
  
  try {
    // Only log if not a 401 (to avoid logging failed auth attempts)
    if (status !== 401) {
      const data = await responseClone.json();
      logService.debug(`API Response: ${url}`, { status, data });
    }
  } catch (e) {
    // If response is not JSON, just log the status
    logService.debug(`API Response: ${url}`, { status });
  }
  
  return response;
});
