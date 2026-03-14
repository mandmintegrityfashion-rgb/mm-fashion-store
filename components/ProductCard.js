"use client";

import { Overpass, Playfair_Display } from "next/font/google";
import { FiShoppingBag, FiHeart, FiEye } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const overpass = Overpass({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function CircularCountdown({ endDate, size = 36 }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const radius = size / 2 - 3;
  const circumference = 2 * Math.PI * radius;

  const calculateTimeLeft = () => {
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return null;
    return {
      total: diff,
      seconds: Math.floor((diff / 1000) % 60),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      hours: Math.floor((diff / 1000 / 60 / 60) % 24),
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return <span className="text-rose text-[10px] font-semibold">Expired</span>;

  const progress = (timeLeft.seconds / 60) * circumference;

  return (
    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E8E0D4" strokeWidth="2.5" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#C9A96E" strokeWidth="2.5" fill="none"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" className="transition-all duration-300" />
      </svg>
      <span className="text-[10px] font-semibold text-midnight">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(price);

  const fallbackImage = "/images/placeholder.jpg";
  const image = product?.images?.[0]?.full || product?.images?.[0] || product?.image || fallbackImage;
  const isNew = new Date() - new Date(product?.createdAt) < 7 * 24 * 60 * 60 * 1000;
  const hasPromotion = product?.isPromotion || product?.promoEnd;

  const discount = hasPromotion && product?.salePriceIncTax && product?.promoPrice
    ? Math.round((1 - product.promoPrice / product.salePriceIncTax) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <motion.div
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex flex-col w-full max-w-[260px] bg-white rounded-2xl overflow-hidden border border-[#F0EBE3] hover:border-[#E8E0D4] transition-all duration-500 group"
      style={{ boxShadow: isHovered ? "0 8px 32px rgba(15,25,35,0.08)" : "0 1px 3px rgba(15,25,35,0.04)" }}
    >
      {/* Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-muted">
        <Image
          src={image}
          alt={product?.name || "Product"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasPromotion && discount > 0 && (
            <span className="bg-rose text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {hasPromotion && !discount && (
            <span className="bg-gold text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Sale
            </span>
          )}
          {isNew && !hasPromotion && (
            <span className="bg-midnight text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        {/* Countdown */}
        {product?.promoEnd && (
          <div className="absolute top-3 right-3">
            <CircularCountdown endDate={product.promoEnd} size={32} />
          </div>
        )}

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 right-3 flex flex-col gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToWishlist(product); }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-premium hover:bg-rose hover:text-white text-midnight transition-colors"
              >
                <FiHeart size={15} />
              </motion.button>
              <Link href={`/product/${product._id}`}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-premium hover:bg-midnight hover:text-white text-midnight transition-colors"
                >
                  <FiEye size={15} />
                </motion.div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link
          href={`/product/${product._id}`}
          className={`${playfair.className} font-semibold text-sm text-midnight truncate hover:text-gold-dark transition-colors`}
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-2">
          <p className={`${overpass.className} text-base font-bold text-midnight`}>
            {product.isPromotion && product.promoPrice
              ? formatPrice(product.promoPrice)
              : formatPrice(product.salePriceIncTax || product.price)}
          </p>
          {hasPromotion && product.salePriceIncTax && product.promoPrice && (
            <p className={`${overpass.className} text-xs text-[#8E95A2] line-through`}>
              {formatPrice(product.salePriceIncTax)}
            </p>
          )}
        </div>
      </div>

      {/* Add to Cart */}
      <div className="px-4 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className={`flex justify-center items-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            addedToCart
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-midnight text-white hover:bg-charcoal"
          }`}
        >
          <FiShoppingBag size={14} />
          {addedToCart ? "Added!" : "Add to Bag"}
        </motion.button>
      </div>
    </motion.div>
  );
}
