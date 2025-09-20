import React, { createContext, useContext, useEffect, useState } from 'react';
import { userApi } from '../api/userApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Single init effect
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // validate token + refresh user
          const res = await userApi.getUserDetails();
          setUser(res.data);
          setToken(storedToken);
          localStorage.setItem('user', JSON.stringify(res.data)); // keep fresh
        } catch (error) {
          // token invalid → clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await userApi.signin(credentials);
      if (response.success) {
        const { token, data } = response;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setToken(token);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      return await userApi.signup(userData);
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await userApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await userApi.updateProfile(userData);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  const isAuthenticated = () => !!token && !!user;
  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
