import { useState } from "react";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Feedback submitted: ${feedback}`);
    setFeedback("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#546258]">We Value Your Feedback</h2>
      <p className="mb-4">
        Help us improve by sharing your thoughts and suggestions.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full border border-gray-300 rounded-lg p-3"
          rows="4"
          required
        />
        <button
          type="submit"
          className="bg-[#C6A15B] text-white px-4 py-2 rounded-lg hover:bg-[#b28c4d]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
