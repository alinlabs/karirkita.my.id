
import { useState, useEffect } from 'react';

// Mock user type - Generic User
export interface User {
  id?: string;
  user_id?: string;
  name?: string;
  nama_lengkap?: string;
  email?: string;
  email_kontak?: string;
  username?: string;
  telepon_kontak?: string;
  role: 'user' | 'admin';
  avatar?: string;
  foto_profil?: string;
  [key: string]: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
      try {
          const storedUser = localStorage.getItem('auth_user');
          return storedUser ? JSON.parse(storedUser) : null;
      } catch (e) {
          console.error("Failed to parse user data", e);
          return null;
      }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
      return !!localStorage.getItem('auth_token');
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Re-verify consistency on mount, but rely on lazy init for immediate state
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (token && !storedUser) {
        // Inconsistent state: Token but no user
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
    } else if (!token && storedUser) {
        // Inconsistent state: User but no token
        localStorage.removeItem('auth_user');
        setIsAuthenticated(false);
        setUser(null);
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('auth_token', 'mock_token'); // In real app, this would be a JWT
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    
    // Dispatch a custom event so other useAuth instances can update (since we don't have a Context)
    window.dispatchEvent(new Event('auth-change'));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
  };

  // Listen for storage/auth changes to sync across tabs/components
  useEffect(() => {
      const handleAuthChange = () => {
          const token = localStorage.getItem('auth_token');
          const storedUser = localStorage.getItem('auth_user');
          
          setIsAuthenticated(!!token);
          if (storedUser) {
              try {
                  setUser(JSON.parse(storedUser));
              } catch {
                  setUser(null);
              }
          } else {
              setUser(null);
          }
      };

      window.addEventListener('storage', handleAuthChange);
      window.addEventListener('auth-change', handleAuthChange);
      
      return () => {
          window.removeEventListener('storage', handleAuthChange);
          window.removeEventListener('auth-change', handleAuthChange);
      };
  }, []);

  return { user, isAuthenticated, isLoading, login, logout };
};
