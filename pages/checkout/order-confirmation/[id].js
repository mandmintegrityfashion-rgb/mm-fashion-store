"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useCart } from "@/context/CartContext";

export default function OrderConfirmation() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!router.isReady) return;

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        if (res?.data?.order) setOrder(res.data.order);
        else setError("Order not found.");
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [router.isReady, id]);

  const handleContinueShopping = () => {
    clearCart();
    router.push("/");
  };

  if (loading)
    return <div className="flex items-center justify-center h-screen">Loading order...</div>;

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Order Confirmation</h1>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
        <p><strong>Name:</strong> {order.shippingDetails?.name}</p>
        <p><strong>Email:</strong> {order.shippingDetails?.email}</p>
        <p><strong>Phone:</strong> {order.shippingDetails?.phone}</p>
        <p><strong>City:</strong> {order.shippingDetails?.city}</p>
        <p><strong>Address:</strong> {order.shippingDetails?.address}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Ordered Products</h2>
        <ul className="space-y-4">
          {order.cartProducts.map((item, index) => (
            <li key={index} className="flex items-center gap-4 border-b pb-4">
              <img
                src={item.productId?.images?.[0]?.thumb || "/images/placeholder.jpg"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm">Qty: {item.quantity}</p>
                <p className="text-sm font-bold">₦{item.price.toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <p><strong>Shipping:</strong> ₦{order.shippingCost.toLocaleString()}</p>
        <p><strong>Subtotal:</strong> ₦{order.subtotal.toLocaleString()}</p>
        <p className="text-xl font-bold">
          <strong>Total:</strong> ₦{order.total.toLocaleString()}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleContinueShopping}
          className="px-6 py-3 rounded-lg bg-[#1A5DAB] hover:bg-[#2B5EBF] text-white font-semibold cursor-pointer transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
