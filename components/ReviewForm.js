"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

export default function ReviewForm({ productId, onReviewAdded }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const { customer, token } = useAuth();
  const [customerName, setCustomerName] = useState("Anonymous");

  useEffect(() => {
    if (customer?.name) setCustomerName(customer.name);
    else if (customer?.fullName) setCustomerName(customer.fullName);
    else if (customer?.email)
      setCustomerName(customer.email.split("@")[0]);
    else setCustomerName("Anonymous");
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !text || rating === 0)
      return alert("Please fill all fields before submitting.");

    setLoading(true);
    try {
      const payload = {
        title,
        text,
        rating,
        customerName: customerName || "Anonymous",
      };

      await axios.post(`/api/products/${productId}/reviews`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (onReviewAdded) onReviewAdded();
      setTitle("");
      setText("");
      setRating(0);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 bg-white rounded-2xl shadow-md p-8 border border-blue-100"
    >
      <h3 className="text-2xl font-bold text-blue-900 border-b border-blue-100 pb-3">
        Share Your Experience 💬
      </h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-blue-800 mb-2">
          Your Rating
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`transition transform hover:scale-110 ${
                rating >= star ? "text-blue-500" : "text-gray-300"
              }`}
            >
              <FaStar size={26} />
            </button>
          ))}
        </div>
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-semibold text-blue-800 mb-2">
          Review Title
        </label>
        <input
          type="text"
          placeholder="e.g. Loved this dress!"
          className="w-full border border-blue-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-semibold text-blue-800 mb-2">
          Your Review
        </label>
        <textarea
          placeholder="Write your honest thoughts..."
          className="w-full border border-blue-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Customer Name Display */}
      <p className="text-sm text-blue-600 italic">
        Posting as: <span className="font-semibold">{customerName}</span>
      </p>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition ${
          loading
            ? "bg-[#0F1923]/50 cursor-not-allowed"
            : "bg-[#0F1923] hover:bg-[#1A2332]"
        }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </motion.button>
    </motion.form>
  );
}
