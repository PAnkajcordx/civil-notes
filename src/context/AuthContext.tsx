import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { safeStorage } from '../utils/safeStorage';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  entitlements: string[]; // List of purchased product IDs
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  hasPurchased: (productId: string) => boolean;
  addEntitlement: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'cn_jwt_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => safeStorage.getItem(TOKEN_KEY));
  const [entitlements, setEntitlements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check current session from /api/auth/me
  const refreshAuth = async () => {
    try {
      const currentToken = safeStorage.getItem(TOKEN_KEY);
      if (!currentToken) {
        setUser(null);
        setEntitlements([]);
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEntitlements(data.entitlements || []);
      } else {
        // Token invalid or expired
        safeStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setEntitlements([]);
      }
    } catch (err) {
      console.warn('Failed to verify current auth session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }

      safeStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setEntitlements(data.entitlements || []);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network connection error during login.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      safeStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setEntitlements(data.entitlements || []);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network connection error during registration.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    safeStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setEntitlements([]);
  };

  const hasPurchased = (productId: string): boolean => {
    if (user?.role === 'admin') return true; // Admins have full access
    return entitlements.includes(productId);
  };

  const addEntitlement = (productId: string) => {
    setEntitlements(prev => (prev.includes(productId) ? prev : [...prev, productId]));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        entitlements,
        isLoading,
        login,
        register,
        logout,
        refreshAuth,
        hasPurchased,
        addEntitlement,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
