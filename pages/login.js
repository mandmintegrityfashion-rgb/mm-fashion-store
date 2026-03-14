"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Playfair_Display } from "next/font/google";

// Import Playfair Display font
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
      const res = await axios.post("/api/auth/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.success && res.data.token) {
        login(res.data.token);
        const target = typeof redirect === "string" && redirect ? redirect : "/";
        router.replace(target);
        return;
      } else {
        setServerMsg(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerMsg(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1
            className={`${playfair.className} text-2xl font-bold text-gray-800 mb-4 text-center`}
          >
            Login to Your Account
          </h1>

          {verified && (
            <div className="bg-green-50 border border-green-200 p-3 rounded mb-4 text-green-800 text-sm">
              Email verified — you may now log in.
            </div>
          )}

          {serverMsg && (
            <div className="bg-red-50 border border-red-200 p-3 rounded mb-4 text-red-800 text-sm">
              {serverMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition shadow-md ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Don’t have an account?{" "}
            <Link
              href={`/register${
                redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""
              }`}
              className="text-yellow-600 font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
