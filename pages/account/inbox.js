// pages/account/inbox.js
"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import AccountLayout from "@/components/account/AccountLayout";

export default function InboxPage() {
  const { customer, loading } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!customer) return;
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages"); // backend
        const data = await res.json();
        setThreads(data || []);
      } catch (err) {
        console.error(err);
        setThreads([]);
      }
    }
    fetchMessages();
  }, [customer]);

  async function handleSendReply() {
    if (!reply.trim()) return alert("Please write a message.");
    setSending(true);
    try {
      await fetch(`/api/messages/${selected._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });
      // optimistic append
      setSelected((prev) => ({
        ...prev,
        messages: [
          ...(prev.messages || []),
          {
            fromCustomer: true,
            text: reply,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      setReply("");
      alert("Reply sent.");
    } catch (err) {
      console.error(err);
      alert("Failed to send reply.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p className="p-8 text-center">Loading account...</p>;

  return (
    <>
      <AccountLayout>
        <main className="flex-1 bg-white rounded-xl p-6 shadow">
          <h1 className="text-2xl font-bold mb-4">Inbox</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 border-r pr-4">
              {threads.length === 0 ? (
                <p className="text-gray-500">No conversations.</p>
              ) : (
                threads.map((t) => (
                  <div
                    key={t._id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selected?._id === t._id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setSelected(t)}
                  >
                    <div className="font-semibold">
                      {t.subject || "Conversation"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.messages?.slice(-1)[0]?.text?.slice(0, 60)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="col-span-2">
              {selected ? (
                <>
                  <h3 className="font-semibold mb-2">{selected.subject}</h3>
                  <div className="max-h-[50vh] overflow-y-auto space-y-3 p-2 border rounded">
                    {(selected.messages || []).map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded ${
                          m.fromCustomer
                            ? "bg-[#E6F0FA] self-end"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="text-sm">{m.text}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <textarea
                      className="w-full border rounded p-2"
                      rows={3}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write your reply..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        disabled={sending}
                        onClick={handleSendReply}
                        className="px-4 py-2 bg-[#1A5DAB] text-white rounded-lg hover:bg-[#2B5EBF] transition"
                      >
                        {sending ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  Select a conversation to view messages.
                </p>
              )}
            </div>
          </div>
        </main>
      </AccountLayout>
    </>
  );
}
