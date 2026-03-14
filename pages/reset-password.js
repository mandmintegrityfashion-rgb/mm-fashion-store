"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiCheck, FiArrowLeft } from "react-icons/fi";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/reset-password", { token, password });
      if (res.data?.success) {
        setSuccess(true);
      }
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
            <h1 className={`${playfair.className} text-3xl font-bold text-[#1F2D3D] mb-2`}>Set New Password</h1>
            <p className="text-[#5A6171] text-sm">
              {success ? "Your password has been updated" : "Enter your new password below"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6F0FA] p-8" style={{ boxShadow: "0 4px 16px rgba(31,45,61,0.06)" }}>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                    <FiCheck size={28} className="text-green-500" />
                  </div>
                  <p className="text-sm text-[#5A6171]">Your password has been reset successfully.</p>
                  <Link href="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1F2D3D] text-white rounded-xl font-semibold text-sm hover:bg-[#1A2332] transition-all">
                    Sign In
                  </Link>
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
                      <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">New Password</label>
                      <div className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${focused.password ? "border-[#4C9EFF] shadow-[0_0_0_3px_rgba(76,158,255,0.08)]" : "border-[#D4E3F7]"}`}>
                        <FiLock className="text-[#8E95A2] mr-3 flex-shrink-0" size={16} />
                        <input type={showPassword ? "text" : "password"} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocused(p => ({...p, password: true}))} onBlur={() => setFocused(p => ({...p, password: false}))}
                          className="w-full bg-transparent outline-none text-sm text-[#1F2D3D] placeholder:text-[#B8BCC6]" autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#8E95A2] hover:text-[#1F2D3D] transition-colors ml-2">
                          {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">Confirm Password</label>
                      <div className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${focused.confirm ? "border-[#4C9EFF] shadow-[0_0_0_3px_rgba(76,158,255,0.08)]" : "border-[#D4E3F7]"}`}>
                        <FiLock className="text-[#8E95A2] mr-3 flex-shrink-0" size={16} />
                        <input type={showPassword ? "text" : "password"} placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocused(p => ({...p, confirm: true}))} onBlur={() => setFocused(p => ({...p, confirm: false}))}
                          className="w-full bg-transparent outline-none text-sm text-[#1F2D3D] placeholder:text-[#B8BCC6]" autoComplete="new-password" />
                      </div>
                    </div>

                    <motion.button type="submit" disabled={isLoading} whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: isLoading ? 1 : 0.99 }}
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        isLoading ? "bg-[#D4E3F7] text-[#8E95A2] cursor-not-allowed" : "bg-[#1F2D3D] text-white hover:bg-[#1A2332]"
                      }`}>
                      {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Reset Password"}
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
