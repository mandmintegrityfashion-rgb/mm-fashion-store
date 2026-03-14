"use client";

import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import * as FooterPages from "@/components/footer/pages";
import { motion } from "framer-motion";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-playfair",
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function About() {
  const [openPage, setOpenPage] = useState(null);
  const handleOpenPage = (page) => setOpenPage(page);
  const handleClosePage = () => setOpenPage(null);

  return (
    <>
      <Head>
        <title>About Us | M&M Fashion</title>
        <meta name="description" content="Discover the story behind M&M Fashion." />
      </Head>

      <div className={`${playfair.className} bg-[#F7FAFC] min-h-screen`}>
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-6 md:px-10 bg-[#F7FAFC] text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#4C9EFF] font-semibold">Our Story</span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F2D3D] leading-tight mt-3 mb-4">
              The <span className="text-[#4C9EFF]">M&M Fashion</span> Story
            </h1>
            <p className="text-[#5A6171] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Redefining everyday fashion with elegance, comfort, and affordability for everyone who believes style should be effortless.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex justify-center">
            <div className="relative w-full max-w-3xl h-72 md:h-96 rounded-2xl overflow-hidden border border-[#E6F0FA]" style={{ boxShadow: "0 8px 32px rgba(31,45,61,0.08)" }}>
              <Image src="/images/about-fashion-hero.jpg" alt="Fashion showcase" fill className="object-cover" priority />
            </div>
          </motion.div>
        </section>

        {/* Our Story */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-10 h-0.5 bg-[#4C9EFF] mb-4 rounded-full" />
              <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">Our Story</h2>
              <p className="text-[#5A6171] leading-relaxed">
                M&M Fashion began with one simple goal - to make quality fashion accessible without losing the spirit of individuality.
                From humble beginnings, our journey has been about building trust through style, authenticity, and service.
              </p>
              <p className="mt-4 text-[#5A6171] leading-relaxed">
                We have grown into a trusted name known for curated collections, a commitment to craftsmanship, and a deep understanding of what modern customers truly want.
              </p>
            </div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-[#E6F0FA]" style={{ boxShadow: "0 4px 20px rgba(31,45,61,0.06)" }}>
              <Image src="/images/about-story.jpg" alt="Our story" fill className="object-cover" />
            </div>
          </motion.div>
        </section>

        {/* Mission and Vision */}
        <section className="bg-[#F1F5F9] py-16 px-6 md:px-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-[#E6F0FA]" style={{ boxShadow: "0 2px 12px rgba(31,45,61,0.04)" }}>
              <h3 className="text-xl font-bold text-[#1F2D3D] mb-3">Our Mission</h3>
              <p className="text-[#5A6171] leading-relaxed text-sm">
                To empower people with style that inspires confidence, combining affordability with timeless design and exceptional customer experience.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-[#E6F0FA]" style={{ boxShadow: "0 2px 12px rgba(31,45,61,0.04)" }}>
              <h3 className="text-xl font-bold text-[#1F2D3D] mb-3">Our Vision</h3>
              <p className="text-[#5A6171] leading-relaxed text-sm">
                To be Africa's most admired fashion brand, celebrated for innovation, integrity, and inclusive style that reflects every personality.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-2">Core Values</h2>
            <div className="w-12 h-0.5 bg-[#4C9EFF] mx-auto mt-2 mb-10 rounded-full" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Integrity", text: "We deliver what we promise - quality, trust, and transparency." },
                { title: "Customer Focus", text: "Our customers inspire every collection and innovation." },
                { title: "Creativity", text: "We celebrate individuality through unique, expressive fashion." },
                { title: "Community", text: "We support local talent and empower our team." },
              ].map((value, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-white rounded-2xl p-6 border border-[#E6F0FA] hover:border-[#4C9EFF] transition-colors"
                  style={{ boxShadow: "0 2px 12px rgba(31,45,61,0.04)" }}>
                  <h4 className="text-[#4C9EFF] font-semibold text-sm mb-2">{value.title}</h4>
                  <p className="text-[#5A6171] text-sm leading-relaxed">{value.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Brand Promise */}
        <motion.section {...fadeUp} transition={{ duration: 0.6 }}
          className="bg-[#1F2D3D] text-white text-center py-20 px-6">
          <h2 className="text-3xl font-bold mb-4">Our Promise</h2>
          <div className="w-12 h-0.5 bg-[#4C9EFF] mx-auto mb-6 rounded-full" />
          <p className="text-[#8E95A2] text-base leading-relaxed max-w-3xl mx-auto">
            We promise fashion that speaks your language - elegant, bold, and affordable.
            Every outfit, every experience, every moment with M&M Fashion is designed to make you feel confident and special.
          </p>
        </motion.section>

        <Footer onOpenPage={handleOpenPage} />

        {openPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative border border-[#E6F0FA]"
              style={{ boxShadow: "0 16px 48px rgba(31,45,61,0.12)" }}>
              <button onClick={handleClosePage} className="absolute top-4 right-4 text-[#8E95A2] hover:text-[#1F2D3D] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F5F9]">
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
