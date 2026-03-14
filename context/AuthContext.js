"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
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

function getTokenTimeLeft(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return Infinity;
    return decoded.exp * 1000 - Date.now();
  } catch {
    return 0;
  }
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);
  const timerRef = useRef(null);
  const warningRef = useRef(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCustomer(null);
    setSessionWarning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
  }, []);

  const setupSessionTimers = useCallback((tokenValue) => {
    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    const timeLeft = getTokenTimeLeft(tokenValue);
    if (timeLeft <= 0) {
      clearSession();
      return;
    }

    // Show warning 5 minutes before expiry
    const warningTime = Math.max(timeLeft - 5 * 60 * 1000, 0);
    if (warningTime > 0) {
      warningRef.current = setTimeout(() => {
        setSessionWarning(true);
      }, warningTime);
    } else {
      setSessionWarning(true);
    }

    // Auto-logout when token expires
    timerRef.current = setTimeout(() => {
      clearSession();
    }, timeLeft);
  }, [clearSession]);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken && !isTokenExpired(storedToken)) {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setCustomer(decoded);
        setupSessionTimers(storedToken);
      } else {
        clearSession();
      }
    } catch (err) {
      console.warn("Auth init failed, clearing local storage", err);
      clearSession();
    } finally {
      setLoading(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, []);

  const login = (tokenValue) => {
    try {
      localStorage.setItem("token", tokenValue);
      const decoded = jwtDecode(tokenValue);
      setToken(tokenValue);
      setCustomer(decoded);
      setSessionWarning(false);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...decoded, token: tokenValue })
      );
      setupSessionTimers(tokenValue);
    } catch (err) {
      console.error("Auth login error:", err);
    }
  };

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const dismissWarning = useCallback(() => {
    setSessionWarning(false);
  }, []);

  return (
    <AuthContext.Provider value={{ customer, token, login, logout, loading, sessionWarning, dismissWarning }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
