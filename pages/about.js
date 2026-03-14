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

export default function About() {
  const [openPage, setOpenPage] = useState(null);
  const handleOpenPage = (page) => setOpenPage(page);
  const handleClosePage = () => setOpenPage(null);

  return (
    <>
      <Head>
        <title>About Us | M&M Fashion</title>
        <meta
          name="description"
          content="Discover the story behind M&M Fashion — our mission, values, and dedication to style, quality, and confidence."
        />
      </Head>

      <div className={`${playfair.className} bg-white text-gray-800 min-h-screen`}>
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6 md:px-10 bg-gradient-to-b from-blue-50 via-white to-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight mb-4">
              The <span className="text-blue-600">M&M Fashion</span> Story
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              We’re redefining everyday fashion — blending elegance, comfort, and affordability for everyone who believes style should be effortless.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex justify-center"
          >
            <div className="relative w-full max-w-3xl h-72 md:h-96 rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-fashion-hero.jpg"
                alt="Fashion showcase"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </section>

        {/* Our Story */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                M&M Fashion began with one simple goal — to make **quality fashion accessible** without losing the spirit of individuality. 
                From humble beginnings, our journey has been about building trust through **style, authenticity, and service**.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We’ve grown into a trusted name known for our curated collections, a commitment to craftsmanship, and a deep understanding of what modern customers truly want.
              </p>
            </div>
            <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-md">
              <Image
                src="/images/about-story.jpg"
                alt="Our story"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* Mission and Vision */}
        <section className="bg-blue-50 py-16 px-6 md:px-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To empower people with **style that inspires confidence**, combining affordability with timeless design and exceptional customer experience.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be Africa’s **most admired fashion brand**, celebrated for innovation, integrity, and inclusive style that reflects every personality.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {[
                { title: "Integrity", text: "We deliver what we promise — quality, trust, and transparency." },
                { title: "Customer Focus", text: "Our customers inspire every collection and every innovation." },
                { title: "Creativity", text: "We celebrate individuality through unique, expressive fashion." },
                { title: "Community", text: "We support local talent and empower our team with fairness and respect." },
              ].map((value, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="text-blue-700 font-semibold text-lg mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Brand Promise */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center py-20 px-6"
        >
          <h2 className="text-3xl font-bold mb-4">Our Promise</h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            We promise to bring fashion that speaks your language — elegant, bold, and affordable.  
            Every outfit, every experience, every moment with M&M Fashion is designed to make you feel confident and special.
          </p>
        </motion.section>

        <Footer onOpenPage={handleOpenPage} />

        {/* Modal for Footer Pages */}
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
