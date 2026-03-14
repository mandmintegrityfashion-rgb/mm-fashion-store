import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CategoryCard({ title, image, href }) {
  return (
    <Link href={href} passHref>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="group relative rounded-2xl overflow-hidden cursor-pointer"
        style={{ boxShadow: "0 4px 20px rgba(76,158,255,0.08)" }}
      >
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="w-full h-64 md:h-72 lg:h-56 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2D3D]/80 via-[#1F2D3D]/30 to-transparent" />

        {/* Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
          <h3 className="text-lg md:text-xl font-semibold text-white tracking-wide drop-shadow-lg text-center px-4">
            {title}
          </h3>
          <span className="text-[11px] uppercase tracking-widest text-[#4C9EFF] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore
          </span>
        </div>

        {/* Blue bottom border on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4C9EFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </motion.div>
    </Link>
  );
}
