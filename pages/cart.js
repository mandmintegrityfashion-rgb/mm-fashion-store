"use client";

import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import debounce from "lodash.debounce";
import { Playfair_Display } from "next/font/google";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiUser, FiMail, FiPhone, FiMapPin, FiMap } from "react-icons/fi";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","500","600","700"] });

function getProductPrice(product) {
  if (!product) return 0;
  return product.isPromotion && product.promoPrice
    ? product.promoPrice
    : product.salePriceIncTax || product.price || 0;
}

export default function CartPage() {
  const { cartItems = [], removeFromCart, clearCart, addToCart, decreaseQty } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  const [focused, setFocused] = useState({});

  const shippingCost = 2000;

  const { subtotal, totalItems, total } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + getProductPrice(item.product) * (item.quantity || 1), 0);
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    return { subtotal: sub, totalItems: count, total: sub + shippingCost };
  }, [cartItems]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const guestData = localStorage.getItem("guestCustomer");
    if (!token) {
      if (guestData) { try { setCustomer(JSON.parse(guestData)); } catch { setCustomer({ name: "", email: "", phone: "", address: "", city: "" }); } }
      setIsLoggedIn(false);
      return;
    }
    const loadCustomer = async () => {
      try {
        const res = await axios.get("/api/customer/me", { headers: { Authorization: "Bearer " + token } });
        if (res.data?.customer) {
          const c = res.data.customer;
          setCustomer({ name: c.name || "", email: c.email || "", phone: c.phone || "", address: c.address || "", city: c.city || "" });
          setIsLoggedIn(true);
        } else { setIsLoggedIn(false); localStorage.removeItem("token"); }
      } catch { setIsLoggedIn(false); localStorage.removeItem("token"); }
    };
    loadCustomer();
  }, []);

  const saveCustomerData = useCallback(debounce(async (updatedCustomer) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try { await axios.put("/api/customer/update", updatedCustomer, { headers: { Authorization: "Bearer " + token } }); } catch {}
  }, 800), []);

  useEffect(() => {
    if (!isLoggedIn) { try { localStorage.setItem("guestCustomer", JSON.stringify(customer)); } catch {} }
  }, [customer, isLoggedIn]);

  const capitalize = (s) => s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const validateField = (field, value) => {
    if (!value?.trim()) return capitalize(field) + " is required";
    if (field === "email" && !/\S+@\S+\.\S+/.test(value)) return "Invalid email address";
    return "";
  };

  const validateForm = (form) => {
    const newErrors = {};
    ["name","email","phone","address","city"].forEach((f) => { const err = validateField(f, form[f] || ""); if (err) newErrors[f] = err; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    const fields = ["name","email","phone","address","city"];
    return fields.every((f) => (customer[f] || "").trim().length > 0) && /\S+@\S+\.\S+/.test(customer.email || "");
  }, [customer]);

  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => { const updated = { ...prev, [field]: value }; if (isLoggedIn) saveCustomerData(updated); return updated; });
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleCheckout = async () => {
    if (!validateForm(customer)) return;
    if (cartItems.length === 0) return;
    setIsLoading(true);
    const fullCartProducts = cartItems.map((item) => ({
      _id: item.product._id, name: item.product.name, price: getProductPrice(item.product), quantity: item.quantity || 1,
      image: Array.isArray(item.product.images) && item.product.images.length > 0 ? item.product.images[0]?.thumb : item.product.image || "/images/placeholder.jpg",
    }));
    try {
      const orderRes = await axios.post("/api/orders", { customer, cartProducts: fullCartProducts, items: fullCartProducts, subtotal, shippingCost, total });
      if (!orderRes.data?.success) throw new Error("Order creation failed");
      clearCart();
      window.location.href = "/checkout/order-confirmation/" + orderRes.data.orderId;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout. Please try again.");
    } finally { setIsLoading(false); }
  };

  const fieldConfig = [
    { name: "name", icon: FiUser, type: "text", placeholder: "Full Name" },
    { name: "email", icon: FiMail, type: "email", placeholder: "Email Address" },
    { name: "phone", icon: FiPhone, type: "tel", placeholder: "Phone Number" },
    { name: "address", icon: FiMapPin, type: "text", placeholder: "Delivery Address" },
    { name: "city", icon: FiMap, type: "text", placeholder: "City" },
  ];

  return (
    <div className="bg-[#F7FAFC] min-h-screen">
      <Navbar />
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 gap-8">
        {/* Cart Items */}
        <div className="flex-1 lg:flex-[2]">
          <h1 className={playfair.className + " text-2xl sm:text-3xl font-bold text-[#1F2D3D] mb-6"}>Shopping Bag</h1>
          <div className="bg-white rounded-2xl border border-[#E6F0FA] p-5 sm:p-6" style={{ boxShadow: "0 2px 12px rgba(31,45,61,0.04)" }}>
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <FiShoppingBag className="mx-auto text-[#D4E3F7] mb-4" size={48} />
                <p className="text-[#8E95A2] text-sm">Your bag is empty</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#F1F5F9]">
                <AnimatePresence>
                  {cartItems.map((item) => {
                    const price = getProductPrice(item.product);
                    return (
                      <motion.li key={item.product._id} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16, height: 0 }}
                        className="flex justify-between items-center py-5 gap-4">
                        <div className="flex gap-4 items-center flex-1 min-w-0">
                          <img
                            src={Array.isArray(item.product.images) ? item.product.images[0]?.thumb : item.product.image || "/images/placeholder.jpg"}
                            alt={item.product.name}
                            className="w-20 h-20 rounded-xl object-cover border border-[#E6F0FA] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1F2D3D] text-sm sm:text-base truncate">{item.product.name}</p>
                            <p className="text-sm text-[#1A5DAB] font-medium">{"\u20A6"}{price.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button onClick={() => decreaseQty(item.product._id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#D4E3F7] hover:border-[#4C9EFF] text-[#5A6171] transition-colors">
                                <FiMinus size={12} />
                              </button>
                              <span className="text-sm font-medium text-[#1F2D3D] w-6 text-center">{item.quantity}</span>
                              <button onClick={() => addToCart(item.product)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1F2D3D] text-white hover:bg-[#1A2332] transition-colors">
                                <FiPlus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.product._id)} className="text-[#B76E79] hover:text-red-500 transition-colors p-2">
                          <FiTrash2 size={16} />
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex-1 lg:flex-[1]">
          <div className="bg-white rounded-2xl border border-[#E6F0FA] p-5 sm:p-6 space-y-5 sticky top-24" style={{ boxShadow: "0 2px 12px rgba(31,45,61,0.04)" }}>
            <h2 className={playfair.className + " text-xl font-bold text-[#1F2D3D]"}>Order Summary</h2>

            <div className="space-y-2 text-sm text-[#5A6171]">
              <div className="flex justify-between"><span>Items</span><span>{totalItems}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>{"\u20A6"}{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{"\u20A6"}{shippingCost.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-[#1F2D3D] text-base border-t border-[#E6F0FA] pt-3">
                <span>Total</span><span>{"\u20A6"}{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-[#5A6171] uppercase tracking-wider">Delivery Details</p>
              {fieldConfig.map(({ name, icon: Icon, type, placeholder }) => {
                const hasError = !!errors[name];
                const isFocused = !!focused[name];
                return (
                  <div key={name}>
                    <div className={"flex items-center border rounded-xl px-3 py-2.5 transition-all duration-200 " +
                      (hasError ? "border-[#B76E79]" : isFocused ? "border-[#4C9EFF] shadow-[0_0_0_3px_rgba(76,158,255,0.08)]" : "border-[#D4E3F7]")}>
                      <Icon className="text-[#8E95A2] mr-2.5 flex-shrink-0" size={14} />
                      <input type={type} placeholder={placeholder} value={customer[name] || ""} onChange={(e) => handleCustomerChange(name, e.target.value)}
                        onFocus={() => setFocused({ ...focused, [name]: true })}
                        onBlur={() => setFocused({ ...focused, [name]: false })}
                        className="w-full bg-transparent outline-none text-sm text-[#1F2D3D] placeholder:text-[#B8BCC6]" />
                    </div>
                    <AnimatePresence>
                      {hasError && (
                        <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                          className="text-[11px] text-[#B76E79] mt-1 block">{errors[name]}</motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <motion.button onClick={handleCheckout} disabled={isLoading || cartItems.length === 0 || !isFormValid}
              whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: isLoading ? 1 : 0.99 }}
              className={"w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all " +
                (isLoading || cartItems.length === 0 || !isFormValid ? "bg-[#D4E3F7] text-[#8E95A2] cursor-not-allowed" : "bg-[#1F2D3D] text-white hover:bg-[#1A2332]")}>
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Place Order <FiArrowRight size={16} /></>}
            </motion.button>

            {cartItems.length > 0 && (
              <button onClick={clearCart} className="w-full py-2.5 rounded-xl text-sm font-medium text-[#B76E79] hover:bg-[#FEF2F2] transition-colors">
                Clear Bag
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
