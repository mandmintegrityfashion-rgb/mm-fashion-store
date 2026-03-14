"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AccountLayout from "@/components/account/AccountLayout";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

export default function WishlistPage() {
  const { customer: authCustomer, loading } = useAuth(); // only has id, name, email
  const [customerData, setCustomerData] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  useEffect(() => {
    if (!authCustomer?.id) return;

    async function fetchCustomer() {
      setLoadingAccount(true);
      try {
        const { data } = await axios.get(`/api/account/${authCustomer.id}`);
        setCustomerData(data);
      } catch (err) {
        console.error("Failed to fetch account data:", err);
        setCustomerData(null);
      } finally {
        setLoadingAccount(false);
      }
    }

    fetchCustomer();
  }, [authCustomer]);

  async function removeItem(productId) {
    try {
      await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      setCustomerData((prev) => ({
        ...prev,
        wishlist: prev.wishlist.filter((x) => x.product._id !== productId),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item.");
    }
  }

  const wishlist = customerData?.wishlist || [];

  return (
    <AccountLayout>
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>

        {loading || loadingAccount ? (
          <p className="p-8 text-center">Loading account…</p>
        ) : !customerData ? (
          <p className="p-8 text-center text-red-500">Account not found.</p>
        ) : wishlist.length === 0 ? (
          <p className="text-gray-500">No items in your wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist.map((i) => (
              <div key={i.product._id} className="relative group">
                <ProductCard product={i.product} />
                <button
                  onClick={() => removeItem(i.product._id)}
                  className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow-sm text-gray-600 hover:text-red-500 hover:border-red-400 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </AccountLayout>
  );
}
