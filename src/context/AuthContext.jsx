import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setTokens, clearTokens, getToken, getRefreshToken } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Demo token bypass
      if (token === 'demo_token_secops_lead') {
        setUser({
          id: 99,
          email: 'secops.lead@cloudvuln.io',
          full_name: 'Ananthapriyan M',
          role: 'SecOps Lead',
          is_active: true,
          created_at: new Date().toISOString(),
        });
        setLoading(false);
        return;
      }

      try {
        const userData = await api.me();
        setUser(userData);
      } catch {
        // Token invalid/expired — try refresh
        if (getRefreshToken()) {
          try {
            const refreshed = await api.refresh();
            setTokens(refreshed.access_token, refreshed.refresh_token);
            setUser(refreshed.user);
          } catch {
            clearTokens();
          }
        } else {
          clearTokens();
        }
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await api.login(email, password);
      setTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (email, password, fullName, role = 'SecOps Lead') => {
    try {
      const data = await api.register(email, password, fullName, role);
      setTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const demoLogin = useCallback(() => {
    const demoUser = {
      id: 99,
      email: 'secops.lead@cloudvuln.io',
      full_name: 'Alex Mercer',
      role: 'SecOps Lead',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setTokens('demo_token_secops_lead', null);
    setUser(demoUser);
    return { success: true, user: demoUser };
  }, []);

  const logout = useCallback(async () => {
    try {
      if (getToken() && getToken() !== 'demo_token_secops_lead') {
        await api.logout();
      }
    } catch { /* ignore */ }
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: getToken(),
        isAuthenticated: !!user,
        loading,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
