"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load compare list from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("compareList");
    setCompareList(stored ? JSON.parse(stored) : []);
    setIsMounted(true);
  }, []);

  // Persist to localStorage whenever compare list changes
  useEffect(() => {
    if (isMounted) {
      if (compareList.length > 0) {
        localStorage.setItem("compareList", JSON.stringify(compareList));
      } else {
        localStorage.removeItem("compareList");
      }
    }
  }, [compareList, isMounted]);

  // Add product to compare
  const addToCompare = useCallback((product) => {
    setCompareList((prev) => {
      // Check if product already exists
      const exists = prev.some((p) => String(p._id) === String(product._id));
      if (exists) {
        return prev; // Don't add duplicates
      }
      // Limit to 5 products for comparison
      if (prev.length >= 5) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  }, []);

  // Remove product from compare
  const removeFromCompare = useCallback((productId) => {
    setCompareList((prev) =>
      prev.filter((p) => String(p._id) !== String(productId))
    );
  }, []);

  // Clear all comparisons
  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  // Check if product is in compare list
  const isInCompare = useCallback((productId) => {
    return compareList.some((p) => String(p._id) === String(productId));
  }, [compareList]);

  const value = useMemo(
    () => ({
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      compareCount: compareList.length,
    }),
    [compareList, addToCompare, removeFromCompare, clearCompare, isInCompare]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
};
