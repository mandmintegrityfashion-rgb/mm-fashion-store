"use client";

import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import { motion } from "framer-motion";
import { FiCheck, FiAward, FiHeart, FiTrendingUp, FiShield, FiGift } from "react-icons/fi";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-playfair",
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1 },
  viewport: { once: true },
};

export default function LearnMore() {
  return (
    <>
      <Head>
        <title>Learn More | Chioma Hair - Hair Care Guide & Brand Story</title>
        <meta
          name="description"
          content="Discover the science behind beautiful hair. Learn about our premium collection, hair care tips, product benefits, and commitment to quality."
        />
        <meta name="keywords" content="hair care, wigs, extensions, hair care tips, luxury hair products" />
      </Head>

      <div className={`${playfair.className} bg-gradient-to-b from-white via-[#F8ECDC]/10 to-white min-h-screen`}>
        <Navbar />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 font-serif"
            style={{
              background: "linear-gradient(135deg, #1a1a1a, #546258)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Learn More About Premium Hair Care
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Explore our collection, understand quality, and discover the secrets to beautiful, healthy hair.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-1 w-100 bg-gradient-to-r from-transparent via-[#D9B48A] to-transparent mx-auto"
          ></motion.div>
        </section>

        {/* Our Collections */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: "#546258" }}>
              Our Collections
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each collection is carefully curated to meet diverse hair needs and preferences.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Wigs */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 shadow-lg border border-[#D9B48A]/20 hover:shadow-xl transition-shadow duration-300"
              style={{ isolation: "isolate" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #546258, #6b7a66)" }}
              >
                <FiAward className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-serif" style={{ color: "#546258" }}>
                Premium Wigs
              </h3>
              <p className="text-gray-600 mb-6">
                Handcrafted wigs made from 100% human hair. Perfect for transforming your look instantly with unmatched quality and comfort.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Full lace & frontal designs
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Breathable cap construction
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Heat resistant fibers
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  30+ day wear guarantee
                </li>
              </ul>
            </motion.div>

            {/* Hair Extensions */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 shadow-lg border border-[#D9B48A]/20 hover:shadow-xl transition-shadow duration-300"
              style={{ isolation: "isolate" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #D9B48A, #e8c89c)" }}
              >
                <FiTrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-serif" style={{ color: "#546258" }}>
                Hair Extensions
              </h3>
              <p className="text-gray-600 mb-6">
                Add volume and length to your natural hair. Our extensions blend seamlessly for a fuller, more luxurious appearance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Clip-in & tape-in options
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Multiple length & color choices
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Easy application & removal
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Long-lasting durability
                </li>
              </ul>
            </motion.div>

            {/* Hair Care */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 shadow-lg border border-[#D9B48A]/20 hover:shadow-xl transition-shadow duration-300"
              style={{ isolation: "isolate" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #2d5f4f, #3a7561)" }}
              >
                <FiHeart className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-serif" style={{ color: "#546258" }}>
                Hair Care Products
              </h3>
              <p className="text-gray-600 mb-6">
                Premium shampoos, conditioners, and treatments designed to maintain and enhance your hair's health and beauty.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  All-natural ingredients
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Sulfate & paraben-free
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Deep moisturizing formula
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <FiCheck className="text-[#D9B48A]" size={20} />
                  Cruelty-free & eco-friendly
                </li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div {...fadeInUp} className="mt-12 text-center">
            <Link
              href="/product"
              className="inline-block px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #546258, #6b7a66)",
                color: "white",
              }}
            >
              Explore All Products
            </Link>
          </motion.div>
        </section>

        {/* Hair Care Tips */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: "#546258" }}>
              Hair Care Tips & Guide
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Learn how to maintain your hair investment for long-lasting beauty and health.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Wig Care */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#F8ECDC]/50 to-white p-8 rounded-2xl border border-[#D9B48A]/30"
            >
              <h3 className="text-2xl font-bold mb-4 font-serif" style={{ color: "#546258" }}>
                Caring for Your Wigs
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">1.</span>
                  <span>
                    <strong>Wash Weekly:</strong> Use lukewarm water and specialized wig shampoo. Avoid hot water to preserve fiber quality.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">2.</span>
                  <span>
                    <strong>Condition Properly:</strong> Apply leave-in conditioner after washing to maintain softness and shine.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">3.</span>
                  <span>
                    <strong>Dry Correctly:</strong> Pat dry with a towel and let air dry on a wig stand. Avoid direct sunlight.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">4.</span>
                  <span>
                    <strong>Store Safely:</strong> Store on a wig head or in a protective bag to maintain shape and prevent tangling.
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Extension Care */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#F8ECDC]/50 to-white p-8 rounded-2xl border border-[#D9B48A]/30"
            >
              <h3 className="text-2xl font-bold mb-4 font-serif" style={{ color: "#546258" }}>
                Maintaining Hair Extensions
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">1.</span>
                  <span>
                    <strong>Gentle Washing:</strong> Wash downward in the direction of hair flow, avoiding root areas.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">2.</span>
                  <span>
                    <strong>Deep Condition:</strong> Use protein-rich treatments weekly to prevent drying and breakage.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">3.</span>
                  <span>
                    <strong>Minimize Heat:</strong> Use heat protectant spray before styling. Low heat settings extend lifespan.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">4.</span>
                  <span>
                    <strong>Reduce Tangling:</strong> Brush from ends upward gently. Invest in a quality paddle brush.
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Natural Hair Care */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#F8ECDC]/50 to-white p-8 rounded-2xl border border-[#D9B48A]/30"
            >
              <h3 className="text-2xl font-bold mb-4 font-serif" style={{ color: "#546258" }}>
                Natural Hair Care
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">1.</span>
                  <span>
                    <strong>Moisturize Daily:</strong> Use leave-in conditioner and natural oils (argan, coconut) for hydration.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">2.</span>
                  <span>
                    <strong>Deep Condition Weekly:</strong> Intensive treatments restore moisture and repair damage.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">3.</span>
                  <span>
                    <strong>Protective Styling:</strong> Braid and bun styles protect ends and reduce breakage.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">4.</span>
                  <span>
                    <strong>Trim Regularly:</strong> Every 8-12 weeks to maintain health and prevent split ends.
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Accessories Care */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#F8ECDC]/50 to-white p-8 rounded-2xl border border-[#D9B48A]/30"
            >
              <h3 className="text-2xl font-bold mb-4 font-serif" style={{ color: "#546258" }}>
                Hair Accessories Guide
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">1.</span>
                  <span>
                    <strong>Choose Quality Materials:</strong> Silk/satin reduces friction better than cotton.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">2.</span>
                  <span>
                    <strong>Use Proper Tools:</strong> Wide-tooth combs and paddle brushes minimize hair damage.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">3.</span>
                  <span>
                    <strong>Avoid Tight Styles:</strong> Excessive tension causes hair loss and thinning.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#546258] min-w-fit">4.</span>
                  <span>
                    <strong>Protect at Night:</strong> Sleep on silk pillowcases to prevent friction damage.
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-7xl mx-auto px-4 py-20 bg-gradient-to-r from-[#546258]/5 to-[#D9B48A]/5 rounded-3xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: "#546258" }}>
              Why Choose Chioma Hair
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Quality, authenticity, and customer satisfaction are at the heart of everything we do.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #546258, #6b7a66)" }}
              >
                <FiAward className="text-white" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#546258" }}>
                Premium Quality
              </h3>
              <p className="text-gray-600">
                100% authentic human hair sourced ethically and tested for durability.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #D9B48A, #e8c89c)" }}
              >
                <FiShield className="text-white" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#546258" }}>
                Guaranteed Service
              </h3>
              <p className="text-gray-600">
                30-day satisfaction guarantee with easy returns and exceptional customer support.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #2d5f4f, #3a7561)" }}
              >
                <FiGift className="text-white" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#546258" }}>
                Exclusive Benefits
              </h3>
              <p className="text-gray-600">
                Free styling consultations, loyalty rewards, and exclusive member-only deals.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Quality Standards */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: "#546258" }}>
              Our Quality Standards
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #546258, #6b7a66)" }}
                >
                  <FiCheck className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#546258" }}>
                  Ethical Sourcing
                </h3>
                <p className="text-gray-600">
                  All hair is responsibly sourced from certified suppliers with fair trade practices.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #D9B48A, #e8c89c)" }}
                >
                  <FiCheck className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#546258" }}>
                  Quality Testing
                </h3>
                <p className="text-gray-600">
                  Every product undergoes rigorous testing for durability, color consistency, and safety.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #2d5f4f, #3a7561)" }}
                >
                  <FiCheck className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#546258" }}>
                  Expert Curation
                </h3>
                <p className="text-gray-600">
                  Our team of hair experts personally select each product to ensure excellence.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #546258, #6b7a66)" }}
                >
                  <FiCheck className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#546258" }}>
                  Customer Feedback
                </h3>
                <p className="text-gray-600">
                  We continuously improve based on customer reviews and styling recommendations.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-bold mb-6 font-serif" style={{ color: "#546258" }}>
              Ready to Transform Your Hair?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our complete collection of premium wigs, extensions, and hair care products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/product"
                className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 "
                style={{
                  background: "linear-gradient(135deg, #6b7a66, #6b7a66)",
                  color: "#eaeceb"
                }}
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 border-2"
                style={{
                  borderColor: "#546258",
                  color: "#546258",
                }}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}
