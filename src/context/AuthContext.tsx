import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, you'd verify a token from localStorage or a cookie
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    // This is a mock login. In a real app, you'd get this from an API response.
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
