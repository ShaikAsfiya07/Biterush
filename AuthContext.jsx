import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check if user is already logged in
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('foodkart_current_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse current user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup functionality
  const signup = (name, email, password) => {
    try {
      // Get all registered users or initialize empty list
      const users = JSON.parse(localStorage.getItem('foodkart_registered_users') || '[]');
      
      // Check if user already exists
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return { success: false, message: 'Email is already registered. Please login.' };
      }

      // Add new user
      const newUser = { id: 'usr_' + Date.now(), name, email, password };
      users.push(newUser);
      localStorage.setItem('foodkart_registered_users', JSON.stringify(users));
      
      return { success: true, message: 'Signup successful! Redirecting to login...' };
    } catch (error) {
      return { success: false, message: 'An error occurred during signup. Please try again.' };
    }
  };

  // Login functionality
  const login = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('foodkart_registered_users') || '[]');
      
      // Find user
      const authenticatedUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!authenticatedUser) {
        return { success: false, message: 'Invalid email or password.' };
      }

      // Exclude password from the session state
      const sessionUser = {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        email: authenticatedUser.email
      };

      setUser(sessionUser);
      localStorage.setItem('foodkart_current_user', JSON.stringify(sessionUser));
      return { success: true, message: 'Welcome back, ' + sessionUser.name + '!' };
    } catch (error) {
      return { success: false, message: 'An error occurred during login. Please try again.' };
    }
  };

  // Logout functionality
  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodkart_current_user');
    return { success: true, message: 'Logged out successfully.' };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
