export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 bg-gradient-to-br from-[#fffdf9] to-[#fdf6ef] rounded-2xl shadow-lg border border-[#e9e2d9]">
      {/* Title */}
      <h2 className="text-3xl font-extrabold mb-6 text-center text-[#546258] tracking-wide">
        Terms & Conditions
      </h2>

      {/* Intro */}
      <p className="text-gray-700 mb-6 text-lg leading-relaxed text-center">
        Welcome to our store. By engaging with our website, purchasing our
        products, or using our services, you agree to the terms outlined
        below. Please read them carefully to ensure a seamless and
        transparent shopping experience.
      </p>

      {/* Section 1 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#C6A15B] mb-2">
          1. Product Availability
        </h3>
        <p className="text-gray-700 leading-relaxed">
          All items are offered subject to stock availability. While we strive
          to keep our inventory updated in real-time, occasional discrepancies
          may occur. In such cases, we will notify you promptly and suggest
          alternatives or issue a full refund.
        </p>
      </div>

      {/* Section 2 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#C6A15B] mb-2">
          2. Pricing & Payments
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Prices are displayed in local currency and may be updated without
          prior notice to reflect market changes. Payments must be completed
          in full at checkout through our secure and encrypted payment
          gateways. We do not store sensitive payment details on our servers.
        </p>
      </div>

      {/* Section 3 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#C6A15B] mb-2">
          3. Order Fulfillment & Delivery
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Orders are processed within 24–48 hours on business days. Delivery
          times vary depending on your location. Luxury packaging is included
          with every order to ensure your products arrive in pristine
          condition. Any delays will be communicated directly.
        </p>
      </div>

      {/* Section 4 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#C6A15B] mb-2">
          4. Use of Our Website
        </h3>
        <p className="text-gray-700 leading-relaxed">
          You agree to use this website only for lawful purposes. Any misuse,
          fraudulent activity, or unauthorized distribution of our content
          will result in immediate termination of access and may lead to legal
          action.
        </p>
      </div>

      {/* Section 5 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#C6A15B] mb-2">
          5. Limitation of Liability
        </h3>
        <p className="text-gray-700 leading-relaxed">
          While we strive to deliver exceptional quality and service, our
          liability for any issues arising from your use of our products or
          website shall not exceed the value of the purchased items.
        </p>
      </div>

      {/* Closing */}
      <p className="text-gray-700 mt-8 italic text-center">
        By continuing to browse and shop with us, you confirm that you have
        read, understood, and agreed to these terms.  
        <br /> We remain committed to offering you an elegant, seamless, and
        trusted shopping experience.
      </p>
    </div>
  );
}
