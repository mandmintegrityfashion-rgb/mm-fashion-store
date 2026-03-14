"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { customer, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // --- Load wishlist ---
  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      if (customer && token) {
        try {
          const res = await axios.get("/api/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!cancelled) setWishlist(res.data || []);
        } catch (err) {
          console.error("Failed to load wishlist:", err.response?.data || err.message);
          if (!cancelled) setWishlist([]);
        }
      } else {
        const stored = localStorage.getItem("wishlist");
        if (!cancelled) setWishlist(stored ? JSON.parse(stored) : []);
      }
    }

    loadWishlist();
    return () => { cancelled = true };
  }, [customer, token]);

  // --- Persist to localStorage for guests ---
  useEffect(() => {
    if (!customer) {
      if (wishlist.length > 0) {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      } else {
        localStorage.removeItem("wishlist");
      }
    }
  }, [wishlist, customer]);

  // --- Sync to backend ---
  const syncWishlist = async (updated) => {
    if (customer && token) {
      try {
        await axios.post(
          "/api/wishlist",
          { wishlist: updated.map((i) => i._id || i.product?._id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to sync wishlist:", err.response?.data || err.message);
      }
    }
  };

  // --- Add to wishlist ---
  const addToWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.some(
          (i) => (i._id || i.product?._id) === product._id
        );
        if (exists) return prev;

        const updated = [...prev, product];
        syncWishlist(updated);
        return updated;
      });
    },
    [customer, token]
  );

  // --- Remove from wishlist ---
  const removeFromWishlist = useCallback(
    (id) => {
      setWishlist((prev) => {
        const updated = prev.filter(
          (i) => (i._id || i.product?._id) !== id
        );
        syncWishlist(updated);
        return updated;
      });
    },
    [customer, token]
  );

  // --- Clear wishlist ---
  const clearWishlist = useCallback(() => {
    setWishlist([]);
    syncWishlist([]);
  }, [customer, token]);

  // --- Derived values ---
  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      wishlistCount,
    }),
    [wishlist, addToWishlist, removeFromWishlist, clearWishlist, wishlistCount]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
