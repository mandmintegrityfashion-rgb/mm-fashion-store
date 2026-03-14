"use client";

import { useEffect, useState, useRef } from "react";
import { Playfair_Display, Overpass } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  FaShoppingCart,
  FaHeart,
  FaBalanceScale,
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/router";
import ReviewForm from "@/components/ReviewForm";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-playfair",
});
const overpass = Overpass({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-overpass",
});

export default function ProductClient({ product }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(product.reviews || []);
  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) => img?.thumb || img?.full)
      : [product.image || "/images/placeholder.jpg"];
  const [activeImage, setActiveImage] = useState(productImages[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const mainImageRef = useRef(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get(`/api/products/${product._id}/reviews`);
        if (res.data?.reviews) setReviews(res.data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    }
    fetchReviews();
  }, [product._id]);

  const handleReviewAdded = async () => {
    try {
      const res = await axios.get(`/api/products/${product._id}/reviews`);
      if (res.data?.reviews) setReviews(res.data.reviews);
    } catch (err) {
      console.error("Error refreshing reviews:", err);
    }
  };

  const handleAddToCart = () => {
    const productImage = mainImageRef.current;
    const cartIcon = document.getElementById("cart-icon");
    if (productImage && cartIcon) {
      const imgClone = productImage.cloneNode(true);
      const imgRect = productImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      imgClone.style.position = "fixed";
      imgClone.style.left = `${imgRect.left}px`;
      imgClone.style.top = `${imgRect.top}px`;
      imgClone.style.width = `${imgRect.width}px`;
      imgClone.style.height = `${imgRect.height}px`;
      imgClone.style.zIndex = 1000;
      imgClone.style.transition = "all 0.7s ease-in-out";
      imgClone.style.opacity = "0.9";
      document.body.appendChild(imgClone);

      requestAnimationFrame(() => {
        imgClone.style.left = `${cartRect.left + cartRect.width / 2}px`;
        imgClone.style.top = `${cartRect.top + cartRect.height / 2}px`;
        imgClone.style.width = "20px";
        imgClone.style.height = "20px";
        imgClone.style.opacity = "0";
      });

      imgClone.addEventListener("transitionend", () => imgClone.remove());
    }

    addToCart(product, quantity);
    setQuantity(1);
  };

  const pageTitle = `${product?.name || "Product"} | M&M Fashion`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={product.description?.slice(0, 150) || product.name}
        />
      </Head>

      <Navbar />

      <div
        className={`${playfair.variable} ${overpass.variable} min-h-screen py-10 px-4 sm:px-8 bg-gradient-to-b from-blue-50 to-white`}
      >
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-blue-700 hover:text-blue-500 font-medium"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="max-w-7xl mx-auto grid md:grid-cols-[3fr_2fr] gap-12 items-start">
          {/* LEFT: PRODUCT IMAGES */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
            <div
              className="cursor-zoom-in overflow-hidden rounded-2xl"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  ref={mainImageRef}
                  src={activeImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-[320px] sm:h-[520px] object-cover rounded-2xl"
                />
              </AnimatePresence>
            </div>

            <div className="flex gap-3 mt-5 overflow-x-auto">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                    img === activeImage
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100 flex flex-col gap-6">
            <h1
              className={`${playfair.className} text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight`}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              {product.promoPrice &&
              product.promoPrice < product.salePriceIncTax ? (
                <>
                  <span className="text-3xl font-bold text-blue-600 font-overpass">
                    ₦{product.promoPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₦{product.salePriceIncTax?.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-blue-600 font-overpass">
                  ₦{product.salePriceIncTax?.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed font-overpass">
              {product.description}
            </p>

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((p) => (p === 1 ? 1 : p - 1))}
                className="px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 text-blue-700"
              >
                -
              </button>
              <span className="text-lg font-semibold font-overpass">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((p) => p + 1)}
                className="px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 text-blue-700"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-3 justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform font-overpass"
            >
              <FaShoppingCart className="text-xl" /> Add to Cart
            </button>

            <div className="flex gap-6 font-overpass">
              <button
                onClick={() => addToWishlist(product)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
              >
                <FaHeart /> Add to Wishlist
              </button>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
                <FaBalanceScale /> Compare
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="bg-white max-w-7xl mx-auto mt-16 rounded-3xl shadow-md border border-blue-100 p-10">
          <h2 className="text-3xl font-bold mb-10 text-blue-900 border-b border-blue-100 pb-4">
            Customer Reviews
          </h2>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/2 bg-blue-50 p-8 rounded-2xl shadow-inner">
              <ReviewForm
                productId={product._id}
                onReviewAdded={handleReviewAdded}
              />
            </div>

            <div className="md:w-1/2 space-y-8 bg-blue-50 p-8 rounded-2xl shadow-inner">
              <h3 className="text-2xl font-semibold text-blue-900 border-b border-blue-200 pb-4 mb-6">
                All Reviews
              </h3>

              {reviews.length > 0 ? (
                reviews.map((r, i) => (
                  <div
                    key={r._id || i}
                    className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-semibold text-blue-900 text-lg tracking-wide font-overpass">
                        {r.customer?.name || r.customerName || "Anonymous"}
                      </p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, k) => (
                          <svg
                            key={k}
                            className={`w-5 h-5 ${
                              k < r.rating ? "text-blue-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h4 className="font-semibold text-xl text-blue-800 mb-2">
                      {r.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {r.text}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center mt-12 text-lg">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={activeImage}
            alt="Full View"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
