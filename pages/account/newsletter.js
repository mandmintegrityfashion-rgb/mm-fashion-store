// pages/account/newsletter.js
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AccountLayout from "@/components/account/AccountLayout";

export default function NewsletterPage() {
  const { customer, loading } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) setSubscribed(!!customer.newsletterSubscribed);
  }, [customer]);

  async function toggle() {
    setSaving(true);
    try {
      const res = await fetch("/api/account/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribed: !subscribed }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubscribed((prev) => !prev);
      alert("Preference updated.");
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8 text-center">Loading account...</p>;

  return (
    <>
      <AccountLayout>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Newsletter Preferences</h1>
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-4">
              Receive promotional emails and updates from us.
            </p>
            <div className="flex items-center gap-3">
              <label className="switch">
                <input type="checkbox" checked={subscribed} onChange={toggle} />
                <span className="slider"></span>
              </label>
              <div>
                <div className="font-semibold">
                  {subscribed ? "Subscribed" : "Not subscribed"}
                </div>
                <div className="text-sm text-gray-500">
                  You can change this anytime.
                </div>
              </div>
            </div>
          </div>
        </main>
      </AccountLayout>
    </>
  );
}
