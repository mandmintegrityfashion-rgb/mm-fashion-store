import { useEffect, useState, useRef } from "react";
import CategoryCard from "./CategoryCard";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  const fallbackImages = {
    Wigs: "/categories/wigs3.webp",
    Extensions: "/categories/extensions1.png",
    "Hair Care": "/categories/haircare1.webp",
    "Hair Accessories": "/categories/HairAccessories1.jpg",
    default: "/categories/placeholder.jpg",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-[#0F1923]`}>
            Shop by Category
          </h2>
          <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mt-3 rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white border border-[#E8E0D4] text-[#0F1923] rounded-full flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all z-10 shadow-sm sm:hidden"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white border border-[#E8E0D4] text-[#0F1923] rounded-full flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all z-10 shadow-sm sm:hidden"
          >
            <FiChevronRight size={18} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth hide-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6"
          >
            {categories.length > 0 ? (
              categories.map((cat, i) => {
                const fallbackImage = fallbackImages[cat.name] || fallbackImages.default;
                return (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex-shrink-0 w-3/4 sm:w-auto"
                  >
                    <CategoryCard
                      title={cat.name}
                      image={cat.images?.[0]?.full || fallbackImage}
                      href={`/product?category=${cat.slug || cat._id}`}
                    />
                  </motion.div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-[#8E95A2] text-sm">
                No categories available.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
