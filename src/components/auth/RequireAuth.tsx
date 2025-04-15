
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { getCsrfToken, generateCsrfToken, storeCsrfToken, validateCsrfToken } from '@/utils/security';
import { logService } from "@/services/LogService";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isLoading, refreshToken } = useAuth();
  const location = useLocation();

  // Ensure CSRF token is available and valid
  useEffect(() => {
    const currentToken = getCsrfToken();
    if (!currentToken || !validateCsrfToken(currentToken)) {
      const newToken = generateCsrfToken();
      storeCsrfToken(newToken);
      logService.debug('Generated new CSRF token');
    }
  }, []);
  
  // Periodically refresh the authentication token
  useEffect(() => {
    if (isAuthenticated) {
      // Try to refresh the token every 20 minutes
      const refreshInterval = setInterval(() => {
        refreshToken?.();
      }, 20 * 60 * 1000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, refreshToken]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
