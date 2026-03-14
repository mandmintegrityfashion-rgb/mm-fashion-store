// components/Footer/Pages/PayOnDelivery.js
"use client";

export default function PayOnDelivery() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 bg-gradient-to-br from-[#fffdf9] to-[#fdf6ef] rounded-2xl shadow-lg border border-[#e9e2d9]">
      <h2 className="text-3xl font-extrabold text-center text-[#1F2D3D] mb-8 tracking-wide">
        Pay on Delivery Notice
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6 text-center italic">
        We understand trust is earned, which is why we offer a convenient{" "}
        <span className="font-semibold text-[#C6A15B]">Pay on Delivery</span>{" "}
        option for our valued customers.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[#C6A15B] mb-2">
            ✅ How it Works
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Select <strong>Pay on Delivery</strong> at checkout, and once your
            order is delivered to your doorstep, you can make payment
            via transfer to our delivery partner.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#C6A15B] mb-2">
            📍 Areas Covered
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Pay on Delivery is currently available in Lagos and select major
            cities. For other regions, prepayment may be required due to
            logistics constraints.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#C6A15B] mb-2">
            ⚠️ Important Notes
          </h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Please ensure someone is available to receive and pay for the order upon delivery.</li>
            <li>Failure to accept a Pay on Delivery order may affect eligibility for future COD purchases.</li>
            <li>Large or customized orders may require part or full prepayment.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#C6A15B] mb-2">
            💎 Why Choose COD?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Pay on Delivery allows you to shop confidently, knowing you only pay
            once you see and receive your premium products in person.
          </p>
        </div>
      </div>
    </div>
  );
}
