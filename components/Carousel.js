"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDrag } from "@use-gesture/react";

export default function Carousel({ products, title, color, bg }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(260 + 24); // default card width + gap
  const [cardHeight, setCardHeight] = useState(0);
  const velocityRef = useRef(0);

  // Check scroll position
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    setActiveIndex(Math.round(scrollLeft / clientWidth));
  };

  // Scroll function
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction * scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      if (
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
        scrollRef.current.scrollWidth
      ) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll(1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Drag + momentum
  useDrag(
    ({ down, movement: [mx], memo, velocity: [vx], last }) => {
      if (!scrollRef.current) return;
      if (down) {
        scrollRef.current.scrollLeft -= mx - (memo || 0);
        velocityRef.current = -vx * 1000;
        return mx;
      } else if (last) {
        const momentum = () => {
          if (!scrollRef.current) return;
          if (Math.abs(velocityRef.current) < 0.5) {
            const nearestIndex = Math.round(
              scrollRef.current.scrollLeft / itemWidth
            );
            scrollRef.current.scrollTo({
              left: nearestIndex * itemWidth,
              behavior: "smooth",
            });
            return;
          }
          scrollRef.current.scrollLeft += velocityRef.current;
          velocityRef.current *= 0.92;
          requestAnimationFrame(momentum);
        };
        momentum();
      }
    },
    { target: scrollRef, eventOptions: { passive: false } }
  );

  // Snap scaling & equal card height
  useAnimationFrame(() => {
    if (!scrollRef.current) return;
    const center =
      scrollRef.current.scrollLeft + scrollRef.current.clientWidth / 2;
    const items = scrollRef.current.children;
    let maxHeight = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.min(Math.abs(center - itemCenter), itemWidth * 2);
      const scale = 0.9 + 0.1 * (1 - distance / (itemWidth * 2));
      item.style.transform = `scale(${scale})`;
      const h = item.offsetHeight;
      if (h > maxHeight) maxHeight = h;
    }

    if (maxHeight && maxHeight !== cardHeight) {
      setCardHeight(maxHeight);
    }
  });

  // Set item width & handle resize
  useEffect(() => {
    if (scrollRef.current) {
      const gap = 24;
      const width = scrollRef.current.firstChild?.clientWidth || 260;
      setItemWidth(width + gap);
    }
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  if (!products?.length) return null;

  const itemsPerView = Math.floor(scrollRef.current?.clientWidth / 260) || 1;
  const dotCount = Math.ceil(products.length / itemsPerView);

  return (
    <section className={`w-full py-16 ${bg}`}>
      <div className="max-w-7xl mx-auto px-6 relative">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${color}`}>{title}</h2>
        <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto -mt-7 mb-10 rounded-full" />

        {/* Arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white border border-[#E8E0D4] text-[#0F1923] rounded-full flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all z-10 shadow-sm"
          >
            <FiChevronLeft size={28} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white border border-[#E8E0D4] text-[#0F1923] rounded-full flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all z-10 shadow-sm"
          >
            <FiChevronRight size={28} />
          </button>
        )}

        {/* Product Track */}
        <motion.div
          ref={scrollRef}
          className="flex overflow-x-auto overflow-y-hidden gap-6 snap-x snap-mandatory p-2"
          onScroll={checkScroll}
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              className="inline-block min-w-[260px] snap-start transform hover:scale-105 hover:shadow-2xl transition-all relative"
              style={{ height: cardHeight ? `${cardHeight}px` : "auto" }}
            >
              {product.isPromotion && (
                <div className="">
                  
                </div>
              )}
              {product.cardComponent && (
                <product.cardComponent product={product} lazy />
              )}
            </motion.div>
          ))}

          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
          `}</style>
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollRef.current.scrollTo({
                  left: i * scrollRef.current.clientWidth,
                  behavior: "smooth",
                });
              }}
              className={`w-2 h-2 rounded-full ${
                activeIndex === i ? "bg-[#C9A96E]" : "bg-[#E8E0D4]"
              } transition-all`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
