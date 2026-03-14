// pages/account/close.js
"use client";

import { useState } from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function ClosePage() {
  const { customer, loading, logout } = useAuth();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleClose() {
    if (confirmText !== "DELETE") {
      return alert('Type "DELETE" to confirm.');
    }
    if (!confirm("Closing your account is permanent. Continue?")) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/account/close", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      alert("Account closed. We're sad to see you go.");
      logout();
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to close account.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p className="p-8 text-center">Loading account...</p>;

  return (
    <>
      <AccountLayout>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Close Account</h1>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-600 mb-4">
              Closing your account will permanently delete your data and orders.
              This action cannot be undone.
            </p>
            <p className="text-gray-600 mb-4">"Type DELETE to confirm"</p>
            <input
              className="border px-3 py-2 rounded w-full mb-3"
              placeholder='Type "DELETE" to confirm'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                disabled={deleting}
                onClick={handleClose}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                {deleting ? "Closing..." : "Close account"}
              </button>
              <button
                className="px-4 py-2 border rounded"
                onClick={() => router.push("/account/settings")}
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </AccountLayout>
    </>
  );
}
