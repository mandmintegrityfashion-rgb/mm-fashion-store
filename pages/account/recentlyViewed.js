// pages/account/recently-viewed.js
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import AccountLayout from "@/components/account/AccountLayout";

export default function RecentlyViewedPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/recently-viewed");
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    }
    load();
  }, []);

  return (
    <>
      <AccountLayout>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Recently Viewed</h1>
          {products.length === 0 ? (
            <p className="text-gray-500">No recently viewed items.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="bg-white p-3 rounded shadow">
                  <ProductCard product={p} />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </AccountLayout>
    </>
  );
}
