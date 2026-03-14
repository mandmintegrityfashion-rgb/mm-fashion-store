"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const strengthLabel = ["Weak", "Fair", "Good", "Strong"];
const strengthColor = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

export default function RegisterPage() {
  const router = useRouter();
  const { redirect } = router.query || {};
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", msg: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState({});

  const strength = passwordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: "", msg: "" });
    if (!form.name || !form.email || !form.phone || !form.password) {
      setNotification({ type: "error", msg: "Please fill all fields" });
      return;
    }
    if (form.password.length < 8) {
      setNotification({ type: "error", msg: "Password must be at least 8 characters" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        ...form,
        email: form.email.trim().toLowerCase(),
      });
      if (res.data?.success) {
        setNotification({ type: "success", msg: "Registration successful! Please check your email to verify your account." });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setNotification({ type: "error", msg: res.data?.message || "Registration failed" });
      }
    } catch (err) {
      setNotification({ type: "error", msg: err?.response?.data?.message || "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", icon: FiUser, type: "text", placeholder: "John Doe", autoComplete: "name" },
    { name: "email", label: "Email", icon: FiMail, type: "email", placeholder: "your@email.com", autoComplete: "email" },
    { name: "phone", label: "Phone", icon: FiPhone, type: "tel", placeholder: "+234 800 000 0000", autoComplete: "tel" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className={playfair.className + " text-3xl font-bold text-[#1F2D3D] mb-2"}>Create Account</h1>
            <p className="text-[#5A6171] text-sm">Join M&M Fashion for an exclusive experience</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6F0FA] p-8" style={{ boxShadow: "0 4px 16px rgba(31,45,61,0.06)" }}>
            <AnimatePresence>
              {notification.msg && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-xl mb-5 text-sm flex items-center gap-2 ${
                    notification.type === "success" ? "bg-green-50 border border-green-100 text-green-800" : "bg-red-50 border border-red-100 text-[#B76E79]"
                  }`}>
                  {notification.type === "success" ? <FiCheck size={14} /> : <FiX size={14} />}
                  {notification.msg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ name, label, icon: Icon, type, placeholder, autoComplete }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">{label}</label>
                  <div className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${
                    focused[name] ? "border-[#4C9EFF] shadow-[0_0_0_3px_rgba(76,158,255,0.08)]" : "border-[#D4E3F7]"
                  }`}>
                    <Icon className="text-[#8E95A2] mr-3 flex-shrink-0" size={16} />
                    <input type={type} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange}
                      onFocus={() => setFocused(p => ({...p, [name]: true}))} onBlur={() => setFocused(p => ({...p, [name]: false}))}
                      className="w-full bg-transparent outline-none text-sm text-[#1F2D3D] placeholder:text-[#B8BCC6]" autoComplete={autoComplete} />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">Password</label>
                <div className={`flex items-center border rounded-xl px-4 py-3 transition-all duration-200 ${
                  focused.password ? "border-[#4C9EFF] shadow-[0_0_0_3px_rgba(76,158,255,0.08)]" : "border-[#D4E3F7]"
                }`}>
                  <FiLock className="text-[#8E95A2] mr-3 flex-shrink-0" size={16} />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a strong password" value={form.password} onChange={handleChange}
                    onFocus={() => setFocused(p => ({...p, password: true}))} onBlur={() => setFocused(p => ({...p, password: false}))}
                    className="w-full bg-transparent outline-none text-sm text-[#1F2D3D] placeholder:text-[#B8BCC6]" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#8E95A2] hover:text-[#1F2D3D] transition-colors ml-2">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-200"
                          style={{ backgroundColor: i < strength ? strengthColor[strength - 1] : "#D4E3F7" }} />
                      ))}
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: strengthColor[strength - 1] || "#8E95A2" }}>
                      {strength > 0 ? strengthLabel[strength - 1] : "Enter a password"}
                    </p>
                  </div>
                )}
              </div>

              <motion.button type="submit" disabled={isLoading} whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: isLoading ? 1 : 0.99 }}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-2 ${
                  isLoading ? "bg-[#D4E3F7] text-[#8E95A2] cursor-not-allowed" : "bg-[#1F2D3D] text-white hover:bg-[#1A2332]"
                }`}>
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <FiArrowRight size={16} /></>}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#E6F0FA]" />
              <span className="text-[10px] text-[#8E95A2] uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#E6F0FA]" />
            </div>

            <p className="text-sm text-[#5A6171] text-center">
              Already have an account?{" "}
              <Link href={"/login" + (redirect ? "?redirect=" + encodeURIComponent(redirect) : "")} className="text-[#1A5DAB] font-semibold hover:text-[#4C9EFF] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
