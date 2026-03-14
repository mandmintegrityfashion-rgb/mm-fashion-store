export default function Privacy() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-[#1F2D3D] tracking-wide">
        Privacy Policy
      </h2>

      <p className="text-gray-700 leading-relaxed mb-4 text-lg">
        At <span className="font-semibold text-[#C6A15B]">Oma Hub</span>, your
        privacy is our priority. We are committed to safeguarding your personal
        information with the highest level of security while ensuring a seamless
        shopping experience for all our valued customers.
      </p>

      <div className="bg-gradient-to-br from-[#E8F0FE] to-[#F7FAFC] p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-bold mb-3 text-[#1F2D3D]">
          Information We Collect
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Personal details such as your name, email address, and delivery
            address provided during checkout.
          </li>
          <li>
            Payment details for secure transaction processing (handled only
            through trusted, encrypted gateways like Paystack).
          </li>
          <li>
            Browsing data (cookies, device type, location) to improve our
            services and provide a personalized experience.
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F0FE] p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-bold mb-3 text-[#1F2D3D]">
          How We Use Your Information
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>To process and deliver your orders quickly and efficiently.</li>
          <li>
            To keep you informed with order updates, promotions, and exclusive
            offers (only if you opt-in).
          </li>
          <li>
            To enhance your shopping experience by recommending products based
            on your preferences.
          </li>
          <li>
            To ensure compliance with financial and legal requirements while
            protecting against fraudulent activities.
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-br from-[#E8F0FE] to-[#F7FAFC] p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-bold mb-3 text-[#1F2D3D]">
          Data Protection & Security
        </h3>
        <p className="text-gray-700 leading-relaxed">
          All transactions on our platform are secured using{" "}
          <span className="font-semibold text-[#C6A15B]">
            SSL encryption technology
          </span>
          . We never store your sensitive payment details, and your personal
          information is kept confidential and protected against unauthorized
          access.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F0FE] p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-3 text-[#1F2D3D]">Your Rights</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            You may request access to the personal information we hold about
            you.
          </li>
          <li>
            You may request corrections or updates to ensure your data remains
            accurate.
          </li>
          <li>
            You may opt-out of marketing communications at any time by clicking
            the “unsubscribe” link in our emails.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-gray-700 text-lg text-center">
        For any privacy-related inquiries, contact us at{" "}
        <a
          href="mailto:OmaHub@gmail.com"
          className="text-[#C6A15B] font-semibold underline hover:text-[#a6854f]"
        >
          OmaHub@gmail.com
        </a>
        . We are always available to ensure your trust and confidence in{" "}
        <span className="font-semibold">Oma Hub</span>.
      </p>
    </div>
  );
}
