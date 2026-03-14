"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "@/context/AuthContext";

export const ViewHistoryContext = createContext();

export function ViewHistoryProvider({ children }) {
  const { customer, token } = useAuth();
  const [viewedProducts, setViewedProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("viewedProducts");
      if (saved) {
        const parsed = JSON.parse(saved);
        setViewedProducts(Array.isArray(parsed) ? parsed : []);
      }
      setIsLoaded(true);
    } catch (err) {
      // Failed to load view history, continue with empty state
      setIsLoaded(true);
    }
  }, []);

  // Track when a product is viewed
  const addViewedProduct = useCallback(
    (productId, productData = {}) => {
      setViewedProducts((prev) => {
        // Remove if already exists, then add to front (most recent first)
        const filtered = prev.filter((p) => p.productId !== productId);
        const newEntry = {
          productId,
          viewedAt: new Date().toISOString(),
          ...productData,
        };
        const updated = [newEntry, ...filtered].slice(0, 50); // Keep last 50 views

        // Save to localStorage
        try {
          localStorage.setItem("viewedProducts", JSON.stringify(updated));
        } catch (err) {
          // Failed to save to localStorage, continue
        }

        return updated;
      });
    },
    []
  );

  // Get viewed product IDs (for API queries)
  const getViewedProductIds = useCallback(() => {
    return viewedProducts.map((p) => p.productId);
  }, [viewedProducts]);

  // Get products viewed in a specific category
  const getViewedByCategory = useCallback(
    (categoryId) => {
      return viewedProducts.filter((p) => p.category === categoryId);
    },
    [viewedProducts]
  );

  // Clear view history
  const clearViewHistory = useCallback(() => {
    setViewedProducts([]);
    try {
      localStorage.removeItem("viewedProducts");
    } catch (err) {
      // Failed to clear from localStorage, continue
    }
  }, []);

  return (
    <ViewHistoryContext.Provider
      value={{
        viewedProducts,
        addViewedProduct,
        getViewedProductIds,
        getViewedByCategory,
        clearViewHistory,
        isLoaded,
      }}
    >
      {children}
    </ViewHistoryContext.Provider>
  );
}

export function useViewHistory() {
  const context = useContext(ViewHistoryContext);
  if (!context) {
    throw new Error("useViewHistory must be used within ViewHistoryProvider");
  }
  return context;
}
