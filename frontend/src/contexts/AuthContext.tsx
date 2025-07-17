import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const user = authAPI.getCurrentUser();
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.signup(username, email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Signup failed'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.updateProfile(userData);
      // The API response may be nested under 'user' or 'data.user' depending on backend
      const updatedUser = response.user || response.data?.user || response;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update profile'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isAuthenticated, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};