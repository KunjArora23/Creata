import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh access token
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
    // Fetch user info from backend to check login status
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/profile/me");
        console.log("AuthContext");
        console.log(res.data.data);
        setUser(res.data.data); // backend returns { data: user }
      } catch (error) {
        // Only set user to null if it's not a 401 error (handled by interceptor)
        if (error.response?.status !== 401) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Set up periodic token refresh (every 10 minutes) taki logout na ho jaye 
  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(refreshToken, 10 * 60 * 1000); // 10 minutes
      
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