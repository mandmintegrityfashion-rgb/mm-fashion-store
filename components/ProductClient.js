"use client";

import { useEffect, useState, useRef } from "react";
import { Playfair_Display, Overpass } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FiShoppingBag, FiHeart, FiArrowLeft, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useRouter } from "next/router";
import ReviewForm from "@/components/ReviewForm";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","500","700","900"], variable: "--font-playfair" });
const overpass = Overpass({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-overpass" });

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
  const [addedToCart, setAddedToCart] = useState(false);
  const mainImageRef = useRef(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get("/api/products/" + product._id + "/reviews");
        if (res.data?.reviews) setReviews(res.data.reviews);
      } catch (err) { console.error("Error fetching reviews:", err); }
    }
    fetchReviews();
  }, [product._id]);

  const handleReviewAdded = async () => {
    try {
      const res = await axios.get("/api/products/" + product._id + "/reviews");
      if (res.data?.reviews) setReviews(res.data.reviews);
    } catch (err) { console.error("Error refreshing reviews:", err); }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setQuantity(1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const pageTitle = (product?.name || "Product") + " | M&M Fashion";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={product.description?.slice(0, 150) || product.name} />
      </Head>

      <Navbar />

      <div className={playfair.variable + " " + overpass.variable + " min-h-screen py-8 px-4 sm:px-8 bg-[#FDFBF7]"}>
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-[#5A6171] hover:text-[#0F1923] text-sm font-medium transition-colors">
            <FiArrowLeft size={16} /> Back
          </button>

          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-start">
            {/* Images */}
            <div className="bg-white rounded-2xl p-5 border border-[#F0EBE3]" style={{ boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
              <div className="cursor-zoom-in overflow-hidden rounded-xl" onClick={() => setLightboxOpen(true)}>
                <AnimatePresence mode="wait">
                  <motion.img key={activeImage} ref={mainImageRef} src={activeImage} alt={product.name}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                    className="w-full h-[320px] sm:h-[520px] object-cover rounded-xl" />
                </AnimatePresence>
              </div>
              <div className="flex gap-2.5 mt-4 overflow-x-auto hide-scrollbar">
                {productImages.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(img)}
                    className={"w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 flex-shrink-0 " +
                      (img === activeImage ? "border-[#C9A96E]" : "border-[#E8E0D4] hover:border-[#C9A96E]/50")}>
                    <img src={img} alt={"thumb " + (idx + 1)} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-7 border border-[#F0EBE3] flex flex-col gap-5" style={{ boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
              <h1 className={playfair.className + " text-3xl md:text-4xl font-bold text-[#0F1923] tracking-tight"}>{product.name}</h1>

              <div className="flex items-center gap-3">
                {product.promoPrice && product.promoPrice < product.salePriceIncTax ? (
                  <>
                    <span className="text-2xl font-bold text-[#C9A96E]">{"\u20A6"}{product.promoPrice.toLocaleString()}</span>
                    <span className="text-base text-[#8E95A2] line-through">{"\u20A6"}{product.salePriceIncTax?.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-white bg-[#B76E79] px-2 py-0.5 rounded-full">
                      {Math.round((1 - product.promoPrice / product.salePriceIncTax) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#0F1923]">{"\u20A6"}{product.salePriceIncTax?.toLocaleString()}</span>
                )}
              </div>

              <p className="text-[#5A6171] text-sm leading-relaxed">{product.description}</p>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#5A6171] uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-[#E8E0D4] rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F0E8] text-[#5A6171] transition-colors">
                    <FiMinus size={14} />
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-[#0F1923] border-x border-[#E8E0D4]">{quantity}</span>
                  <button onClick={() => setQuantity((p) => p + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F0E8] text-[#5A6171] transition-colors">
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              <motion.button onClick={handleAddToCart} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className={"flex items-center gap-3 justify-center px-6 py-4 rounded-xl font-semibold text-sm transition-all " +
                  (addedToCart ? "bg-green-600 text-white" : "bg-[#0F1923] text-white hover:bg-[#1A2332]")}>
                <FiShoppingBag size={18} /> {addedToCart ? "Added!" : "Add to Cart"}
              </motion.button>

              <div className="flex gap-4">
                <button onClick={() => addToWishlist(product)}
                  className="flex items-center gap-2 text-sm text-[#5A6171] hover:text-[#B76E79] transition-colors">
                  <FiHeart size={16} /> Add to Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white max-w-7xl mx-auto mt-12 rounded-2xl border border-[#F0EBE3] p-8" style={{ boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
            <h2 className={playfair.className + " text-2xl font-bold mb-8 text-[#0F1923] border-b border-[#F0EBE3] pb-4"}>Customer Reviews</h2>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 bg-[#F5F0E8] p-6 rounded-xl">
                <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
              </div>

              <div className="md:w-1/2 space-y-4">
                <h3 className="text-lg font-semibold text-[#0F1923] border-b border-[#F0EBE3] pb-3 mb-4">All Reviews</h3>
                {reviews.length > 0 ? (
                  reviews.map((r, i) => (
                    <div key={r._id || i} className="bg-[#FDFBF7] border border-[#F0EBE3] rounded-xl p-5 hover:border-[#E8E0D4] transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-[#0F1923] text-sm">{r.customer?.name || r.customerName || "Anonymous"}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, k) => (
                            <svg key={k} className={"w-4 h-4 " + (k < r.rating ? "text-[#C9A96E]" : "text-[#E8E0D4]")} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {r.title && <h4 className="font-semibold text-sm text-[#0F1923] mb-1">{r.title}</h4>}
                      <p className="text-[#5A6171] text-sm leading-relaxed mb-2">{r.text}</p>
                      <p className="text-[10px] text-[#8E95A2]">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#8E95A2] text-sm text-center py-8">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors" onClick={() => setLightboxOpen(false)}>
            <FiX size={24} />
          </button>
          <img src={activeImage} alt="Full View" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </>
  );
}
