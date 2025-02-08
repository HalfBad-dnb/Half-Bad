import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context for authentication
const AuthContext = createContext();

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);  // New state to manage the user's role

  useEffect(() => {
    try {
      // Check if the user is already logged in (persist session)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setUserRole(parsedUser.role);  // Set role when user data is loaded
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      setUserRole(null);  // Clear role as well
    }
  }, []);

  // Login function to set user, role, and authentication status
  const login = (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      setUserRole(userData.role);  // Set the user's role when they log in
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Logout function to clear user data, role, and authentication status
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserRole(null);  // Clear role on logout
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
