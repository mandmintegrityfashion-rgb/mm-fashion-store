// components/Footer/Pages/DeliveryInfo.js
"use client";

export default function DeliveryInfo() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 bg-gradient-to-br from-[#fffdf9] to-[#fdf6ef] rounded-2xl shadow-lg border border-[#e9e2d9]">
      <h2 className="text-3xl font-extrabold text-center text-[#546258] mb-8 tracking-wide">
        Delivery Information
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6 text-center italic">
        We pride ourselves on ensuring that your orders arrive promptly, safely,
        and beautifully packaged.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[#C6A15B] mb-2">
            🚚 Nationwide Delivery
          </h3>
          <p className="text-gray-700 leading-relaxed">
            We deliver to all major cities and towns across Nigeria. Whether you
            reside in Lagos, Abuja, Port Harcourt, or beyond, our logistics
            partners ensure your package reaches you in perfect condition.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#C6A15B] mb-2">
            ⏱ Delivery Timelines
          </h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Lagos: 1 – 2 working days</li>
            <li>Major Cities: 2 – 4 working days</li>
            <li>Other Locations: 3 – 7 working days</li>
          </ul>
          <p className="mt-2 text-sm text-gray-500 italic">
            Please note: Delivery timelines may be affected by public holidays
            or unforeseen delays.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#C6A15B] mb-2">
            🎁 Premium Packaging
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Every order is carefully packed in elegant wrapping, ensuring a
            luxurious unboxing experience. Our packaging is designed to both
            protect your purchase and give you a sense of delight.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#C6A15B] mb-2">
            💬 Customer Updates
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Once your order has been dispatched, you’ll receive an email or SMS
            with a tracking number so you can follow your order every step of
            the way.
          </p>
        </div>
      </div>
    </div>
  );
}
