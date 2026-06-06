import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, authStorage, refreshAccessToken } from '../../../lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
  organizationName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, organizationName: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      let storedToken = authStorage.getToken();
      const storedUser = authStorage.getUser();

      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          const isExpired = typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();

          if (isExpired && authStorage.getRefreshToken()) {
            storedToken = await refreshAccessToken();
          }

          if (storedToken && isMounted) {
            setToken(storedToken);
            setUser(storedUser || {
              id: payload.userId,
              email: payload.email || 'user',
              name: payload.name || 'User',
              role: payload.role,
              organizationId: payload.organizationId,
            });
          }
        } catch {
          authStorage.clearSession();
        }
      }

      if (isMounted) setIsLoading(false);
    };

    const handleForcedLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    initializeSession();

    return () => {
      isMounted = false;
      window.removeEventListener('auth:logout', handleForcedLogout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, refreshToken, user } = res.data;
    authStorage.setSession(token, refreshToken, user);
    setToken(token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string, organizationName: string) => {
    const res = await api.post('/auth/register', { name, email, password, organizationName });
    const { token, refreshToken, user } = res.data;
    authStorage.setSession(token, refreshToken, user);
    setToken(token);
    setUser(user);
  };

  const logout = async () => {
    const refreshToken = authStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
    } finally {
      authStorage.clearSession();
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
