"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className={`${playfair.className} text-3xl font-bold text-[#1F2D3D] mb-2`}>Reset Password</h1>
            <p className="text-[#5A6171] text-sm">
              {sent ? "Check your inbox for the reset link" : "Enter your email to receive a reset link"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6F0FA] p-8" style={{ boxShadow: "0 4px 16px rgba(31,45,61,0.06)" }}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                    <FiCheck size={28} className="text-green-500" />
                  </div>
                  <p className="text-sm text-[#5A6171]">
                    If an account with <span className="font-semibold text-[#1F2D3D]">{email}</span> exists, we&apos;ve sent a password reset link. Please check your email.
                  </p>
                  <p className="text-xs text-[#8E95A2]">The link will expire in 1 hour.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border border-red-100 p-3 rounded-xl mb-5 text-[#B76E79] text-sm">
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">Email</label>
                      <div className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${focused ? "border-[#4C9EFF] shadow-[0_0_0_3px_rgba(76,158,255,0.08)]" : "border-[#D4E3F7]"}`}>
                        <FiMail className="text-[#8E95A2] mr-3 flex-shrink-0" size={16} />
                        <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                          className="w-full bg-transparent outline-none text-sm text-[#1F2D3D] placeholder:text-[#B8BCC6]" autoComplete="email" />
                      </div>
                    </div>

                    <motion.button type="submit" disabled={isLoading} whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: isLoading ? 1 : 0.99 }}
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        isLoading ? "bg-[#D4E3F7] text-[#8E95A2] cursor-not-allowed" : "bg-[#1F2D3D] text-white hover:bg-[#1A2332]"
                      }`}>
                      {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send Reset Link"}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#1A5DAB] font-semibold hover:text-[#4C9EFF] transition-colors">
                <FiArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
