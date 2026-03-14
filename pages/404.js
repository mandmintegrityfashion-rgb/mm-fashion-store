import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import { motion } from "framer-motion";
import { FiArrowRight, FiHome } from "react-icons/fi";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | M&M Fashion</title>
        <meta name="description" content="Sorry, the page you're looking for doesn't exist." />
      </Head>

      <div className={`${playfair.className} bg-gradient-to-b from-white via-[#E8F0FE]/20 to-white min-h-screen flex flex-col`}>
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-9xl font-bold text-[#4C9EFF]/20 mb-4"
            >
              404
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#1F2D3D] mb-4">
              Page Not Found
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4C9EFF] text-white rounded-xl font-semibold hover:bg-[#1A5DAB] hover:shadow-lg transition-all"
              >
                <FiHome size={20} />
                Back to Home
              </Link>

              <Link
                href="/shop/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#4C9EFF] text-[#4C9EFF] rounded-xl font-semibold hover:bg-[#4C9EFF]/10 transition-all"
              >
                Continue Shopping
                <FiArrowRight size={20} />
              </Link>
            </motion.div>

            <p className="mt-12 text-sm text-gray-500">
              If you believe this is an error, please{" "}
              <Link href="/contact" className="text-[#4C9EFF] hover:underline font-semibold">
                contact us
              </Link>
            </p>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}
