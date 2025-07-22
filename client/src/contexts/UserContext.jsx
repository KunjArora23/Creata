import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import AuthContext from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/profile/me");
      setProfile(res.data.data);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    const res = await api.put("/api/profile/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProfile(res.data.data);
    return res;
  };

  return (
    <UserContext.Provider value={{ profile, loading, fetchProfile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 