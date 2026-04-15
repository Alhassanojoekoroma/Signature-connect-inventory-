import { supabase } from './supabaseClient';

/**
 * Authentication Service
 * Handles Supabase Auth operations
 */

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user details including role from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: userData.name,
          role: userData.role,
        },
        session: data.session,
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Logout current user
   */
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  /**
   * Get current session
   */
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  /**
   * Get current user with role
   */
  getCurrentUser: async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return null;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      return {
        id: user.id,
        email: user.email,
        name: userData.name,
        role: userData.role,
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Check if user is admin
   */
  isAdmin: async () => {
    try {
      const user = await authService.getCurrentUser();
      return user?.role === 'Admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  /**
   * Watch auth state changes (listener)
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

export default authService;
