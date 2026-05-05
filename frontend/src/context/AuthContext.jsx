import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true on first mount while we verify token

  // On app load, check if a valid token exists and hydrate user state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axiosInstance.get("/auth/me");
        setUser(data);
      } catch {
        // Token invalid or expired — clear storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
  const { data } = await axiosInstance.post("/auth/login", {
    email,
    password
  });

  localStorage.setItem("access_token", data.token || data.access_token);

  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }

  setUser(data.user);
  return data.user;
}, []);
  const register = useCallback(async (name, email, password) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", {
      name,
      email,
      password
    });

    localStorage.setItem("access_token", data.token || data.access_token);
    if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

    setUser(data.user);
    return data.user;

  } catch (err) {
    console.log("REGISTER ERROR:", err.response?.data);
    throw err; // important so UI can show error
  }
}, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  }, []);

  const value = { user, loading, login, register, logout, updateUser, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for clean imports throughout the app
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;