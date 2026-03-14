import AccountLayout from "@/components/account/AccountLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function OrdersPage() {
  const { customer, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!customer) return;
    async function fetchOrders() {
      setLoadingOrders(true);
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();

        // handle if API returns { orders: [...] } or just [...]
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, [customer]);

  if (loading) return <p className="p-8 text-center">Loading account...</p>;

  return (
    <AccountLayout>
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {loadingOrders ? (
        <p>Loading orders…</p>
      ) : Array.isArray(orders) && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <div className="text-sm text-gray-500">Order</div>
                <div className="font-medium">
                  {`Oma-${o._id.slice(-6).toUpperCase()}`}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    o.status === "paid"
                      ? "bg-[#C9A96E]/10 text-[#C9A96E]"
                      : "bg-[#F5F0E8] text-[#5A6171]"
                  }`}
                >
                  {o.status}
                </div>
                <div className="mt-2 font-semibold">
                  ₦{o.total?.toLocaleString()}
                </div>
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="mt-2 px-3 py-1 bg-[#0F1923] text-white rounded-lg hover:bg-[#1A2332] transition text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">You have no orders yet.</p>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>

            <div className="mt-4">
              <p>
                <strong>Order</strong>: Oma-
                {selectedOrder._id.slice(-6).toUpperCase()}
              </p>
              <p>
                <strong>Status</strong>: {selectedOrder.status}
              </p>
              <p className="mt-2">
                <strong>Items</strong>
              </p>
              <ul className="mt-2 space-y-2">
                {(selectedOrder.cartProducts || []).map((it) => (
                  <li key={it._id} className="flex justify-between">
                    <div>
                      <div className="font-medium">
                        {it.product?.name || it.name || "Product"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {it.quantity} × ₦{it.price?.toLocaleString()}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ₦{(it.price * it.quantity)?.toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <div className="text-sm text-gray-500">
                  Shipping: ₦{selectedOrder.shippingCost ?? 0}
                </div>
                <div className="text-xl font-bold">
                  Total: ₦{selectedOrder.total?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}
