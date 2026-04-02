import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Create a custom hook to use the AuthContext easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // State to hold the logged-in user details
  // Example state: { role: 'Manager', name: 'Admin', id: 'HM1001' }
  const [user, setUser] = useState(null); 

  const login = (userData) => {
    setUser(userData);
    // Future: Save JWT to localStorage here
  };

  const logout = () => {
    setUser(null);
    // Future: Clear JWT from localStorage here
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};