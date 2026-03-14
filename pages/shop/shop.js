"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { FiFilter, FiX, FiChevronUp, FiSliders } from "react-icons/fi";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","500","600","700"] });

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState({});
  const [visibleCount, setVisibleCount] = useState(12);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data || []);
      } catch (error) { console.error("Failed to fetch products:", error); setProducts([]); }
      finally { setLoading(false); }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (error) { console.error("Failed to fetch categories:", error); }
    }
    fetchCategories();
  }, []);

  const propertyOptions = useMemo(() => {
    const visibleProducts = selectedCategories.length > 0 ? products.filter((p) => selectedCategories.includes(p.category)) : products;
    const options = {};
    visibleProducts.forEach((product) => {
      if (Array.isArray(product.properties)) {
        product.properties.forEach(({ propName, propValue }) => {
          if (!options[propName]) options[propName] = new Set();
          options[propName].add(propValue);
        });
      }
    });
    for (const key in options) options[key] = Array.from(options[key]);
    return options;
  }, [products, selectedCategories]);

  const toggleCategory = (id) => setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  const toggleProperty = (propName, value) => {
    setSelectedProperties((prev) => {
      const current = prev[propName] || [];
      return { ...prev, [propName]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] };
    });
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
        return Object.entries(selectedProperties).every(([propName, propValues]) => {
          if (propValues.length === 0) return true;
          const productValues = p.properties?.filter((prop) => prop.propName === propName).map((prop) => prop.propValue) || [];
          return productValues.some((val) => propValues.includes(val));
        });
      })
      .sort((a, b) => sort === "asc" ? (a.salePriceIncTax || 0) - (b.salePriceIncTax || 0) : sort === "desc" ? (b.salePriceIncTax || 0) - (a.salePriceIncTax || 0) : 0);
  }, [products, selectedCategories, selectedProperties, sort]);

  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        setVisibleCount((prev) => prev < filteredProducts.length ? prev + 12 : prev);
      }
      setShowTopButton(window.scrollY > 600);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredProducts]);

  const clearFilters = () => { setSelectedCategories([]); setSelectedProperties({}); setSort(null); };
  const activeFilterCount = selectedCategories.length + Object.values(selectedProperties).reduce((sum, v) => sum + v.length, 0) + (sort ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0EBE3]" style={{ boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <h3 className="text-xs font-semibold text-[#5A6171] uppercase tracking-wider mb-4">Categories</h3>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-3 cursor-pointer text-sm text-[#5A6171] hover:text-[#0F1923] transition-colors">
              <input type="checkbox" checked={selectedCategories.includes(cat._id)} onChange={() => toggleCategory(cat._id)}
                className="w-4 h-4 rounded border-[#E8E0D4] text-[#C9A96E] focus:ring-[#C9A96E]" />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="w-full py-2 mt-4 text-xs font-medium text-[#B76E79] hover:bg-[#FEF2F2] rounded-lg transition-colors">
            Clear Filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Property Filters */}
      {Object.keys(propertyOptions).length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-[#F0EBE3]" style={{ boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
          <h3 className="text-xs font-semibold text-[#5A6171] uppercase tracking-wider mb-4">Properties</h3>
          {Object.entries(propertyOptions).map(([propName, values]) => (
            <div key={propName} className="mb-4">
              <h4 className="text-sm font-semibold text-[#0F1923] mb-2">{propName}</h4>
              <div className="flex flex-col gap-2">
                {values.map((value) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer text-sm text-[#5A6171] hover:text-[#0F1923] transition-colors">
                    <input type="checkbox" checked={selectedProperties[propName]?.includes(value) || false} onChange={() => toggleProperty(propName, value)}
                      className="w-4 h-4 rounded border-[#E8E0D4] text-[#C9A96E] focus:ring-[#C9A96E]" />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sort */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0EBE3]" style={{ boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <h3 className="text-xs font-semibold text-[#5A6171] uppercase tracking-wider mb-4">Sort By</h3>
        <div className="flex flex-col gap-2.5">
          {[{ val: "asc", label: "Price: Low to High" }, { val: "desc", label: "Price: High to Low" }].map(({ val, label }) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer text-sm text-[#5A6171] hover:text-[#0F1923] transition-colors">
              <input type="radio" name="sort" checked={sort === val} onChange={() => setSort(val)}
                className="w-4 h-4 border-[#E8E0D4] text-[#C9A96E] focus:ring-[#C9A96E]" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={playfair.className + " text-2xl sm:text-3xl font-bold text-[#0F1923]"}>All Products</h1>
            <p className="text-sm text-[#8E95A2] mt-1">{filteredProducts.length} products</p>
          </div>
          <button onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E0D4] rounded-xl text-sm text-[#0F1923] hover:border-[#C9A96E] transition-colors">
            <FiSliders size={14} /> Filters {activeFilterCount > 0 && <span className="bg-[#C9A96E] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-[260px] flex-shrink-0 sticky top-24 self-start">
            <FilterSidebar />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#F0EBE3] animate-pulse">
                    <div className="aspect-[3/4] bg-[#F5F0E8] rounded-t-2xl" />
                    <div className="p-4 space-y-2"><div className="h-3 bg-[#F5F0E8] rounded w-3/4" /><div className="h-3 bg-[#F5F0E8] rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#8E95A2] text-sm">No products found.</p>
                {activeFilterCount > 0 && <button onClick={clearFilters} className="text-[#C9A96E] text-sm font-medium mt-2 hover:text-[#A88B4A]">Clear filters</button>}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.slice(0, visibleCount).map((product, i) => (
                  <motion.div key={product._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: (i % 3) * 0.06, duration: 0.35 }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25 }}
            className="absolute right-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-[#FDFBF7] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={"text-lg font-bold text-[#0F1923] " + playfair.className}>Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F0E8] text-[#5A6171]">
                <FiX size={18} />
              </button>
            </div>
            <FilterSidebar />
          </motion.div>
        </div>
      )}

      {/* Back to Top */}
      {showTopButton && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#0F1923] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1A2332] transition-colors z-40">
          <FiChevronUp size={20} />
        </motion.button>
      )}
    </div>
  );
}
