"use client";

import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import * as FooterPages from "@/components/footer/pages";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Playfair_Display } from "next/font/google";
import axios from "axios";
import React from "react";
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function Contact() {
  const [openPage, setOpenPage] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [focused, setFocused] = useState({});

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
      setStatus({ type: "error", msg: err.response?.data?.error || "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    "w-full border rounded-xl px-4 py-3 bg-transparent outline-none text-sm text-[#0F1923] placeholder:text-[#B8BCC6] transition-all duration-200 " +
    (focused[name] ? "border-[#C9A96E] shadow-[0_0_0_3px_rgba(201,169,110,0.08)]" : "border-[#E8E0D4]");

  return (
    <>
      <Head>
        <title>Contact Us | M&M Fashion</title>
        <meta name="description" content="Get in touch with M&M Fashion." />
      </Head>

      <div className={`${playfair.className} bg-[#FDFBF7] min-h-screen`}>
        <Navbar />

        {/* Hero */}
        <section className="py-20 text-center px-6 bg-[#FDFBF7]">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] font-semibold">Get In Touch</span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F1923] mt-3">
              Contact <span className="text-[#C9A96E]">Us</span>
            </h1>
            <p className="text-[#5A6171] text-base md:text-lg max-w-2xl mx-auto mt-4">
              Have a question, suggestion, or partnership idea? Our team is always happy to connect.
            </p>
          </motion.div>
        </section>

        {/* Contact Info + Form */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12 items-start">
          {/* Left Info */}
          <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="space-y-8">
            <div>
              <div className="w-10 h-0.5 bg-[#C9A96E] mb-4 rounded-full" />
              <h2 className="text-2xl font-bold text-[#0F1923] mb-3">Let us Talk</h2>
              <p className="text-[#5A6171] leading-relaxed text-sm">
                Whether it is about your latest order, our collection, or collaborations - we are here to listen.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: FiPhone, text: "+234 816 664 1324" },
                { icon: FiMail, text: "mandmintegrityfashion@gmail.com" },
                { icon: FiMapPin, text: "Lekki Scheme 2, Lagos, Nigeria" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
                    <Icon className="text-[#C9A96E]" size={16} />
                  </div>
                  <span className="text-[#5A6171] text-sm">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-2xl p-8 border border-[#F0EBE3]" style={{ boxShadow: "0 4px 16px rgba(15,25,35,0.06)" }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name"
                  onFocus={() => setFocused(p => ({...p, name: true}))} onBlur={() => setFocused(p => ({...p, name: false}))}
                  className={inputClass("name")} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                  onFocus={() => setFocused(p => ({...p, email: true}))} onBlur={() => setFocused(p => ({...p, email: false}))}
                  className={inputClass("email")} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A6171] mb-1.5 uppercase tracking-wider">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows="5" placeholder="Write your message..."
                  onFocus={() => setFocused(p => ({...p, message: true}))} onBlur={() => setFocused(p => ({...p, message: false}))}
                  className={inputClass("message") + " resize-none"} required />
              </div>

              <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
                className={"w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all " +
                  (loading ? "bg-[#E8E0D4] text-[#8E95A2] cursor-not-allowed" : "bg-[#0F1923] text-white hover:bg-[#1A2332]")}>
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Message <FiSend size={14} /></>}
              </motion.button>

              <AnimatePresence>
                {status && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className={"flex items-center gap-2 justify-center text-sm font-medium mt-2 " +
                      (status.type === "success" ? "text-green-700" : "text-[#B76E79]")}>
                    {status.type === "success" ? <FiCheck size={14} /> : <FiAlertCircle size={14} />}
                    {status.msg}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </section>

        {/* Bottom Note */}
        <section className="bg-[#F5F0E8] py-10 text-center px-6">
          <p className="text-[#5A6171] text-sm">
            Available Monday - Saturday, 9am - 6pm. Follow us on social media for the latest updates!
          </p>
        </section>

        <Footer onOpenPage={handleOpenPage} />

        {openPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative border border-[#F0EBE3]"
              style={{ boxShadow: "0 16px 48px rgba(15,25,35,0.12)" }}>
              <button onClick={handleClosePage} className="absolute top-4 right-4 text-[#8E95A2] hover:text-[#0F1923] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F0E8]">
                <span className="text-lg font-bold">&times;</span>
              </button>
              {React.createElement(FooterPages[openPage])}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
