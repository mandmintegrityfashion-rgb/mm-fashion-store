/**
 * Lazy Product Grid - Loads products on demand with infinite scroll
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useInfiniteScroll } from "@/lib/useInfiniteScroll";
import LazyProductCard from "@/components/LazyProductCard";
import { motion } from "framer-motion";
import cacheManager from "@/lib/cacheManager";
import axios from "axios";

const PRODUCTS_PER_PAGE = 12;
const PRODUCTS_CACHE_TTL = 10; // 10 minutes

export function LazyProductGrid({
  initialProducts = [],
  category = null,
  search = null,
  sort = "newest",
  filters = {},
}) {
  const [allProducts, setAllProducts] = useState(initialProducts);
  const [error, setError] = useState(null);
  const scrollRef = useState(null)[1];

  // Generate cache key based on filters
  const getCacheKey = useCallback((page) => {
    const filterStr = JSON.stringify({
      category,
      search,
      sort,
      filters,
      page,
    });
    return `products_${Buffer.from(filterStr).toString("base64").slice(0, 20)}_${page}`;
  }, [category, search, sort, filters]);

  // Fetch products function
  const fetchMore = useCallback(
    async (page) => {
      const cacheKey = getCacheKey(page);

      // Check cache first
      const cached = cacheManager.get(cacheKey, PRODUCTS_CACHE_TTL);
      if (cached) {
        return cached;
      }

      try {
        const params = {
          page,
          limit: PRODUCTS_PER_PAGE,
          ...(category && { category }),
          ...(search && { search }),
          ...(sort && { sort }),
          ...filters,
        };

        const response = await axios.get("/api/products", { params });
        const { products, hasMore } = response.data;

        const result = {
          items: products || [],
          hasMore: hasMore ?? (products?.length === PRODUCTS_PER_PAGE),
        };

        // Cache the result
        cacheManager.set(cacheKey, result, PRODUCTS_CACHE_TTL);

        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [category, search, sort, filters, getCacheKey]
  );

  const { ref, items, isLoading, hasMore, error: scrollError } = useInfiniteScroll(
    fetchMore,
    { threshold: 200 }
  );

  useEffect(() => {
    setAllProducts([...initialProducts, ...items]);
  }, [items, initialProducts]);

  if (scrollError || error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold">Failed to load products</p>
        <p className="text-gray-600 text-sm mt-2">{scrollError || error}</p>
      </div>
    );
  }

  return (
    <div ref={ref}>
      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        {allProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index % PRODUCTS_PER_PAGE) * 0.05 }}
            viewport={{ once: true }}
          >
            <LazyProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      )}

      {/* End of list message */}
      {!hasMore && allProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-600 font-semibold">
            Showing {allProducts.length} products
          </p>
          <p className="text-gray-500 text-sm">No more products to load</p>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && allProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-600 font-semibold">No products found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
        </motion.div>
      )}
    </div>
  );
}

export default LazyProductGrid;
