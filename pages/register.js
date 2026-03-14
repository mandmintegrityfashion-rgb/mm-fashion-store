"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      setNotification("⚠️ Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/register", form);

      if (res.data?.success) {
        setNotification("✅ Registration successful! Please check your email and verify your account.");
        
        // Optional: redirect after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setNotification(res.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setNotification("❌ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create an Account
          </h1>

          {notification && (
            <div className="mb-4 p-3 rounded-lg text-sm text-white bg-yellow-500">
              {notification}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
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
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-yellow-600 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
