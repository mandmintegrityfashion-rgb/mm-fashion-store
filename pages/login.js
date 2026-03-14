"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export default function LoginPage() {
  const router = useRouter();
  const { redirect, verified } = router.query || {};
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    if (!form.email || !form.password) {
      setServerMsg("Please fill all fields");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/login", {
        ...form,
        email: form.email.trim().toLowerCase(),
      }, { headers: { "Content-Type": "application/json" } });
      if (res.data?.success && res.data.token) {
        login(res.data.token);
        const target = typeof redirect === "string" && redirect ? redirect : "/";
        router.replace(target);
        return;
      } else {
        setServerMsg(res.data?.message || "Login failed");
      }
    } catch (err) {
      setServerMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className={`${playfair.className} text-3xl font-bold text-[#0F1923] mb-2`}>Welcome Back</h1>
            <p className="text-[#5A6171] text-sm">Sign in to your M&M Fashion account</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#F0EBE3] p-8" style={{ boxShadow: "0 4px 16px rgba(15,25,35,0.06)" }}>
            <AnimatePresence>
              {verified && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 border border-green-100 p-3 rounded-xl mb-5 text-green-800 text-sm">
                  Email verified successfully. You may now log in.
                </motion.div>
              )}
              {serverMsg && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 p-3 rounded-xl mb-5 text-[#B76E79] text-sm">
                  {serverMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">Email</label>
                <div className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${focused.email ? "border-[#C9A96E] shadow-[0_0_0_3px_rgba(201,169,110,0.08)]" : "border-[#E8E0D4]"}`}>
                  <FiMail className="text-[#8E95A2] mr-3 flex-shrink-0" size={16} />
                  <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange}
                    onFocus={() => setFocused(p => ({...p, email: true}))} onBlur={() => setFocused(p => ({...p, email: false}))}
                    className="w-full bg-transparent outline-none text-sm text-[#0F1923] placeholder:text-[#B8BCC6]" autoComplete="email" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">Password</label>
                <div className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${focused.password ? "border-[#C9A96E] shadow-[0_0_0_3px_rgba(201,169,110,0.08)]" : "border-[#E8E0D4]"}`}>
                  <FiLock className="text-[#8E95A2] mr-3 flex-shrink-0" size={16} />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange}
                    onFocus={() => setFocused(p => ({...p, password: true}))} onBlur={() => setFocused(p => ({...p, password: false}))}
                    className="w-full bg-transparent outline-none text-sm text-[#0F1923] placeholder:text-[#B8BCC6]" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#8E95A2] hover:text-[#0F1923] transition-colors ml-2">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={isLoading} whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: isLoading ? 1 : 0.99 }}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  isLoading ? "bg-[#E8E0D4] text-[#8E95A2] cursor-not-allowed" : "bg-[#0F1923] text-white hover:bg-[#1A2332]"
                }`}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <FiArrowRight size={16} /></>}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#F0EBE3]" />
              <span className="text-[10px] text-[#8E95A2] uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#F0EBE3]" />
            </div>

            <p className="text-sm text-[#5A6171] text-center">
              {"Don't have an account? "}
              <Link href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-[#A88B4A] font-semibold hover:text-[#C9A96E] transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
