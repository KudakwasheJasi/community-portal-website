import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import authService from '@/services/auth.service';
import { User, AuthResponse } from '@/types/auth';
import { NotificationSounds } from '@/utils/notificationSounds';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, mobileNumber: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleAuthResponse = (data: AuthResponse) => {
    authService.setAuthData(data);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      handleAuthResponse(data);
      // Play login success sound and wait for it to finish
      await NotificationSounds.playLogin();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, mobileNumber: string) => {
    try {
      const data = await authService.register({
        name,
        email,
        password,
        confirmPassword: password,
        mobileNumber,
      });
      handleAuthResponse(data);
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.clearAuthData();
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const updateProfile = (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);

      // Don't store avatar in localStorage to avoid quota exceeded errors
      const userForStorage = { ...updatedUser };
      delete userForStorage.avatar;

      localStorage.setItem('user', JSON.stringify(userForStorage));
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
