"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart, FiHeart, FiSearch, FiArrowRight } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import AccountDropdown from "@/components/AccountDropdown";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

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
  const [scrolled, setScrolled] = useState(false);

  const cartRef = useRef(null);
  const wishlistRef = useRef(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

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
  const { sessionWarning, dismissWarning, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleCartUpdated = () => reloadCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [reloadCart]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (cartOpen && cartRef.current && !cartRef.current.contains(e.target) && e.target.id !== "cart-icon") {
        setCartOpen(false);
      }
      if (wishlistOpen && wishlistRef.current && !wishlistRef.current.contains(e.target) && e.target.id !== "wishlist-icon") {
        setWishlistOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, wishlistOpen]);

  const Dropdown = ({ children, isOpen, innerRef }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={innerRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-premium-xl overflow-hidden z-50 border border-[#E8E0D4]"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Session Expiry Warning */}
      <AnimatePresence>
        {sessionWarning && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="session-warning px-4 py-2 flex items-center justify-center gap-4 text-sm text-amber-900 z-[60] relative"
          >
            <span>Your session will expire soon. Please save your work.</span>
            <button onClick={dismissWarning} className="font-semibold underline hover:no-underline">Dismiss</button>
            <button onClick={logout} className="font-semibold text-amber-700 hover:text-amber-900">Re-login</button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          boxShadow: scrolled ? "0 1px 20px rgba(15,25,35,0.06)" : "0 1px 0 rgba(15,25,35,0.04)",
        }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/images/Logo.png" alt="M&M Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col -ml-1">
              <span className={`${playfair.className} text-midnight text-lg sm:text-xl font-bold leading-none tracking-tight group-hover:text-gold-dark transition-colors`}>
                M&M
              </span>
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-gold-dark leading-none">
                Fashion
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path} className="relative px-4 py-2 group">
                <span className={`text-sm font-medium text-slate group-hover:text-midnight transition-colors`}>
                  {link.name}
                </span>
                <motion.span
                  className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gold rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-muted transition-colors"
            >
              <FiSearch className="text-slate w-[18px] h-[18px]" />
            </motion.button>

            {/* Wishlist */}
            <div className="relative">
              <motion.button
                id="wishlist-icon"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setWishlistOpen((v) => !v); setCartOpen(false); }}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-muted transition-colors"
              >
                <FiHeart className="text-slate w-[18px] h-[18px]" />
                <AnimatePresence>
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-rose text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <Dropdown isOpen={wishlistOpen} innerRef={wishlistRef}>
                <div className="p-4">
                  <h3 className={`${playfair.className} text-lg font-semibold text-midnight mb-3`}>Wishlist</h3>
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {wishlist.length === 0 ? (
                      <p className="text-center py-8 text-sm text-[#8E95A2]">Your wishlist is empty</p>
                    ) : (
                      wishlist.map((item) => {
                        const data = getProductData(item);
                        return (
                          <motion.div key={data.id} layout className="flex items-center gap-3 p-2 rounded-xl hover:bg-ivory transition-colors">
                            <Image src={data.image.thumb || "/images/placeholder.jpg"} alt={data.name} width={52} height={52} className="object-cover rounded-lg border border-[#E8E0D4]" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-midnight truncate">{data.name}</p>
                              <p className="text-xs text-gold-dark font-semibold">₦{Number(data.price).toLocaleString()}</p>
                            </div>
                            <button onClick={() => removeFromWishlist(data.id)} className="text-[#8E95A2] hover:text-rose transition-colors p-1">
                              <FiX size={14} />
                            </button>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
                {wishlist.length > 0 && (
                  <div className="border-t border-[#E8E0D4] p-4">
                    <Link href="/wishlist" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-midnight text-white text-sm font-medium hover:bg-charcoal transition-colors">
                      View Wishlist <FiArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </Dropdown>
            </div>

            {/* Cart */}
            <div className="relative">
              <motion.button
                id="cart-icon"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCartOpen((v) => !v); setWishlistOpen(false); }}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-muted transition-colors"
              >
                <FiShoppingCart className="text-slate w-[18px] h-[18px]" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <Dropdown isOpen={cartOpen} innerRef={cartRef}>
                <div className="p-4">
                  <h3 className={`${playfair.className} text-lg font-semibold text-midnight mb-3`}>Shopping Bag</h3>
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {cartItems.length === 0 ? (
                      <p className="text-center py-8 text-sm text-[#8E95A2]">Your bag is empty</p>
                    ) : (
                      cartItems.map((item) => {
                        const data = getProductData(item);
                        return (
                          <motion.div key={data.id} layout className="flex items-center gap-3 p-2 rounded-xl hover:bg-ivory transition-colors">
                            <Image src={data.image.thumb || "/images/placeholder.jpg"} alt={data.name} width={52} height={52} className="object-cover rounded-lg border border-[#E8E0D4]" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-midnight truncate">{data.name}</p>
                              <p className="text-xs text-gold-dark font-semibold">₦{Number(data.price).toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <button onClick={() => decreaseQty(data.id)} className="w-6 h-6 flex items-center justify-center rounded-md bg-surface-muted hover:bg-[#E8E0D4] text-midnight text-xs font-bold transition-colors">–</button>
                                <span className="text-xs text-slate font-medium w-4 text-center">{data.quantity}</span>
                                <button onClick={() => addToCart(item.product, 1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-midnight text-white text-xs font-bold hover:bg-charcoal transition-colors">+</button>
                              </div>
                            </div>
                            <button onClick={() => removeFromCart(data.id)} className="text-[#8E95A2] hover:text-rose transition-colors p-1">
                              <FiX size={14} />
                            </button>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
                {cartItems.length > 0 && (
                  <div className="border-t border-[#E8E0D4] p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5A6171]">Subtotal</span>
                      <span className="text-base font-semibold text-midnight">₦{cartTotal.toLocaleString()}</span>
                    </div>
                    <Link href="/cart" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gold text-white text-sm font-semibold hover:bg-gold-dark transition-colors shadow-gold">
                      View Bag <FiArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </Dropdown>
            </div>

            {/* Account */}
            <div className="hidden sm:block">
              <AccountDropdown />
            </div>

            {/* Mobile Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-muted text-midnight transition-colors"
              onClick={() => setIsOpen((s) => !s)}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden border-t border-[#E8E0D4]"
            >
              <div className="px-6 py-6 space-y-2 bg-white">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-3 px-4 rounded-xl text-midnight font-medium hover:bg-ivory transition-colors"
                    >
                      {link.name}
                      <FiArrowRight size={16} className="text-[#8E95A2]" />
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 border-t border-[#E8E0D4]">
                  <AccountDropdown />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
