"use client";

import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import { useCompare } from "@/context/CompareContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { Playfair_Display } from "next/font/google";
import { useRouter } from "next/router";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-playfair",
});

export default function ComparePage() {
  const router = useRouter();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const properties = new Set();
  compareList.forEach((product) => {
    if (Array.isArray(product.properties)) {
      product.properties.forEach(({ propName }) => {
        properties.add(propName);
      });
    }
  });

  return (
    <>
      <Head>
        <title>Compare Products | Chioma Hair</title>
        <meta
          name="description"
          content="Compare hair products side by side to find the perfect match."
        />
      </Head>

      <div className={`${playfair.className} bg-[#FDFBF7] min-h-screen`}>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 btn btn-outline flex items-center gap-2 cursor-pointer"
          >
            <FaArrowLeft /> Back to previous page
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1
              className="text-5xl font-bold mb-4 font-serif"
              className="text-4xl sm:text-5xl font-bold mb-4 text-[#0F1923]"
            >
              Product Comparison
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A96E] mb-4"></div>
            <p className="text-[#5A6171] text-lg">
              {compareList.length === 0
                ? "Add products to compare them side by side."
                : `Comparing ${compareList.length} product${compareList.length !== 1 ? "s" : ""}`}
            </p>
          </motion.div>

          {compareList.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-xl shadow-sm border border-[#F0EBE3]"
            >
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No Products to Compare</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start adding products to compare their features, prices, and properties.
              </p>
              <Link href="/product">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300"
                  className="px-8 py-3 rounded-lg font-semibold text-white bg-[#0F1923] hover:bg-[#1A2332] transition-all duration-300"
                >
                  Browse Products
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Clear All Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearCompare}
                  className="px-4 py-2 rounded-lg text-[#B76E79] border border-[#B76E79]/30 hover:bg-[#B76E79]/5 transition-all duration-300 font-semibold"
                >
                  Clear All
                </motion.button>
              </motion.div>

              {/* Comparison Table */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-x-auto rounded-xl shadow-sm border border-[#F0EBE3] bg-white"
              >
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#F5F0E8] border-b border-[#E8E0D4]">
                      <th className="px-6 py-4 font-bold text-gray-900">Property</th>
                      {compareList.map((product, idx) => (
                        <th key={product._id || idx} className="px-6 py-4 font-bold text-gray-900 min-w-[250px]">
                          <div className="flex items-start justify-between gap-4">
                            <span>{product.name}</span>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCompare(product._id)}
                              className="text-gray-500 hover:text-red-500 transition flex-shrink-0"
                              title="Remove from comparison"
                            >
                              <FiX size={20} />
                            </motion.button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Product Images */}
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">Image</td>
                      {compareList.map((product, idx) => (
                        <td key={product._id || idx} className="px-6 py-4">
                          <img
                            src={
                              Array.isArray(product.images) && product.images.length > 0
                                ? product.images[0]?.thumb || product.images[0]?.full
                                : product.image || "/images/placeholder.jpg"
                            }
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Price */}
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">Price</td>
                      {compareList.map((product, idx) => {
                        const promo = Number(product?.promoPrice);
                        const promoActive =
                          (product?.isPromotion === true || !!product?.promoType) &&
                          promo > 0 &&
                          (!product?.promoEnd || new Date() <= new Date(product.promoEnd));
                        const price = promoActive ? promo : Number(product?.salePriceIncTax ?? product?.price ?? 0);
                        return (
                          <td key={product._id || idx} className="px-6 py-4">
                            <div>
                              <p className="font-bold text-lg text-[#0F1923]">₦{price.toLocaleString()}</p>
                              {promoActive && (
                                <p className="text-sm text-gray-500 line-through">
                                  ₦{Number(product?.salePriceIncTax).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Description */}
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">Description</td>
                      {compareList.map((product, idx) => (
                        <td key={product._id || idx} className="px-6 py-4 text-gray-700">
                          <p className="line-clamp-3">{product.description || "N/A"}</p>
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">Rating</td>
                      {compareList.map((product, idx) => (
                        <td key={product._id || idx} className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, k) => (
                                <svg
                                  key={k}
                                  className={`w-4 h-4 ${
                                    k < (product.rating || 0) ? "text-[#C9A96E]" : "text-[#E8E0D4]"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.reviews?.length || 0} reviews)</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Stock Status */}
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">Stock</td>
                      {compareList.map((product, idx) => (
                        <td key={product._id || idx} className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              product.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Dynamic Properties */}
                    {Array.from(properties).map((propName) => (
                      <tr key={propName} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{propName}</td>
                        {compareList.map((product, idx) => {
                          const propValue = product.properties
                            ?.filter((p) => p.propName === propName)
                            .map((p) => p.propValue)
                            .join(", ");
                          return (
                            <td key={product._id || idx} className="px-6 py-4 text-gray-700">
                              {propValue || "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Action Row */}
                    <tr className="bg-[#F5F0E8] border-t border-[#E8E0D4]">
                      <td className="px-6 py-4 font-semibold text-gray-900">Action</td>
                      {compareList.map((product, idx) => (
                        <td key={product._id || idx} className="px-6 py-4">
                          <Link href={`/product/${product.slug || product._id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 text-sm"
                              className="px-4 py-2 rounded-lg text-white font-semibold bg-[#0F1923] hover:bg-[#1A2332] transition-all duration-300 text-sm"
                            >
                              View Details
                            </motion.button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
