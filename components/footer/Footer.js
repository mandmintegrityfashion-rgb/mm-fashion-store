// components/Footer/Footer.js
"use client";

import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer({ onOpenPage }) {
  return (
    <footer className="bg-white text-blue-900 border-t border-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
        {/* Brand Info */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <img src="/images/Logo.png" alt="Oma Logo" className="w-12 h-12" />
            <div className="flex flex-col -ml-2">
              <span className="text-lg font-bold">M&M</span>
              <span className="text-sm font-bold">Fashion</span>
            </div>
          </div>
          <p className="text-gray-600">Lekki Scheme 2, Lagos, Nigeria</p>
          <p className="text-gray-600">
            Email:{" "}
            <a
              href="mailto:mandmintegrityfashion@gmail.com"
              className="text-blue-500 hover:text-blue-600"
            >
              mandmintegrityfashion <br></br>@gmail.com
            </a>
          </p>
          <p className="text-gray-600">
            Phone: +234-816-664-1324, +234-816-829-9695
          </p>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Care</h3>
          <ul className="space-y-2 text-gray-700">
            {[
              "Faq",
              "Refunds",
              "Terms",
              "Privacy",
              "SizeGuide",
              "Reviews",
              "Feedback",
            ].map((page) => (
              <li key={page}>
                <button
                  onClick={() => onOpenPage(page)}
                  className="hover:text-blue-500 transition-colors text-sm"
                >
                  {page.replace(/([A-Z])/g, " $1").trim()}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery & Payment */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Delivery & Payment</h3>
          <ul className="space-y-2 text-gray-700">
            {["DeliveryInfo", "PayOnDelivery"].map((page) => (
              <li key={page}>
                <button
                  onClick={() => onOpenPage(page)}
                  className="hover:text-blue-500 transition-colors text-sm"
                >
                  {page.replace(/([A-Z])/g, " $1").trim()}
                </button>
              </li>
            ))}
            <li className="text-sm">
              <strong>Pick Up Hours:</strong> Mon - Fri 12:00pm - 5:30pm
            </li>
          </ul>
        </div>

        {/* Hours of Operation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Hours of Operation</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <strong>Call-in Hours (GMT+1):</strong> Mon - Fri 9:00am - 5:30pm
            </li>
            <li>
              <strong>Chat Hours (GMT+1):</strong> Mon - Fri 9:30am - 9:00pm
            </li>
            <li>
              <strong>Weekend:</strong> Flexible (responses may be slower)
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between px-6">
        <span className="text-sm text-gray-500 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} M&M Fashion. All Rights Reserved.
        </span>
        <div className="flex space-x-4 text-blue-600">
          <a
            href="https://web.facebook.com/people/Allure-Suite/61567780641202/"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800 transition-colors"
          >
            <FaFacebook size={20} />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800 transition-colors"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800 transition-colors"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800 transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
