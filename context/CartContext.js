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

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { customer, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // 🔄 Load cart from backend or localStorage
  const reloadCart = useCallback(async () => {
    if (customer && token) {
      try {
        const res = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data || []);
      } catch (err) {
        console.error("Failed to reload server cart:", err.response?.data || err.message);
        setCartItems([]);
      }
    } else {
      const saved = localStorage.getItem("cartItems");
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  }, [customer, token]);

  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  // ✅ Save for guests
  useEffect(() => {
    if (!customer) {
      if (cartItems.length > 0) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      } else {
        localStorage.removeItem("cartItems");
      }
    }
  }, [cartItems, customer]);

  // ✅ Cross-tab sync for guests
  useEffect(() => {
    const handleStorageChange = () => reloadCart();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [reloadCart]);

  // 🔄 Sync backend and local state together
  const syncCart = async (newCart) => {
    setCartItems(newCart); // <-- ensure local state updates immediately
    if (customer && token) {
      try {
        await axios.post(
          "/api/cart",
          {
            cart: newCart.map((i) => ({
              product: i.product._id,
              quantity: i.quantity,
            })),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to sync cart:", err.response?.data || err.message);
      }
    }
  };

  // ➕ Add
  const addToCart = useCallback(
    (product, qty = 1) => {
      setCartItems((prev) => {
        const existing = prev.find((p) => p.product._id === product._id);
        let updated;
        if (existing) {
          updated = prev.map((p) =>
            p.product._id === product._id
              ? { ...p, quantity: p.quantity + qty }
              : p
          );
        } else {
          updated = [...prev, { product, quantity: qty }];
        }
        syncCart(updated);
        return updated;
      });
    },
    [customer, token]
  );

  // ➖ Decrease
  const decreaseQty = useCallback(
    (id) => {
      setCartItems((prev) => {
        const updated = prev
          .map((p) =>
            p.product._id === id
              ? { ...p, quantity: p.quantity - 1 }
              : p
          )
          .filter((p) => p.quantity > 0);
        syncCart(updated);
        return updated;
      });
    },
    [customer, token]
  );

  // ❌ Remove
  const removeFromCart = useCallback(
    (id) => {
      setCartItems((prev) => {
        const updated = prev.filter((p) => p.product._id !== id);
        syncCart(updated);
        return updated;
      });
    },
    [customer, token]
  );


const clearCart = useCallback(async () => {
  setCartItems([]);
  localStorage.removeItem("cartItems");
  window.dispatchEvent(new Event("cartCleared"));

  if (customer && token) {
    try {
      await axios.post(
        "/api/customer/clear-cart",
        { customerId: customer._id },  // ✅ send id
        { headers: { Authorization: `Bearer ${token}` } } // ✅ send token
      );
    } catch (err) {
      console.error("Failed to clear server cart:", err.response?.data || err.message);
    }
  }
}, [customer, token]);


  // 🛒 Stats
  const cartCount = useMemo(
    () => cartItems.reduce((s, i) => s + (i.quantity || 0), 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (t, i) =>
          t +
          Number(
            i.product.promoPrice && i.product.isPromotion
              ? i.product.promoPrice
              : i.product.salePriceIncTax || i.product.price || 0
          ) * (i.quantity || 1),
        0
      ),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      decreaseQty,
      removeFromCart,
      clearCart,
      reloadCart,
      cartCount,
      cartTotal,
    }),
    [cartItems, cartCount, cartTotal, addToCart, decreaseQty, removeFromCart, clearCart, reloadCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
