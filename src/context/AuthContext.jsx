import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userId'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'user');

  const login = (userId, role) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole('user');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
