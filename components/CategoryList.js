import { useEffect, useState, useRef } from "react";
import CategoryCard from "./CategoryCard";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  // fallback images based on category name
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
    const scrollAmount = direction === "left" ? -250 : 250;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto mb-20 px-4 py-16 relative">
      {/* Section title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#3b3b3b] tracking-wide">
        Shop by Category
      </h2>

      {/* Scroll buttons (visible only on mobile) */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 sm:hidden z-10"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 sm:hidden z-10"
      >
        <ChevronRight size={22} />
      </button>

      {/* Categories container */}
      <div
        ref={scrollRef}
        className="
          flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar
          sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8
        "
      >
        {categories.length > 0 ? (
          categories.map((cat) => {
            const fallbackImage =
              fallbackImages[cat.name] || fallbackImages.default;



            return (
              <div
                key={cat._id}
                className="
                  flex-shrink-0 w-3/4 sm:w-auto
                  transition-transform duration-300 hover:scale-105
                "
              >
                <CategoryCard
                  title={cat.name}
                  image={cat.images?.[0]?.full || fallbackImage}
                  href={`/product?category=${cat.slug || cat._id}`}
                />
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No categories available.
          </p>
        )}
      </div>
    </section>
  );
}
