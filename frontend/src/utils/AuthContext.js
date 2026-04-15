import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from './authService';
import { logLoginActivity } from '../services/activityLogService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: subscription } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        authService.getCurrentUser().then(setUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.login(email, password);
      setUser(result.user);
      
      // Log login activity
      if (result.user?.id && result.user?.name) {
        await logLoginActivity(result.user.id, result.user.name);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'Admin';

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
