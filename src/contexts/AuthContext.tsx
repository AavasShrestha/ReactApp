import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType, ApiError } from '../types';
import { authApi } from '../services/api';
import { tokenStorage } from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = tokenStorage.getToken();
      const storedUser = tokenStorage.getUser();
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);

      // Store auth data
      tokenStorage.setToken(response.Token, '2099-12-31T23:59:59Z'); // No expiresAt in response, set far future
      tokenStorage.setUser(response.UserDetail);

      // Update state
      setToken(response.Token);
      setUser(response.UserDetail);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear storage
    tokenStorage.clearAuth();
    
    // Clear state
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};