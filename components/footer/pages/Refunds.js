export default function Refunds() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#546258]">Refund Policy</h2>
      <p className="mb-2">
        We want you to love your purchase. If you’re not satisfied, you can
        request a refund or exchange within <strong>14 days</strong> of
        receiving your order.
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Items must be unused and in their original packaging.</li>
        <li>Shipping costs are non-refundable.</li>
        <li>Custom or personalized orders cannot be refunded.</li>
      </ul>
      <p className="mt-4">
        To start a return, please contact our support team at{" "}
        <a href="mailto:support@example.com" className="text-blue-600 underline">
           <br/> OmaHub@gmail.com
        </a>.
      </p>
    </div>
  );
}
