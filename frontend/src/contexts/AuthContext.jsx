import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  const isAuthenticated = !!token;

  const login = useCallback((newToken, user) => {
    localStorage.setItem('token', newToken);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_image');
    setToken('');
    setProfile(null);
    setProfileError('');
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setProfileLoading(true);
    setProfileError('');

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        setProfileError(data.message || 'Gagal mengambil data profile');
        return;
      }

      setProfile(data.results);
      localStorage.setItem('user_image', data.results?.user_image || '');
    } catch (err) {
      setProfileError('Terjadi kesalahan saat mengambil profile');
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  }, [token, logout]);

  const updateProfile = useCallback(async (formData) => {
    if (!token) return { ok: false, message: 'Unauthorized' };

    setProfileLoading(true);
    setProfileError('');

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return { ok: false, message: 'Unauthorized', unauthorized: true };
        }
        return { ok: false, message: data.message || 'Gagal mengupdate profile' };
      }

      setProfile(data.results);
      localStorage.setItem('user_image', data.results?.user_image || '');
      return { ok: true, data: data.results };
    } catch (err) {
      console.error(err);
      return { ok: false, message: 'Terjadi kesalahan saat mengupdate profile' };
    } finally {
      setProfileLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [token, fetchProfile]);

  const value = useMemo(() => ({
    token,
    isAuthenticated,
    profile,
    profileLoading,
    profileError,
    login,
    logout,
    fetchProfile,
    updateProfile,
    setProfile,
  }), [token, isAuthenticated, profile, profileLoading, profileError, login, logout, fetchProfile, updateProfile]);

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
