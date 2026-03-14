"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLogOut, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const { customer, logout } = useAuth();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
          customer
            ? "bg-[#1F2D3D] text-white hover:bg-[#1A2332] shadow-sm"
            : "bg-[#E6F0FA] text-[#5A6171] hover:bg-[#D4E3F7]"
        }`}
        aria-label="Account"
      >
        <FiUser className="text-lg" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-56 bg-white rounded-xl border border-[#E6F0FA] overflow-hidden z-50"
            style={{ boxShadow: "0 8px 32px rgba(31,45,61,0.1)" }}
          >
            {customer ? (
              <div className="p-4">
                <p className="text-[#1F2D3D] font-semibold text-sm">{customer.name}</p>
                <p className="text-[10px] text-[#4C9EFF] uppercase tracking-wider mt-0.5">Member</p>

                <div className="h-px bg-[#E6F0FA] my-3" />

                <Link
                  href="/account"
                  className="flex items-center justify-between text-sm text-[#5A6171] font-medium py-2 px-3 rounded-lg hover:bg-[#E6F0FA] hover:text-[#1F2D3D] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  My Account
                  <FiChevronRight size={14} />
                </Link>

                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="w-full flex items-center gap-2 text-left text-sm font-medium text-[#B76E79] py-2 px-3 rounded-lg hover:bg-[#FEF2F2] transition-colors"
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-xs font-medium text-[#5A6171] mb-3">Welcome to M&M Fashion</p>

                <Link
                  href="/login"
                  className="block text-sm font-semibold text-[#1F2D3D] py-2.5 px-3 rounded-lg bg-[#E6F0FA] hover:bg-[#D4E3F7] transition-colors text-center mb-2"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="block text-sm font-medium text-[#1A5DAB] py-2 px-3 rounded-lg hover:bg-[#E6F0FA] transition-colors text-center"
                  onClick={() => setOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
