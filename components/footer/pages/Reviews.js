import { Star } from "lucide-react";

export default function Reviews() {
  const reviews = [
    {
      name: "Faith",
      comment:
        "The wig I ordered was beyond gorgeous! The texture is so silky and natural. Packaging was classy, and delivery was super fast.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=47",
    },
    {
      name: "Ade",
      comment:
        "I bought a bundle set and it exceeded expectations. The hair is thick, doesn’t shed, and feels like premium quality. Worth every naira!",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Zainab",
      comment:
        "Ordered braiding extensions and they came exactly as described. Easy to work with, no tangling, and delivery was right on time.",
      rating: 4,
      avatar: "https://i.pravatar.cc/100?img=23",
    },
    {
      name: "Chika",
      comment:
        "The frontal lace wig blended so seamlessly with my hairline! Got so many compliments. Will definitely shop again.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=31",
    },
    {
      name: "Amara",
      comment:
        "I was nervous ordering online but the customer care reassured me. My human hair wig came exactly like the photos — soft, bouncy, and elegant.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=56",
    },
  ];

  return (
    <div className="px-2 sm:px-4">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-[#546258] tracking-wide">
        Customer Reviews
      </h2>
      <div className="space-y-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="flex gap-4 border border-gray-200 rounded-xl shadow-md bg-gradient-to-br from-[#F8ECDC] to-[#fffaf5] p-5"
          >
            {/* Avatar */}
            <img
              src={r.avatar}
              alt={r.name}
              className="w-14 h-14 rounded-full border-2 border-[#C6A15B] shadow-sm object-cover"
            />

            {/* Review Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-lg text-gray-800">{r.name}</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className={`${
                        index < r.rating
                          ? "fill-[#C6A15B] text-[#C6A15B]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                “{r.comment}”
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
