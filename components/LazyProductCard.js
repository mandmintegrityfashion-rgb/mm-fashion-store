/**
 * Lazy Loaded Product Card Component
 * Loads product image and details only when visible
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/lib/useIntersectionObserver";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function LazyProductCard({ product }) {
  const { ref, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  const [imageLoaded, setImageLoaded] = useState(false);
  const isInWishlist = wishlist.some((item) => item._id === product._id);

  // Get product image
  const imageUrl = Array.isArray(product?.images) && product.images.length > 0
    ? product.images[0]?.full || product.images[0]?.thumb
    : product?.image || "/images/placeholder.jpg";

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="group relative h-full"
    >
      <Link href={`/product/${product._id}`} className="block h-full">
        <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
          {/* Image Container */}
          <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
            {!imageLoaded && hasBeenVisible && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}

            {hasBeenVisible ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                loading="lazy"
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoadingComplete={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
            ) : (
              // Placeholder while waiting to load
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Loading...</span>
              </div>
            )}

            {/* Stock Badge */}
            {product.stock > 0 && (
              <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                In Stock
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-lightGold hover:bg-[#c79f73] text-luxuryGreen font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FaShoppingCart className="text-sm" />
                Add
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                  isInWishlist
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-white/90 hover:bg-white text-red-500"
                }`}
              >
                <FaHeart className="text-sm" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-luxuryGreen transition-colors">
                {product.name}
              </h3>
              {product.category && (
                <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>
              )}
            </div>

            {/* Price */}
            <div className="mt-3">
              {product.promoPrice && product.isPromotion ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-luxuryGreen">
                    ₦{Number(product.promoPrice).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₦{Number(product.price).toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-luxuryGreen">
                  ₦{Number(product.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default LazyProductCard;
