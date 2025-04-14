
/**
 * Sanitize HTML string to prevent XSS attacks
 * @param html HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Create a new div element
  const tempDiv = document.createElement('div');
  
  // Set the HTML content with textContent to ensure it's treated as text
  tempDiv.textContent = html;
  
  // Return the sanitized HTML
  return tempDiv.innerHTML;
}

/**
 * Validate that a string is safe (no scripts, no special characters)
 * @param input String to validate
 * @returns True if string is safe
 */
export function isStringSafe(input: string): boolean {
  if (!input) return true;
  
  // Check for potentially dangerous patterns
  const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const eventPattern = /\bon\w+\s*=/gi; // onclick, onload, etc
  const dangerousTagsPattern = /<(iframe|object|embed|form)\b[^>]*>/gi;
  
  return !(
    scriptPattern.test(input) ||
    eventPattern.test(input) ||
    dangerousTagsPattern.test(input)
  );
}

/**
 * Validate email format
 * @param email Email to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  // Basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Object with validation result
 */
export function validatePassword(password: string): { 
  isValid: boolean; 
  message?: string;
  score: number; // 0-4 strength score
} {
  if (!password) {
    return { isValid: false, message: 'Пароль не может быть пустым', score: 0 };
  }
  
  // Calculate password strength score (0-4)
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special character
  
  // Normalize score to 0-4 range
  score = Math.min(4, score);
  
  // Validation result
  let isValid = score >= 2; // At least medium strength
  let message;
  
  if (!isValid) {
    message = 'Пароль должен содержать не менее 8 символов, включая буквы и цифры';
  }
  
  return { isValid, message, score };
}

/**
 * Generate a CSRF token
 * @returns CSRF token
 */
export function generateCsrfToken(): string {
  // Generate a random string
  const randomStr = Math.random().toString(36).substring(2, 15);
  
  // Get current timestamp
  const timestamp = Date.now().toString(36);
  
  // Combine and return
  return `${randomStr}_${timestamp}`;
}

/**
 * Store CSRF token in session storage
 * @param token CSRF token
 */
export function storeCsrfToken(token: string): void {
  sessionStorage.setItem('csrf_token', token);
}

/**
 * Get stored CSRF token from session storage
 * @returns CSRF token or null if not found
 */
export function getCsrfToken(): string | null {
  return sessionStorage.getItem('csrf_token');
}

/**
 * Validate CSRF token
 * @param token CSRF token to validate
 * @returns True if token is valid
 */
export function validateCsrfToken(token: string): boolean {
  const storedToken = getCsrfToken();
  return !!storedToken && storedToken === token;
}
