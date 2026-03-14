// components/Footer/Pages/Faq.js
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our carefully curated collection, select your desired items, and add them to your cart. Once ready, proceed to checkout where you can complete your order securely using our trusted payment gateways.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer:
        "Yes, orders may be canceled or modified within 2 hours of purchase by reaching out to our customer care team. Once an order has been processed and prepared for shipping, modifications may no longer be possible.",
    },
    {
      question: "Do you offer nationwide delivery?",
      answer:
        "Absolutely. We provide swift and reliable delivery across Nigeria, ensuring your items arrive in pristine condition. All deliveries are packaged luxuriously to protect your products during transit.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order has been shipped, you’ll receive an email with a tracking link. You can follow your parcel in real-time until it reaches your doorstep.",
    },
    {
      question: "What if I receive a damaged product?",
      answer:
        "Every product undergoes strict quality checks before dispatch. However, in the rare case of a damaged delivery, please contact us immediately with photo evidence, and we will arrange a replacement or refund promptly.",
    },
    {
      question: "Do you accept returns or exchanges?",
      answer:
        "Yes, returns and exchanges are available within 7 days of delivery provided the product is unused, in its original condition, and accompanied by proof of purchase.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 bg-gradient-to-br from-[#fffdf9] to-[#fdf6ef] rounded-2xl shadow-lg border border-[#e9e2d9]">
      <h2 className="text-3xl font-extrabold text-center text-[#546258] mb-8 tracking-wide">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-[#e9e2d9] rounded-xl bg-white/70 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center px-5 py-4 text-left text-gray-800 font-semibold hover:text-[#546258] transition-colors"
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUp className="text-[#C6A15B]" />
              ) : (
                <ChevronDown className="text-[#546258]" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-5 pb-5 text-gray-700 leading-relaxed border-t border-[#e9e2d9] bg-gradient-to-br from-[#fffdf9] to-[#fcf7f2]">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
