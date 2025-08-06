const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const EXPIRES_KEY = 'auth_expires';

export const tokenStorage = {
  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expires = localStorage.getItem(EXPIRES_KEY);
    
    if (token && expires) {
      const expiresAt = new Date(expires);
      if (expiresAt > new Date()) {
        return token;
      } else {
        // Token expired, clean up
        tokenStorage.clearAuth();
        return null;
      }
    }
    
    return null;
  },

  setToken: (token: string, expiresAt: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  },

  getUser: (): any => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  }
};

export const isTokenExpired = (): boolean => {
  const expires = localStorage.getItem(EXPIRES_KEY);
  if (!expires) return true;
  
  return new Date(expires) <= new Date();
};