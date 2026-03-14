"use client";

import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import * as FooterPages from "@/components/footer/pages";
import { motion } from "framer-motion";
import { useState } from "react";
import { Playfair_Display } from "next/font/google";
import axios from "axios";
import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-playfair",
});

export default function Contact() {
  const [openPage, setOpenPage] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleOpenPage = (page) => setOpenPage(page);
  const handleClosePage = () => setOpenPage(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await axios.post("/api/contactPage", form);
      if (res.data.success) {
        setStatus({ type: "success", msg: "Message sent successfully!" });
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.error || "Failed to send message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | M&M Fashion</title>
        <meta
          name="description"
          content="Get in touch with M&M Fashion — we’d love to hear from you."
        />
      </Head>

      <div className={`${playfair.className} bg-white min-h-screen text-gray-800`}>
        <Navbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 py-20 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold text-blue-900"
          >
            Contact <span className="text-blue-600">M&M Fashion</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mt-4"
          >
            Have a question, suggestion, or partnership idea?  
            Our team is always happy to connect with you.
          </motion.p>
        </section>

        {/* Contact Info + Form */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12 items-start">
          {/* Left Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Let’s Talk
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Whether it’s about your latest order, our collection, or collaborations — we’re here to listen.  
              Send us a message, and we’ll respond promptly.
            </p>

            <div className="space-y-6 mt-10">
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-blue-600 text-xl" />
                <span className="text-gray-700 font-medium">
                  +234 801 234 5678
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-blue-600 text-xl" />
                <span className="text-gray-700 font-medium">
                  support@mnmfashion.com
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
                <span className="text-gray-700 font-medium">
                  45 Eleganza Avenue, Lekki, Lagos, Nigeria
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 rounded-3xl shadow-md p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-blue-900 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full border border-blue-100 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-blue-900 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-blue-100 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-blue-900 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full border border-blue-100 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-xl shadow-md transition-colors duration-300 ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p
                  className={`mt-4 text-center font-medium ${
                    status.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status.msg}
                </p>
              )}
            </form>
          </motion.div>
        </section>

        {/* Map Section (Optional) */}
        <section className="w-full bg-gradient-to-b from-blue-50 to-white py-10 text-center">
          <p className="text-gray-600 text-sm">
            We’re available Monday–Saturday, 9am–6pm.  
            Follow us on social media for the latest updates and styles!
          </p>
        </section>

        <Footer onOpenPage={handleOpenPage} />

        {/* Footer Modal */}
        {openPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative"
            >
              <button
                onClick={handleClosePage}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-lg"
              >
                ×
              </button>
              {React.createElement(FooterPages[openPage])}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
