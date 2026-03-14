// components/Footer/Footer.js
"use client";

import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Footer({ onOpenPage }) {
  return (
    <footer className="bg-[#1F2D3D] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
        {/* Brand Info */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <img src="/images/Logo.png" alt="M&M Logo" className="w-12 h-12 rounded-lg" />
            <div className="flex flex-col -ml-1">
              <span className={`${playfair.className} text-lg font-bold text-white`}>M&M</span>
              <span className="text-xs font-medium text-[#4C9EFF] tracking-wider">FASHION</span>
            </div>
          </div>
          <p className="text-[#8E95A2] text-sm leading-relaxed">Lekki Scheme 2, Lagos, Nigeria</p>
          <p className="text-[#8E95A2] text-sm">
            Email:{" "}
            <a href="mailto:mandmintegrityfashion@gmail.com" className="text-[#4C9EFF] hover:text-white transition-colors">
              mandmintegrityfashion<br />@gmail.com
            </a>
          </p>
          <p className="text-[#8E95A2] text-sm">Phone: +234-816-664-1324, +234-816-829-9695</p>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Customer Care</h3>
          <ul className="space-y-2.5">
            {["Faq", "Refunds", "Terms", "Privacy", "SizeGuide", "Reviews", "Feedback"].map((page) => (
              <li key={page}>
                <button
                  onClick={() => onOpenPage(page)}
                  className="text-[#8E95A2] hover:text-[#4C9EFF] transition-colors text-sm"
                >
                  {page.replace(/([A-Z])/g, " $1").trim()}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery & Payment */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Delivery & Payment</h3>
          <ul className="space-y-2.5">
            {["DeliveryInfo", "PayOnDelivery"].map((page) => (
              <li key={page}>
                <button
                  onClick={() => onOpenPage(page)}
                  className="text-[#8E95A2] hover:text-[#4C9EFF] transition-colors text-sm"
                >
                  {page.replace(/([A-Z])/g, " $1").trim()}
                </button>
              </li>
            ))}
            <li className="text-sm text-[#8E95A2] pt-1">
              <strong className="text-white/80">Pick Up:</strong> Mon - Fri 12:00pm - 5:30pm
            </li>
          </ul>
        </div>

        {/* Hours of Operation */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Operating Hours</h3>
          <ul className="space-y-2.5 text-sm text-[#8E95A2]">
            <li><strong className="text-white/80">Call-in (GMT+1):</strong> Mon - Fri 9am - 5:30pm</li>
            <li><strong className="text-white/80">Chat (GMT+1):</strong> Mon - Fri 9:30am - 9pm</li>
            <li><strong className="text-white/80">Weekend:</strong> Flexible responses</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="h-px bg-white/10" />
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between px-6 gap-4">
        <span className="text-xs text-[#5A6171]">
          &copy; {new Date().getFullYear()} M&M Fashion. All Rights Reserved.
        </span>
        <div className="flex items-center gap-4">
          <a href="https://web.facebook.com/people/Allure-Suite/61567780641202/" aria-label="Facebook" target="_blank" rel="noopener noreferrer"
            className="text-[#5A6171] hover:text-[#4C9EFF] transition-colors"><FaFacebook size={16} /></a>
          <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer"
            className="text-[#5A6171] hover:text-[#4C9EFF] transition-colors"><FaTwitter size={16} /></a>
          <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer"
            className="text-[#5A6171] hover:text-[#4C9EFF] transition-colors"><FaInstagram size={16} /></a>
          <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"
            className="text-[#5A6171] hover:text-[#4C9EFF] transition-colors"><FaLinkedin size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
