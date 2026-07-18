import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [completedTopics, setCompletedTopics] = useState([]);

  useEffect(() => {
    if (user) {
      const savedXp = localStorage.getItem(`xp_${user.email || user.username}`);
      const savedTopics = localStorage.getItem(`completed_topics_${user.email || user.username}`);
      if (savedXp) setXp(parseInt(savedXp, 10));
      else setXp(0);
      if (savedTopics) setCompletedTopics(JSON.parse(savedTopics));
      else setCompletedTopics([]);
    } else {
      setXp(0);
      setCompletedTopics([]);
    }
  }, [user]);

  const earnXp = (amount) => {
    if (!user) return;
    setXp(prev => {
      const next = prev + amount;
      localStorage.setItem(`xp_${user.email || user.username}`, next.toString());
      return next;
    });
  };

  const completeTopic = (topicId, xpReward) => {
    if (!user) return;
    setCompletedTopics(prev => {
      if (prev.includes(topicId)) return prev;
      const next = [...prev, topicId];
      localStorage.setItem(`completed_topics_${user.email || user.username}`, JSON.stringify(next));
      earnXp(xpReward);
      return next;
    });
  };

  // Authenticate using the ID token returned from Google
  const loginWithGoogle = async (credential, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential, role }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === 'Failed to fetch') throw new Error('Cannot reach the server. Make sure the backend is running on port 5000.');
      throw err;
    }
  };

  // Local sign up (via HTML form)
  const signupLocal = async (username, full_name, email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, full_name, email, password, role }),
      });

      let data;
      try { data = await response.json(); } catch { throw new Error('Server is not running or returned an invalid response.'); }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message === 'Failed to fetch') throw new Error('Cannot reach the server. Make sure the backend is running on port 5000.');
      throw err;
    }
  };

  // Local sign in (via HTML form)
  const loginLocal = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try { data = await response.json(); } catch { throw new Error('Server is not running or returned an invalid response.'); }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === 'Failed to fetch') throw new Error('Cannot reach the server. Make sure the backend is running on port 5000.');
      throw err;
    }
  };


  // Perform logout by revoking the refresh token on the backend
  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.error('Logout API call error:', err);
    } finally {
      // Always clear local storage and user state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  // Helper to attempt refreshing the access token
  const refreshSession = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.accessToken) {
        throw new Error('Failed to refresh token');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.accessToken;
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      throw err;
    }
  };

  // Fetch the current user profile using the access token
  const fetchProfile = async (token) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 && data.message === 'Token Expired') {
        // Access token expired, attempt to refresh and try again
        const newToken = await refreshSession();
        return fetchProfile(newToken);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      setUser(data.user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Clean up session if profile fetch fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  // Initialize session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetchProfile(token);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Wrapper for authenticated fetch requests (with auto token refresh)
  const authenticatedFetch = async (url, options = {}) => {
    let token = localStorage.getItem('accessToken');
    
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      try {
        const newToken = await refreshSession();
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      } catch (err) {
        console.error('Re-authentication failed. User logged out.');
        throw err;
      }
    }

    return response;
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    signupLocal,
    loginLocal,
    logout,
    authenticatedFetch,
    xp,
    earnXp,
    completedTopics,
    completeTopic
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
