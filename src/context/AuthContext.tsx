import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/api/endpoints/auth';

// =============================================================================
// Types
// =============================================================================

export interface AuthContextType {
  loginKey: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string) => Promise<boolean>;
  logout: () => void;
}

// =============================================================================
// Context
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// Provider
// =============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [loginKey, setLoginKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedLoginKey = localStorage.getItem('login_key');

    if (storedLoginKey) {
      setLoginKey(storedLoginKey);
    }

    setLoading(false);
  }, []);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(email, password);

      // Check for API error
      if (response.error) {
        setError(response.error.message || 'Login failed');
        return false;
      }

      // Check if login_key was returned
      if (!response.login_key) {
        setError('Login failed: No login key received');
        return false;
      }

      // Save to localStorage
      localStorage.setItem('login_key', response.login_key);

      // Update state
      setLoginKey(response.login_key);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new passwordless account
   * Note: API creates passwordless account - user must set password separately
   */
  const register = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(email);

      // Check for API error
      if (response.error) {
        setError(response.error.message || 'Registration failed');
        return false;
      }

      // Check if registration was successful
      if (!response.success) {
        setError('Registration failed');
        return false;
      }

      // Registration successful - user needs to set password
      setError(null);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Registration error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout - clear session and localStorage
   */
  const logout = (): void => {
    try {
      // Call logout API if we have a login key
      if (loginKey) {
        authAPI.logout(loginKey).catch((err) => {
          console.error('Logout API call failed:', err);
        });
      }

      // Clear all user-related data from localStorage
      localStorage.removeItem('login_key');
      localStorage.removeItem('user');
      localStorage.removeItem('cart_id');
      localStorage.removeItem('cart_items');
      localStorage.removeItem('checkout_url');

      // Clear state
      setLoginKey(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value: AuthContextType = {
    loginKey,
    isAuthenticated: !!loginKey,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Custom hook to use the AuthContext
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
