import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../models/User";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<any>;
  error: any;
  fetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response: any = await userService.myProfile();
      if (response.statusCode === 200) {
        setUser(response.data);
      } else {
        setUser(null);
        setError(response.message);
      }
    } catch (err) {
      setUser(null);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ fetchUser, user, error, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
