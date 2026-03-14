"use client";

import { Overpass } from "next/font/google";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";

const overpass = Overpass({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

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

  if (!timeLeft)
    return (
      <p className="text-red-500 font-semibold text-xs text-center">Expired</p>
    );

  const progress = (timeLeft.seconds / 60) * circumference;

  return (
    <div className="flex items-center gap-1">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#eee"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#D35400"
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <span className="text-xs font-medium">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);

  const fallbackImage = "/images/placeholder.jpg";
  const image =
    product?.images?.[0]?.full ||
    product?.images?.[0] ||
    product?.image ||
    fallbackImage;

  const isNew =
    new Date() - new Date(product?.createdAt) <
    7 * 24 * 60 * 60 * 1000;

  const hasPromotion = product?.isPromotion || product?.promoEnd;

  return (
    <div className="relative flex flex-col w-full max-w-[230px] sm:max-w-[250px] md:max-w-[270px] bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Image Section */}
      <div className="relative w-full h-40 sm:h-44 overflow-hidden rounded-t-2xl">
    <Image
  src={image}
  alt={product?.name || "Product"}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
/>


        {/* Promo / New Label */}
        {(hasPromotion || isNew) && (
          <div className="absolute top-2 left-2">
            {hasPromotion ? (
              <span className="bg-[#D35400] text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                Promo
              </span>
            ) : (
              <span className="bg-[#546258] text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                New
              </span>
            )}
          </div>
        )}

        {/* Countdown */}
        {product?.promoEnd && (
          <div className="absolute top-2 right-2">
            <CircularCountdown endDate={product.promoEnd} size={36} />
          </div>
        )}

        {/* Wishlist (top-right) */}
        <button
          onClick={() => addToWishlist(product)}
          className="absolute  bottom-2 right-2 p-3 rounded-full bg-white/90 hover:bg-[#e4c98a] text-gray-700 hover:text-white shadow transition transform hover:scale-110"
        >
          <FaHeart className="text-sm sm:text-base" />
        </button>
      </div>

      {/* Details */}
      <div className="p-3 flex flex-col gap-1.5">
        <Link
          href={`/product/${product._id}`}
          className="font-serif font-semibold text-sm sm:text-base text-gray-900 truncate hover:text-[#546258] transition-colors duration-300"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2">
          <p
            className={`${overpass.className} text-base sm:text-lg font-bold text-[#546258]`}
          >
            {product.salePriceIncTax
              ? formatPrice(product.salePriceIncTax)
              : formatPrice(product.promoPrice)}
          </p>
          {hasPromotion && product.salePriceIncTax && (
            <p
              className={`${overpass.className} text-xs sm:text-sm text-gray-400 line-through`}
            >
              {formatPrice(product.salePriceIncTax)}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 px-3 py-3 border-t border-gray-200 bg-white">
        <button
          onClick={() => addToCart(product)}
          className="flex justify-center items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-[#546258] to-[#7A8E78] text-white text-sm sm:text-base font-semibold shadow hover:opacity-90 transition duration-300 transform hover:scale-105 w-full sm:w-auto"
        >
          <FaShoppingCart /> Cart
        </button>

        <Link
          href={`/product/${product._id}`}
          className="text-center px-3 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-300 transform hover:scale-105 w-full sm:w-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
