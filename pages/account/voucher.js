// pages/account/voucher.js
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AccountLayout from "@/components/account/AccountLayout";

export default function VoucherPage() {
  const { customer, loading } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [code, setCode] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!customer) return;
    async function load() {
      try {
        const res = await fetch("/api/vouchers");
        const data = await res.json();
        setVouchers(data || []);
      } catch (err) {
        console.error(err);
        setVouchers([]);
      }
    }
    load();
  }, [customer]);

  async function redeem() {
    if (!code.trim()) return alert("Enter voucher code.");
    setProcessing(true);
    try {
      const res = await fetch("/api/vouchers/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await res.json();
      if (res.ok) {
        setVouchers((prev) => [result, ...prev]);
        setCode("");
        alert("Voucher redeemed!");
      } else {
        alert(result?.error || "Could not redeem voucher.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to redeem.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return <p className="p-8 text-center">Loading account...</p>;

  return (
    <>
      <AccountLayout>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Vouchers & Promo Codes</h1>

          <div className="bg-white p-4 rounded shadow mb-6">
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="Enter voucher code"
              />
              <button
                disabled={processing}
                onClick={redeem}
                className="px-4 py-2 bg-[#4C9EFF] text-white rounded-lg hover:bg-[#2E8EFF] transition"
              >
                {processing ? "Redeeming..." : "Redeem"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vouchers.length === 0 ? (
              <p className="text-gray-500">No vouchers available.</p>
            ) : (
              vouchers.map((v) => (
                <div
                  key={v.code}
                  className="bg-white p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{v.title || v.code}</div>
                    <div className="text-xs text-gray-500">
                      Expires:{" "}
                      {v.expires
                        ? new Date(v.expires).toLocaleDateString()
                        : "Never"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {v.type === "percent"
                        ? `${v.amount}% off`
                        : `₦${v.amount}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </AccountLayout>
    </>
  );
}
