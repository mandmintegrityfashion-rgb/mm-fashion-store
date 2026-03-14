"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart, FiHeart, FiSearch } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import AccountDropdown from "@/components/AccountDropdown";
import { Playfair_Display } from "next/font/google";

// ✅ Import Playfair Display font
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

// ✅ Normalize product data
function getProductData(item) {
  const product = item.product || item;
  return {
    id: product?._id,
    name: product?.name || "Unnamed Product",
    image:
      (Array.isArray(product?.images) && product.images.length > 0
        ? product.images[0]
        : product?.image) || "/images/placeholder.jpg",
    price:
      product?.promoPrice && product?.isPromotion
        ? product.promoPrice
        : product?.salePriceIncTax || 0,
    quantity: item.quantity || 1,
  };
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const cartRef = useRef(null);
  const wishlistRef = useRef(null);

  const {
    cartItems,
    decreaseQty,
    addToCart,
    removeFromCart,
    cartCount,
    cartTotal,
    reloadCart,
  } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // ✅ Listen for cartUpdated event
  useEffect(() => {
    const handleCartUpdated = () => reloadCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [reloadCart]);

  // ✅ Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        cartOpen &&
        cartRef.current &&
        !cartRef.current.contains(e.target) &&
        e.target.id !== "cart-icon"
      ) {
        setCartOpen(false);
      }
      if (
        wishlistOpen &&
        wishlistRef.current &&
        !wishlistRef.current.contains(e.target) &&
        e.target.id !== "wishlist-icon"
      ) {
        setWishlistOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, wishlistOpen]);

  // ✅ Shared dropdown container
  const Dropdown = ({ children, isOpen, innerRef }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={innerRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-lg overflow-hidden z-50 border border-gray-200"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-0 font-bold tracking-tight leading-none"
        >
          {/* Logo Image */}
          <div className="relative w-28 sm:w-32 md:w-36 h-12 sm:h-14 md:h-16 flex-shrink-0">
            <Image
              src="/images/Logo.png"
              alt="M&M Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col sm:-ml-20 md:-ml-16">
            {/* Main Brand Name */}
            <span
              className={`text-blue-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold ${playfair.className}`}
            >
              M&M
            </span>

            {/* Tagline / Sub-brand */}
            <span
              className={`text-blue-600 text-sm sm:text-base md:text-lg font-medium tracking-wide uppercase`}
            >
              Fashion
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-lg font-medium text-blue-900">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`relative group transition-all duration-300 ${playfair.className}`}
            >
              <span className="hover:text-blue-500">{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Buttons (Cart, Wishlist, Search, Account) */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-xl sm:text-2xl">
          {/* Search */}
          <button className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-blue-50 transition-colors">
            <FiSearch className="text-blue-700 hover:text-blue-500" />
          </button>

          {/* Wishlist */}
          <div className="relative">
            <button
              id="wishlist-icon"
              onClick={() => {
                setWishlistOpen((v) => !v);
                setCartOpen(false);
              }}
              className="relative p-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              <FiHeart className="text-blue-700 hover:text-blue-500" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            <Dropdown isOpen={wishlistOpen} innerRef={wishlistRef}>
              <div className="p-4 max-h-64 overflow-y-auto space-y-3">
                {wishlist.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center italic py-6">
                    Your wishlist is empty
                  </p>
                ) : (
                  wishlist.map((item) => {
                    const data = getProductData(item);
                    return (
                      <div key={data.id} className="flex items-center gap-3">
                        <Image
                          src={data.image.thumb || "/images/placeholder.jpg"}
                          alt={data.name}
                          width={60}
                          height={60}
                          className="object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {data.name}
                          </p>
                          <p className="text-xs text-gray-700">
                            ₦{Number(data.price).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(data.id)}
                          className="text-gray-400 hover:text-red-500 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              {wishlist.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                  <Link
                    href="/wishlist"
                    className="block w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 text-sm text-center"
                  >
                    View Wishlist
                  </Link>
                </div>
              )}
            </Dropdown>
          </div>

          {/* Cart */}
          <div className="relative">
            <button
              id="cart-icon"
              onClick={() => {
                setCartOpen((v) => !v);
                setWishlistOpen(false);
              }}
              className="relative p-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              <FiShoppingCart className="text-blue-700 hover:text-blue-500" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <Dropdown isOpen={cartOpen} innerRef={cartRef}>
              <div className="p-4 max-h-64 overflow-y-auto space-y-3">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center italic py-6">
                    Your cart is empty
                  </p>
                ) : (
                  cartItems.map((item) => {
                    const data = getProductData(item);
                    return (
                      <div key={data.id} className="flex items-center gap-3">
                        <Image
                          src={data.image.thumb || "/images/placeholder.jpg"}
                          alt={data.name}
                          width={60}
                          height={60}
                          className="object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm font-semibold text-gray-900 ${playfair.className}`}
                          >
                            {data.name}
                          </p>
                          <p className="text-xs text-gray-700">
                            ₦{Number(data.price).toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => decreaseQty(data.id)}
                              className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
                            >
                              –
                            </button>
                            <span className="text-gray-700 text-sm">
                              {data.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item.product, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(data.id)}
                          className="text-gray-400 hover:text-red-500 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex justify-between text-sm text-gray-700 font-semibold">
                    <span>Subtotal</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <Link
                    href="/cart"
                    className="block w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 text-sm text-center mt-2"
                  >
                    View Cart
                  </Link>
                </div>
              )}
            </Dropdown>
          </div>

          {/* Account Dropdown */}
          <div className="hidden sm:block">
            <AccountDropdown />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-3xl ml-2 text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors"
            onClick={() => setIsOpen((s) => !s)}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="md:hidden shadow-xl bg-blue-50"
          >
            <div className="grid grid-cols-2 gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-2 rounded-full font-medium text-center shadow-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Account Button */}
            <div className="flex justify-center pb-6">
              <AccountDropdown />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
