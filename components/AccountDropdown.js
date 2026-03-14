"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const { customer, logout } = useAuth();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-all duration-200 ${
          customer
            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white hover:shadow-lg hover:scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-label="Account"
      >
        <FiUser className="text-xl" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {customer ? (
              <div className="p-4">
                <p className="text-gray-900 font-semibold text-base">{customer.name}</p>
                <p className="text-xs text-gray-500">Welcome back ✨</p>

                <hr className="my-3 border-gray-200" />

                <Link
                  href="/account"
                  className="block text-sm text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  My Account
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full text-left text-sm font-medium text-red-500 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Welcome 👋</p>

                <Link
                  href="/login"
                  className="block text-sm font-medium text-gray-800 py-2 px-3 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="block text-sm font-medium text-gray-800 py-2 px-3 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
