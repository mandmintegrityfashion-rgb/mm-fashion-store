// pages/account/addresses.js
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AccountLayout from "@/components/account/AccountLayout";


export default function AddressesPage() {
  const { customer, loading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!customer) return;
    setAddresses(customer.addresses || []);
  }, [customer]);

  async function saveAddress(addr) {
    setBusy(true);
    try {
      // post to backend...
      if (addr._id) {
        await fetch(`/api/addresses/${addr._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
        setAddresses((prev) => prev.map((a) => (a._id === addr._id ? addr : a)));
      } else {
        const res = await fetch(`/api/addresses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
        const newAddr = await res.json();
        setAddresses((prev) => [newAddr, ...prev]);
      }
      alert("Saved.");
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save address.");
    } finally {
      setBusy(false);
    }
  }

  async function removeAddress(id) {
    if (!confirm("Remove address?")) return;
    try {
      await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove.");
    }
  }

  if (loading) return <p className="p-8 text-center">Loading account...</p>;

  return (
    <>
<AccountLayout>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Address Book</h1>

          <div className="grid gap-4">
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setEditing({
                    recipientName: "",
                    phone: "",
                    street: "",
                    city: "",
                    state: "",
                    postalCode: "",
                  })
                }
                className="px-4 py-2 bg-[#0F1923] text-white rounded-lg hover:bg-[#1A2332] transition"
              >
                Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500">No saved addresses.</p>
            ) : (
              addresses.map((a) => (
                <div
                  key={a._id}
                  className="bg-white p-4 rounded shadow flex justify-between"
                >
                  <div>
                    <div className="font-semibold">{a.recipientName}</div>
                    <div className="text-sm text-gray-600">
                      {a.street}, {a.city} {a.state} {a.postalCode}
                    </div>
                    <div className="text-xs text-gray-500">{a.phone}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(a)}
                      className="px-3 py-1 border border-[#E8E0D4] rounded-lg hover:border-[#C9A96E] transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeAddress(a._id)}
                      className="px-3 py-1 border border-[#E8E0D4] rounded-lg text-[#B76E79] hover:border-[#B76E79] transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}

            {editing && (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">
                  {editing._id ? "Edit Address" : "Add Address"}
                </h3>
                <AddressForm
                  initial={editing}
                  onCancel={() => setEditing(null)}
                  onSave={saveAddress}
                  busy={busy}
                />
              </div>
            )}
          </div>
        </main>
      </AccountLayout>
    </>
  );
}

function AddressForm({ initial, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initial);

  useEffect(() => setForm(initial), [initial]);

  function change(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid gap-2"
    >
      <input
        placeholder="Recipient name"
        value={form.recipientName}
        onChange={(e) => change("recipientName", e.target.value)}
        className="border rounded px-2 py-2"
      />
      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => change("phone", e.target.value)}
        className="border rounded px-2 py-2"
      />
      <input
        placeholder="Street"
        value={form.street}
        onChange={(e) => change("street", e.target.value)}
        className="border rounded px-2 py-2"
      />
      <input
        placeholder="City"
        value={form.city}
        onChange={(e) => change("city", e.target.value)}
        className="border rounded px-2 py-2"
      />
      <input
        placeholder="State"
        value={form.state}
        onChange={(e) => change("state", e.target.value)}
        className="border rounded px-2 py-2"
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="px-3 py-2 bg-[#0F1923] text-white rounded-lg hover:bg-[#1A2332] transition"
        >
          {busy ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
