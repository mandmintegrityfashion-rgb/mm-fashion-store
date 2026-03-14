import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CategoryCard({ title, image, href }) {
  return (
    <Link href={href} passHref>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-500 hover:shadow-[0_10px_30px_rgba(255,215,0,0.4)]"
      >
        {/* Optimized Image */}
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="w-full h-64 md:h-72 lg:h-56 object-cover transform transition-transform duration-500 hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Title overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-xl px-6 md:text-2xl lg:text-3xl font-bold text-white tracking-wide drop-shadow-lg text-center">
            {title}
          </h3>
        </div>

        {/* Glow border on hover */}
        <div className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      </motion.div>
    </Link>
  );
}
