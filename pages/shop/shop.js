"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState({});
  const [visibleCount, setVisibleCount] = useState(12); // 👈 products per load
  const [showTopButton, setShowTopButton] = useState(false); // 👈 show back to top

  // Fetch all products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // ✅ Dynamically compute available properties based on selected categories
  const propertyOptions = useMemo(() => {
    const visibleProducts =
      selectedCategories.length > 0
        ? products.filter((p) => selectedCategories.includes(p.category))
        : products;

    const options = {};
    visibleProducts.forEach((product) => {
      if (Array.isArray(product.properties)) {
        product.properties.forEach(({ propName, propValue }) => {
          if (!options[propName]) options[propName] = new Set();
          options[propName].add(propValue);
        });
      }
    });

    for (const key in options) {
      options[key] = Array.from(options[key]);
    }

    return options;
  }, [products, selectedCategories]);

  // Category selection toggle
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Property filter selection toggle
  const toggleProperty = (propName, value) => {
    setSelectedProperties((prev) => {
      const current = prev[propName] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [propName]: current.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [propName]: [...current, value],
        };
      }
    });
  };

  // ✅ Apply filters (categories + properties + sort)
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(p.category)
        ) {
          return false;
        }

        // Property filter
        return Object.entries(selectedProperties).every(
          ([propName, propValues]) => {
            if (propValues.length === 0) return true;
            const productValues =
              p.properties
                ?.filter((prop) => prop.propName === propName)
                .map((prop) => prop.propValue) || [];
            return productValues.some((val) => propValues.includes(val));
          }
        );
      })
      .sort((a, b) =>
        sort === "asc"
          ? (a.salePriceIncTax || 0) - (b.salePriceIncTax || 0)
          : sort === "desc"
          ? (b.salePriceIncTax || 0) - (a.salePriceIncTax || 0)
          : 0
      );
  }, [products, selectedCategories, selectedProperties, sort]);

  // ✅ Lazy loading (infinite scroll)
  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 300;

      // Load more when near bottom
      if (scrollPosition >= threshold) {
        setVisibleCount((prev) =>
          prev < filteredProducts.length ? prev + 12 : prev
        );
      }

      // Toggle back-to-top button
      setShowTopButton(window.scrollY > 600);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredProducts]);

  // ✅ Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedProperties({});
    setSort(null);
  };

  // ✅ Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-blue-100 min-h-screen font-sans">
      <Navbar />

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-16 gap-10">
        {/* Sidebar */}
        <div className="flex-1 min-w-[260px] lg:sticky lg:top-24 flex flex-col gap-8">
          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-8 hover:shadow-lg transition duration-500">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800 tracking-wide">
              Categories
            </h2>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-blue-700 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat._id)}
                    onChange={() => toggleCategory(cat._id)}
                    className="accent-blue-600 scale-110"
                  />
                  <span className="font-medium">{cat.name}</span>
                </label>
              ))}
            </div>

            {/* ✅ Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="w-full py-2 mt-4 text-center bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>

          {/* Property Filters */}
          {Object.keys(propertyOptions).length > 0 && (
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-8 hover:shadow-lg transition duration-500">
              <h2 className="text-2xl font-semibold mb-4 text-blue-800 tracking-wide">
                Filter by Properties
              </h2>
              {Object.entries(propertyOptions).map(([propName, values]) => (
                <div key={propName} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {propName}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {values.map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-blue-700 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedProperties[propName]?.includes(value) ||
                            false
                          }
                          onChange={() => toggleProperty(propName, value)}
                          className="accent-blue-600 scale-110"
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sort */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-8 hover:shadow-lg transition duration-500">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800 tracking-wide">
              Sort By
            </h2>
            <div className="flex flex-col gap-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-blue-700 transition-all">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === "asc"}
                  onChange={() => setSort("asc")}
                  className="accent-blue-600 scale-110"
                />
                <span>Price (Lowest First)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-blue-700 transition-all">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === "desc"}
                  onChange={() => setSort("desc")}
                  className="accent-blue-600 scale-110"
                />
                <span>Price (Highest First)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-[3] flex flex-col gap-7">
          <h2 className="text-3xl font-bold text-blue-800 tracking-wide">
            All Products
          </h2>

          {loading ? (
            <p className="text-center text-lg font-semibold text-blue-600 animate-pulse">
              Loading products...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-xl font-medium text-blue-700">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <div
                  key={product._id}
                  className="flex justify-center items-center p-1 sm:p-2"
                >
                  <div className="w-[90%] sm:w-[95%]">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Back to Top Button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-700 text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-all duration-300 animate-fadeIn"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
