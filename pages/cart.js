"use client";

import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import debounce from "lodash.debounce";

function getProductPrice(product) {
  if (!product) return 0;
  return product.isPromotion && product.promoPrice
    ? product.promoPrice
    : product.salePriceIncTax || product.price || 0;
}

const STYLE = {
  borderDefault: "#e0e7ff",
  borderFocus: "#2563eb",
  borderError: "#ef4444",
  glowFocus: "0 0 16px rgba(37,99,235,0.18)",
  glowError: "0 0 16px rgba(239,68,68,0.18)",
  transition: { duration: 0.2, ease: "easeOut" },
};

export default function CartPage() {
  const {
    cartItems = [],
    removeFromCart,
    clearCart,
    addToCart,
    decreaseQty,
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const shippingCost = 2000;

  const { subtotal, totalItems, total } = useMemo(() => {
    const sub = cartItems.reduce(
      (sum, item) => sum + getProductPrice(item.product) * (item.quantity || 1),
      0
    );
    const count = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    return { subtotal: sub, totalItems: count, total: sub + shippingCost };
  }, [cartItems]);

  const [focused, setFocused] = useState({});

  // Load guest or logged user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    const guestData = localStorage.getItem("guestCustomer");

    if (!token) {
      if (guestData) {
        try {
          setCustomer(JSON.parse(guestData));
        } catch {
          setCustomer({
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
          });
        }
      }
      setIsLoggedIn(false);
      return;
    }

    const loadCustomer = async () => {
      try {
        const res = await axios.get("/api/customer/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.customer) {
          const c = res.data.customer;
          setCustomer({
            name: c.name || "",
            email: c.email || "",
            phone: c.phone || "",
            address: c.address || "",
            city: c.city || "",
          });
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
      } catch {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      }
    };

    loadCustomer();
  }, []);

  // Auto-save for logged-in user
  const saveCustomerData = useCallback(
    debounce(async (updatedCustomer) => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await axios.put("/api/customer/update", updatedCustomer, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn("Failed to save customer data:", err?.message);
      }
    }, 800),
    []
  );

  // Persist guest info
  useEffect(() => {
    if (!isLoggedIn) {
      try {
        localStorage.setItem("guestCustomer", JSON.stringify(customer));
      } catch {}
    }
  }, [customer, isLoggedIn]);

  // Validation helpers
  const capitalize = (s) =>
    s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const validateField = (field, value) => {
    if (!value?.trim()) return `${capitalize(field)} is required`;
    if (field === "email" && !/\S+@\S+\.\S+/.test(value))
      return "Invalid email address";
    return "";
  };

  const validateForm = (form) => {
    const newErrors = {};
    ["name", "email", "phone", "address", "city"].forEach((f) => {
      const err = validateField(f, form[f] || "");
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    const fields = ["name", "email", "phone", "address", "city"];
    const allFilled = fields.every(
      (f) => (customer[f] || "").trim().length > 0
    );
    const emailOk = /\S+@\S+\.\S+/.test(customer.email || "");
    return allFilled && emailOk;
  }, [customer]);

  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => {
      const updated = { ...prev, [field]: value };
      if (isLoggedIn) saveCustomerData(updated);
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  // ✅ Checkout (No Paystack)
  const handleCheckout = async () => {
    if (!validateForm(customer)) return;
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    const fullCartProducts = cartItems.map((item) => ({
      _id: item.product._id,
      name: item.product.name,
      price: getProductPrice(item.product),
      quantity: item.quantity || 1,
      image:
        Array.isArray(item.product.images) && item.product.images.length > 0
          ? item.product.images[0]?.thumb
          : item.product.image || "/images/placeholder.jpg",
    }));

    try {
      const orderRes = await axios.post("/api/orders", {
        customer,
        cartProducts: fullCartProducts,
        items: fullCartProducts,
        subtotal,
        shippingCost,
        total,
      });

      if (!orderRes.data?.success) throw new Error("Order creation failed");

      const { orderId } = orderRes.data;
      clearCart(); // optional cleanup
      window.location.href = `/checkout/order-confirmation/${orderId}`;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 min-h-screen">
      <Navbar />
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-12 gap-10">
        {/* 🛒 Cart Items */}
        <div className="flex-1 lg:flex-[2] bg-white rounded-3xl shadow-md p-6 border border-blue-100">
          <h1 className="text-3xl font-bold mb-6 text-blue-900 tracking-tight">
            Your Shopping Bag
          </h1>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-12 text-lg italic">
              Your cart is empty
            </p>
          ) : (
            <ul className="divide-y divide-blue-100">
              {cartItems.map((item) => {
                const price = getProductPrice(item.product);
                return (
                  <li
                    key={item.product._id}
                    className="flex justify-between items-center py-5"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={
                          Array.isArray(item.product.images)
                            ? item.product.images[0]?.thumb
                            : item.product.image || "/images/placeholder.jpg"
                        }
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover border border-blue-100 shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-blue-900 text-lg">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-blue-600">
                          ₦{price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => decreaseQty(item.product._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold"
                          >
                            –
                          </button>
                          <span className="text-sm font-medium text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item.product)}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 text-sm hover:text-red-600"
                    >
                      ✕ Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 💳 Order Summary */}
        <div className="flex-1 lg:flex-[1] bg-white rounded-3xl shadow-md p-6 border border-blue-100 space-y-6">
          <h2 className="text-2xl font-bold text-blue-900 tracking-tight">
            Order Summary
          </h2>
          <div className="space-y-2 text-blue-800">
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₦{shippingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-blue-100 pt-3">
              <span>Total:</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>

          {/* 🧍 Customer Info */}
          <div className="space-y-3">
            {["name", "email", "phone", "address", "city"].map((field) => {
              const hasError = !!errors[field];
              const isFocused = !!focused[field];
              const borderColor = hasError
                ? STYLE.borderError
                : isFocused
                ? STYLE.borderFocus
                : STYLE.borderDefault;
              const boxShadow = hasError
                ? STYLE.glowError
                : isFocused
                ? STYLE.glowFocus
                : "0 0 0 rgba(0,0,0,0)";

              return (
                <div key={field} className="flex flex-col">
                  <motion.div
                    initial={{
                      borderColor: STYLE.borderDefault,
                      boxShadow: "0 0 0 rgba(0,0,0,0)",
                    }}
                    animate={{ borderColor, boxShadow }}
                    transition={STYLE.transition}
                    style={{
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderRadius: 10,
                      padding: 2,
                    }}
                  >
                    <input
                      type={field === "email" ? "email" : "text"}
                      placeholder={capitalize(field)}
                      className="w-full rounded-md bg-white p-3 text-sm outline-none border-none text-blue-900"
                      value={customer[field] || ""}
                      onChange={(e) =>
                        handleCustomerChange(field, e.target.value)
                      }
                      onFocus={() =>
                        setFocused((p) => ({ ...p, [field]: true }))
                      }
                      onBlur={() =>
                        setFocused((p) => ({ ...p, [field]: false }))
                      }
                    />
                  </motion.div>

                  <AnimatePresence>
                    {hasError && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors[field]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* 🟦 Buttons */}
          <button
            onClick={handleCheckout}
            disabled={isLoading || cartItems.length === 0 || !isFormValid}
            className={`w-full py-3 rounded-xl font-semibold text-white transition shadow-md cursor-pointer ${
              isLoading || cartItems.length === 0 || !isFormValid
                ? "bg-blue-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Processing..." : "Place Order"}
          </button>

          <button
            onClick={clearCart}
            className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium transition cursor-pointer"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
