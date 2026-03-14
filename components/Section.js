import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Section({ title, bg = "bg-white", children, className = "" }) {
  return (
    <section className={`${bg} py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-[#0F1923]`}>
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mt-3 rounded-full" />
        </motion.div>
        <div>{children}</div>
      </div>
    </section>
  );
}
