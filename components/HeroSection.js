"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {
  const fallbackSlides = [
    {
      title: "Quality & Affordability",
      subtitle:
        "Discover the latest fashion trends and timeless styles. Shop now and elevate your wardrobe with our curated collection.",
      bgImage: "/images/Hero-bg-01.png",
      image: "/images/Hero-model-02.png",
      ctaText: "Shop Now",
      ctaLink: "/shop/shop",
      _id: "fallback-1",
    },
  ];

  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);

  // Fetch slides from API
  useEffect(() => {
    let mounted = true;

    const normalizeSlide = (s) => {
      const bg = Array.isArray(s.bgImage) ? s.bgImage[0] : s.bgImage;
      const img = Array.isArray(s.image) ? s.image[0] : s.image;
      return {
        _id: s._id,
        title: s.title || "",
        subtitle: s.subtitle || "",
        bgImage: bg || "/images/Hero-bg-01.png",
        image: img || "/images/Hero-model-02.png",
        ctaText: s.ctaText || "Shop Now",
        ctaLink: s.ctaLink || "/shop/shop",
        status: s.status || "active",
        order: s.order || 0,
      };
    };




    const fetchSlides = async () => {
      try {
        const res = await axios.get("/api/heroes");
        if (!Array.isArray(res.data)) throw new Error("Invalid response");

        const active = res.data
          .filter(
            (s) =>
              s &&
              (String(s.status || "").toLowerCase() === "active" ||
                s.isActive === true)
          )
          .map(normalizeSlide)
          .sort((a, b) => a.order - b.order);

        if (mounted) setSlides(active.length ? active : fallbackSlides);
      } catch (err) {
        if (mounted) setSlides(fallbackSlides);
      }
    };

    fetchSlides();
    return () => {
      mounted = false;
    };
  }, []);

  // Preload images
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.bgImage) new Image().src = slide.bgImage?.full;
      if (slide.image) new Image().src = slide.image?.full;
    });
  }, [slides]);

  // Auto-advance
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (!slides || slides.length === 0) return null;



  return (
    <section className="relative w-full min-h-[500px] flex items-center overflow-hidden bg-white">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current]._id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].bgImage?.full || slides[current].bgImage}
            alt={slides[current].title + " background"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-50/60" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full px-6 md:px-12 py-12 gap-8">
        {/* Left Image (Desktop) */}
        {slides[current].image && (
          <motion.div
            key={`model-${slides[current]._id}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="hidden md:flex flex-1 justify-center md:justify-start"
          >
            <img
              src={slides[current].image?.full}
              alt="Hero Model"
              className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain drop-shadow-lg"
            />
          </motion.div>
        )}

        {/* Right Content */}
        <motion.div
          key={`content-${slides[current]._id}`}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 1 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-4 leading-tight">
            {slides[current].title}
          </h1>

          {slides[current].subtitle && (
            <p className="text-base md:text-lg text-blue-800 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              {slides[current].subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start">
            <Link href={slides[current].ctaLink || "/shop/shop"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow-md hover:shadow-lg transition"
              >
                {slides[current].ctaText || "Shop Now"}
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl border border-blue-400 text-blue-700 font-medium hover:bg-blue-50 transition"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full text-blue-700 hover:bg-white transition shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full text-blue-700 hover:bg-white transition shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition ${
                  idx === current
                    ? "bg-blue-500 scale-125"
                    : "bg-blue-200 hover:bg-blue-400/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
