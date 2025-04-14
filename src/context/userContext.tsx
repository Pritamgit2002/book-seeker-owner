"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Define interfaces for clarity
interface User {
  name: string;
  email: string;
  type: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// Default user state
const defaultUser: User = { name: "", email: "", type: "" };

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  initialUser = defaultUser,
}: {
  children: ReactNode;
  initialUser?: User;
}) => {
  // Initialize state from localStorage if available, otherwise use initialUser
  const [user, setUserState] = useState<User>(() => {
    // This code only runs on the client side
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          return initialUser;
        }
      }
    }
    return initialUser;
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Custom setUser function that updates state and localStorage
  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  // Function to clear user data (for logout)
  const clearUser = () => {
    setUserState(defaultUser);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
