/**
 * Optimized Cart Context with context splitting
 * Uses separate contexts for items (frequently read) and actions (rarely needed together)
 * This prevents unnecessary re-renders of the entire app when cart changes
 */

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
import cacheManager from "@/lib/cacheManager";

// Separate contexts for better granularity
export const CartItemsContext = createContext();
export const CartActionsContext = createContext();

const CART_CACHE_KEY = "user_cart";
const CART_CACHE_TTL = 30; // 30 minutes

export function CartProvider({ children }) {
  const { customer, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from backend or localStorage with caching
  const reloadCart = useCallback(async () => {
    if (customer && token) {
      try {
        // Try cache first
        const cached = cacheManager.get(CART_CACHE_KEY, CART_CACHE_TTL);
        if (cached) {
          setCartItems(cached);
          setIsLoading(false);
          return;
        }

        // Fetch from server
        const res = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = res.data || [];
        setCartItems(cartData);

        // Cache the result
        cacheManager.set(CART_CACHE_KEY, cartData, CART_CACHE_TTL);
      } catch (err) {
        // Failed to reload server cart, clear cart state
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      const saved = localStorage.getItem("cartItems");
      setCartItems(saved ? JSON.parse(saved) : []);
      setIsLoading(false);
    }
  }, [customer, token]);

  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  // Save for guests
  useEffect(() => {
    if (!customer) {
      if (cartItems.length > 0) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      } else {
        localStorage.removeItem("cartItems");
      }
    }
  }, [cartItems, customer]);

  // Cross-tab sync for guests
  useEffect(() => {
    const handleStorageChange = () => reloadCart();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [reloadCart]);

  // Sync backend and local state together
  const syncCart = async (newCart) => {
    setCartItems(newCart);

    // Update cache
    cacheManager.set(CART_CACHE_KEY, newCart, CART_CACHE_TTL);

    if (customer && token) {
      try {
        await axios.post(
          "/api/cart",
          { items: newCart },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        // Failed to sync - local state remains in sync
      }
    }
  };

  // Action memoization - prevent function recreation every render
  const actions = useMemo(
    () => ({
      async addToCart(product, qty = 1) {
        const existingItem = cartItems.find((item) => item.product?._id === product._id);

        let newCart;
        if (existingItem) {
          newCart = cartItems.map((item) =>
            item.product._id === product._id ? { ...item, quantity: item.quantity + qty } : item
          );
        } else {
          newCart = [...cartItems, { product, quantity: qty }];
        }

        await syncCart(newCart);
      },

      async removeFromCart(productId) {
        const newCart = cartItems.filter((item) => item.product?._id !== productId);
        await syncCart(newCart);
      },

      async decreaseQty(productId) {
        const newCart = cartItems
          .map((item) =>
            item.product?._id === productId
              ? { ...item, quantity: Math.max(0, item.quantity - 1) }
              : item
          )
          .filter((item) => item.quantity > 0);

        await syncCart(newCart);
      },

      async clearCart() {
        await syncCart([]);
      },

      reloadCart,
    }),
    [cartItems, customer, token, reloadCart]
  );

  // Memoize calculated values - prevent recalculation
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price =
          item.product?.salePriceIncTax ?? item.product?.price ?? 0;
        return sum + price * (item.quantity || 0);
      }, 0),
    [cartItems]
  );

  // Split into two providers - components can subscribe to just what they need
  return (
    <CartItemsContext.Provider value={{ cartItems, cartCount, cartTotal, isLoading }}>
      <CartActionsContext.Provider value={actions}>
        {children}
      </CartActionsContext.Provider>
    </CartItemsContext.Provider>
  );
}

// Selector hooks - components use these instead of useContext
export const useCartItems = () => {
  const context = useContext(CartItemsContext);
  if (!context) throw new Error("useCartItems must be used within CartProvider");
  return context;
};

export const useCartActions = () => {
  const context = useContext(CartActionsContext);
  if (!context) throw new Error("useCartActions must be used within CartProvider");
  return context;
};

// Combined hook for components that need both (backward compatibility)
export const useCart = () => {
  const items = useCartItems();
  const actions = useCartActions();
  return { ...items, ...actions };
};
