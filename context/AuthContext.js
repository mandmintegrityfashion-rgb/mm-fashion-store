"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && !isTokenExpired(storedToken)) {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setCustomer(decoded);
      } else {
        // Token expired or missing - clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setCustomer(null);
      }
    } catch (err) {
      console.warn("Auth init failed, clearing local storage", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (tokenValue) => {
    try {
      localStorage.setItem("token", tokenValue);
      const decoded = jwtDecode(tokenValue);
      setToken(tokenValue);
      setCustomer(decoded);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...decoded, token: tokenValue })
      );
    } catch (err) {
      console.error("Auth login error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
