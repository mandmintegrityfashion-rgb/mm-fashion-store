// pages/account/settings.js
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import AccountLayout from "@/components/account/AccountLayout";

export default function SettingsPage() {
  const { customer, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
      });
    }
  }, [customer]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("/api/account/profile", form);
      alert("Profile updated.");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8 text-center">Loading account...</p>;

  return (
    <>
      <AccountLayout>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Account Management</h1>
          <form
            onSubmit={handleSave}
            className="bg-white p-6 rounded shadow max-w-xl"
          >
            <label className="block mb-2">
              <div className="text-sm font-medium">Full name</div>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <div className="text-sm font-medium">Email</div>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="block mb-2">
              <div className="text-sm font-medium">Phone</div>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <div className="flex gap-2 mt-4">
              <button
                disabled={saving}
                className="px-4 py-2 bg-[#1A5DAB] text-white rounded-lg hover:bg-[#2B5EBF] transition"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </main>
      </AccountLayout>
    </>
  );
}
