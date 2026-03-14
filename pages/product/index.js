"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const catId = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [sort, setSort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState({}); // <-- for filtering

  // fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `/api/products${catId ? `?category=${catId}` : ""}`
        );
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
  }, [catId]);

  // fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data || []);

        if (catId) {
          const matched = data.find((cat) => cat._id === catId);
          setCategoryName(matched ? matched.name : "All");
        } else {
          setCategoryName("All");
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, [catId]);

  // Extract property options dynamically from products
  const propertyOptions = useMemo(() => {
    const options = {};
    products.forEach((product) => {
      if (Array.isArray(product.properties)) {
        product.properties.forEach(({ propName, propValue }) => {
          if (!options[propName]) options[propName] = new Set();
          options[propName].add(propValue);
        });
      }
    });
    // convert sets to arrays
    for (const key in options) {
      options[key] = Array.from(options[key]);
    }
    return options;
  }, [products]);

  // Handle selecting properties
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

  // Apply filters
  const filteredProducts = products

    .filter((p) => {
      // property filter
      return Object.entries(selectedProperties).every(
        ([propName, propValues]) => {
          if (propValues.length === 0) return true; // nothing selected
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

  return (
    <div className="bg-[#FDFBF7] min-h-screen font-sans">
      <Navbar />

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-16 gap-10">
        {/* Sidebar */}
        <div className="flex-1 min-w-[260px] lg:sticky lg:top-24 flex flex-col gap-8">
          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-[#F0EBE3] p-6">
            <h2 className="text-xl font-bold mb-5 text-[#0F1923]">
              {categoryName} Category
            </h2>

            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-4 cursor-pointer text-[#5A6171] hover:text-[#C9A96E] transition-all duration-300"
                >
                  <input
                    type="checkbox"
                    checked={cat._id === catId}
                    readOnly
                    className="accent-[#C9A96E] scale-125 hover:scale-135 transition-transform"
                  />
                  <span className="font-medium">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Filters */}
          {Object.keys(propertyOptions).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-[#F0EBE3] p-6">
              <h2 className="text-xl font-bold mb-5 text-[#0F1923]">
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
                        className="flex items-center gap-3 cursor-pointer text-[#5A6171] hover:text-[#C9A96E] transition-all duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedProperties[propName]?.includes(value) ||
                            false
                          }
                          onChange={() => toggleProperty(propName, value)}
                          className="accent-[#C9A96E] scale-110"
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
          <div className="bg-white rounded-xl shadow-sm border border-[#F0EBE3] p-6">
            <h2 className="text-xl font-bold mb-5 text-[#0F1923]">
              Sort By
            </h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-4 cursor-pointer text-[#5A6171] hover:text-[#C9A96E] transition-all duration-300">
                <input
                  type="radio"
                  name="sort"
                  onChange={() => setSort("asc")}
                  className="accent-[#C9A96E] scale-125"
                />
                <span className="font-medium">Price (Lowest First)</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer text-[#5A6171] hover:text-[#C9A96E] transition-all duration-300">
                <input
                  type="radio"
                  name="sort"
                  onChange={() => setSort("desc")}
                  className="accent-[#C9A96E] scale-125"
                />
                <span className="font-medium">Price (Highest First)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-[3] flex flex-col gap-12">
          {loading ? (
            <p className="text-center text-lg font-semibold text-[#C9A96E] animate-pulse">
              Loading luxurious products...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-xl font-medium text-[#5A6171]">
              No products found in this collection.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div className="bg-white rounded-xl shadow-sm border border-[#F0EBE3] hover:border-[#C9A96E] hover:shadow-md transition-all duration-150">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
