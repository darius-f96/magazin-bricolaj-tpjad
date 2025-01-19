import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(null);

  const refreshAuthToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      setToken(data.accessToken); 
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  }, [refreshToken]);

  useEffect(() => {
    const handleToken = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp < now) { 
            await refreshAuthToken(); 
          } else {
            setUser({ username: decoded.sub, role: decoded.role });
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          logout(); // Handle invalid token (e.g., logout)
        }
      } else {
        setUser(null);
      }
    };

    handleToken();
  }, [token, refreshAuthToken]); 

  const login = async ({ accessToken, refreshToken }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);