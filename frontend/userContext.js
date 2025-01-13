import React, { createContext, useState, useContext } from "react";

// Create a context for user data
const UserContext = createContext();

// Custom hook to use user context
export const useUser = () => {
  return useContext(UserContext);
};

// Provider component to wrap around the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    token: "",
  });

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user data (logout)
  const logout = () => {
    setUser({
      name: "",
      email: "",
      phone: "",
      token: "",
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
