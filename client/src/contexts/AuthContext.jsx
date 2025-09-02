import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const refreshToken = async () => {
    try {
      await api.get("/api/auth/refresh-access-token");
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout the user
      setUser(null);
    }
  };

  useEffect(() => {
   
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/profile/me");
        console.log("AuthContext");
        console.log(res.data.data);
        setUser(res.data.data); 
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // yaha set interval refresh token wala function har 10 min me call kr rha h
  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(refreshToken, 10 * 60 * 1000); 
      
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/signin", { email, password });
    console.log(res)
    setUser(res.data.user);
    return res;
  };

  const register = async (data) => {
    const res = await api.post("/api/auth/signup", data);
    return res;
  };

  const logout = async () => {
    try {
      await api.get("/api/auth/signout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );  
};

export default AuthContext; 