"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export default function HeroSection() {
  const fallbackSlides = [
    {
      title: "Quality & Affordability",
      subtitle: "Discover the latest fashion trends and timeless styles. Shop now and elevate your wardrobe with our curated collection.",
      bgImage: "/images/Hero-bg-01.png",
      image: "/images/Hero-model-02.png",
      ctaText: "Shop Now",
      ctaLink: "/shop/shop",
      _id: "fallback-1",
    },
  ];

  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

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
          .filter((s) => s && (String(s.status || "").toLowerCase() === "active" || s.isActive === true))
          .map(normalizeSlide)
          .sort((a, b) => a.order - b.order);
        if (mounted) setSlides(active.length ? active : fallbackSlides);
      } catch {
        if (mounted) setSlides(fallbackSlides);
      }
    };
    fetchSlides();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.bgImage) { const img = new window.Image(); img.src = slide.bgImage?.full || slide.bgImage; }
      if (slide.image) { const img = new window.Image(); img.src = slide.image?.full || slide.image; }
    });
  }, [slides]);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  const goNext = useCallback(() => { setDirection(1); setCurrent((prev) => (prev + 1) % slides.length); }, [slides.length]);
  const goPrev = useCallback(() => { setDirection(-1); setCurrent((prev) => (prev - 1 + slides.length) % slides.length); }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden bg-ivory">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current]._id + "-bg"}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].bgImage?.full || slides[current].bgImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/80 via-ivory/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full px-6 md:px-12 py-16 gap-8">
        {/* Text Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`content-${slides[current]._id}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 text-center md:text-left z-10"
          >
            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-[#1A5DAB] mb-4 border border-[#E6F0FA] px-4 py-1.5 rounded-full bg-white/60"
            >
              New Collection
            </motion.span>

            <h1 className={`${playfair.className} text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-midnight mb-6 leading-[1.1]`}>
              {slides[current].title}
            </h1>

            {slides[current].subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-lg text-[#5A6171] mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed"
              >
                {slides[current].subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link href={slides[current].ctaLink || "/shop/shop"}>
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 text-base rounded-xl bg-gradient-to-r from-[#4C9EFF] to-[#1A5DAB] text-white font-semibold shadow-lg hover:shadow-blue-400 transition-shadow"
                >
                  {slides[current].ctaText || "Shop Now"}
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 text-base rounded-xl border-1.5 border-[#D4E3F7] text-midnight font-medium hover:border-[#4C9EFF] hover:text-[#1A5DAB] hover:bg-[#E6F0FA] transition-all"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Image */}
        {slides[current].image && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`model-${slides[current]._id}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="hidden md:flex flex-1 justify-center"
            >
              <img
                src={slides[current].image?.full || slides[current].image}
                alt="Hero"
                className="max-w-sm md:max-w-md lg:max-w-lg object-contain drop-shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-midnight shadow-premium transition-all hover:shadow-premium-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-midnight shadow-premium transition-all hover:shadow-premium-lg"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
                className="relative w-8 h-1.5 rounded-full overflow-hidden bg-[#D4E3F7] transition-all"
              >
                <motion.div
                  className="absolute inset-0 bg-[#4C9EFF] rounded-full"
                  initial={false}
                  animate={{ scaleX: idx === current ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformOrigin: "left" }}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
