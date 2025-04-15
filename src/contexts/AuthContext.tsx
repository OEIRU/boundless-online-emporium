
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    promotions: boolean;
    orderUpdates: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  phoneNumber?: string;
  birthDate?: string;
  avatar?: string;
  newsletter?: boolean;
  preferences?: UserPreferences;
  addresses?: Address[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  addAddress: (address: Omit<Address, '_id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при входе');
      }

      // Save token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      setUser(data.user);
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему",
      });
      
      navigate('/profile');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка при входе';
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при регистрации');
      }

      // Save token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      setUser(data.user);
      toast({
        title: "Успешная регистрация",
        description: "Ваш аккаунт был создан",
      });
      
      navigate('/profile');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка при регистрации';
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из системы",
    });
    navigate('/');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      if (!token || !user) {
        throw new Error('Вы не авторизованы');
      }
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...userData, userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении профиля');
      }

      // Update local storage with new user data
      const updatedUser = { ...user, ...data };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      toast({
        title: "Профиль обновлен",
        description: "Ваш профиль был успешно обновлен",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка при обновлении профиля';
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (preferences: UserPreferences) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      if (!token || !user) {
        throw new Error('Вы не авторизованы');
      }
      
      const response = await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ preferences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении настроек');
      }

      // Update local storage with new user data
      const updatedUser = { ...user, ...data };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      toast({
        title: "Настройки обновлены",
        description: "Ваши настройки были успешно обновлены",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка при обновлении настроек';
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      if (!token || !user) {
        throw new Error('Вы не авторизованы');
      }
      
      const response = await fetch('/api/users/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: avatarUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении аватара');
      }

      // Update local storage with new user data
      const updatedUser = { ...user, ...data };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      toast({
        title: "Аватар обновлен",
        description: "Ваш аватар был успешно обновлен",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка при обновлении аватара';
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (address: Omit<Address, '_id'>) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      if (!token || !user) {
        throw new Error('Вы не авторизованы');
      }
      
      const response = await fetch('/api/users/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при добавлении адреса');
      }

      // Update local storage with new user data
      const updatedUser = { 
        ...user, 
        addresses: data.addresses 
      };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      toast({
        title: "Адрес добавлен",
        description: "Ваш адрес был успешно добавлен",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка при добавлении адреса';
      toast({
        variant: "destructive",
        title: "Ошибка добавления",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (addressId: string, address: Partial<Address>) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      if (!token || !user) {
        throw new Error('Вы не авторизованы');
      }
      
      const response = await fetch(`/api/users/address/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении адреса');
      }

      // Update local storage with new user data
      const updatedUser = { 
        ...user, 
        addresses: data.addresses 
      };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      toast({
        title: "Адрес обновлен",
        description: "Ваш адрес был успешно обновлен",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка при обновлении адреса';
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      if (!token || !user) {
        throw new Error('Вы не авторизованы');
      }
      
      const response = await fetch(`/api/users/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при удалении адреса');
      }

      // Update local storage with new user data
      const updatedUser = { 
        ...user, 
        addresses: data.addresses 
      };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      toast({
        title: "Адрес удален",
        description: "Ваш адрес был успешно удален",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка при удалении адреса';
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token || !user) {
        return;
      }
      
      const response = await fetch('/api/users/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка обновления токена');
      }

      // Update token
      localStorage.setItem('authToken', data.token);
      
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      // If token refresh fails, we don't log the user out immediately
      // as they may still have a valid token
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        logout, 
        updateProfile,
        updatePreferences,
        updateAvatar,
        addAddress,
        updateAddress,
        deleteAddress,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
