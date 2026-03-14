"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";

export default function AccountMainClient() {
  const { customer: authCustomer, loading } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [moreVisible, setMoreVisible] = useState(3);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressDraft, setAddressDraft] = useState("");

  const increment = 3;

  useEffect(() => {
    if (!authCustomer?.id) return;
    async function fetchCustomer() {
      setLoadingAccount(true);
      try {
        const { data } = await axios.get(`/api/account/${authCustomer.id}`);
        setCustomerData(data);
        setAddressDraft(data.address || "");
      } catch (error) {
        console.error("Failed to fetch account data:", error);
        setCustomerData(null);
      } finally {
        setLoadingAccount(false);
      }
    }
    fetchCustomer();
  }, [authCustomer]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get("/api/products?sort=desc&limit=6");
        setRecommendedProducts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, []);

  async function saveAddress() {
    try {
      const { data } = await axios.put(
        `/api/account/${authCustomer.id}/address`,
        { address: addressDraft }
      );
      setCustomerData((prev) => ({ ...prev, address: data.address }));
      setEditingAddress(false);
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address");
    }
  }

  if (loading || loadingAccount) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-gray-500 animate-pulse">Loading account...</p>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-red-500">No account data found.</p>
      </div>
    );
  }

  const { name, email, phone, wishlist = [], orders = [], address } = customerData;

  return (
    <main className="w-full lg:w-full flex flex-col gap-12 px-4 lg:px-0">
      {/* Account Overview */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Account Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Name</span>
            <span className="font-semibold">{name}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Email</span>
            <span className="font-semibold">{email}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Phone</span>
            <span className="font-semibold">{phone || "Not provided"}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#E6F0FA] p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Orders</p>
            <p className="text-xl font-bold text-[#1F2D3D]">{orders.length}</p>
          </div>
          <div className="bg-[#E6F0FA] p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Wishlist</p>
            <p className="text-xl font-bold text-[#1F2D3D]">{wishlist.length}</p>
          </div>
          <div className="bg-[#E6F0FA] p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Store Credit</p>
            <p className="text-xl font-bold">₦{(customerData.storeCredit || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <div className="bg-[#E6F0FA] rounded-lg p-4">
            {editingAddress ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={addressDraft}
                  onChange={(e) => setAddressDraft(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={saveAddress} className="px-4 py-2 bg-[#1A5DAB] text-white rounded-lg hover:bg-[#2B5EBF] transition">Save</button>
                  <button onClick={() => { setEditingAddress(false); setAddressDraft(address || ""); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-gray-700 text-sm">{address || "No address provided"}</p>
                <button onClick={() => setEditingAddress(true)} className="text-[#4C9EFF] text-sm hover:underline">Edit</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="bg-[#E6F0FA] py-12 rounded-lg">
        <div className="flex items-center justify-between mb-8 px-6">
          <h3 className="font-semibold text-gray-800 text-2xl">Recommended for you</h3>
          <button className="text-[#4C9EFF] hover:underline text-sm">See All →</button>
        </div>

        {(() => {
          const validProducts = Array.isArray(recommendedProducts)
            ? recommendedProducts.filter(product => product && typeof product === 'object' && !Array.isArray(product) && product._id)
            : [];
          if (validProducts.length === 0) return <p className="px-6 text-gray-500">No valid recommended products.</p>;
          return <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-6">
              {validProducts.slice(0, moreVisible).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {moreVisible < validProducts.length && (
              <div className="text-center mt-8">
                <button onClick={() => setMoreVisible((prev) => Math.min(prev + increment, validProducts.length))} className="px-6 py-2 rounded-lg bg-[#1A5DAB] text-white font-semibold hover:bg-[#2B5EBF] transition">View More</button>
              </div>
            )}
          </>;
        })()}
      </section>
    </main>
  );
}