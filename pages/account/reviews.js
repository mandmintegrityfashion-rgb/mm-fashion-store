// pages/account/reviews.js
"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import AccountLayout from "@/components/account/AccountLayout";

function Stars({ value = 0, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          type="button"
          className={`text-2xl ${
            n <= value ? "text-[#C9A96E]" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { customer, loading } = useAuth();
  const [pending, setPending] = useState([]);

  useEffect(() => {
    if (!customer) return;
    async function load() {
      try {
        const res = await fetch("/api/reviews/pending");
        const data = await res.json();
        setPending(data || []);
      } catch (err) {
        console.error(err);
        setPending([]);
      }
    }
    load();
  }, [customer]);

  async function submitReview(item, rating, text, setBusy) {
    setBusy(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.product._id, rating, text }),
      });
      setPending((prev) => prev.filter((p) => p._id !== item._id));
      alert("Thanks! Review submitted.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="p-8 text-center">Loading account...</p>;

  return (
    <>
      <AccountLayout>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Pending Reviews</h1>
          {pending.length === 0 ? (
            <p className="text-gray-500">No items awaiting review. Thanks!</p>
          ) : (
            <div className="space-y-4">
              {pending.map((item) => (
                <ReviewCard
                  key={item._id}
                  item={item}
                  onSubmit={submitReview}
                />
              ))}
            </div>
          )}
        </main>
      </AccountLayout>
    </>
  );
}

function ReviewCard({ item, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="bg-white p-4 rounded shadow flex gap-4">
      <img
        src={
          item.product?.image?.thumb ||
          item.product?.image?.full ||
          "/images/placeholder.jpg"
        }
        alt={item.product?.title}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <div className="font-semibold">{item.product?.title}</div>
        <div className="text-sm text-gray-500">{item.product?.description}</div>

        <div className="mt-3">
          <Stars value={rating} onChange={setRating} />
          <textarea
            className="w-full mt-2 border rounded p-2"
            rows={3}
            placeholder="Write your review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              disabled={busy}
              onClick={() => onSubmit(item, rating, text, setBusy)}
              className="px-4 py-2 bg-[#0F1923] text-white rounded-lg hover:bg-[#1A2332] transition"
            >
              {busy ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
