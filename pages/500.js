import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiPhone } from "react-icons/fi";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server Error | M&M Fashion</title>
        <meta name="description" content="Sorry, something went wrong on our end." />
      </Head>

      <div className={`${playfair.className} bg-gradient-to-b from-white via-[#E8F0FE]/20 to-white min-h-screen flex flex-col items-center justify-center px-4`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-9xl font-bold text-red-400/20 mb-4"
          >
            500
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            We're experiencing some technical difficulties. Our team has been notified and is working to fix it.
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
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#4C9EFF] text-[#4C9EFF] rounded-xl font-semibold hover:bg-[#4C9EFF]/10 transition-all"
            >
              <FiPhone size={20} />
              Contact Support
            </Link>
          </motion.div>

          <p className="mt-12 text-sm text-gray-500">
            Error ID: {Math.random().toString(36).substring(2, 11).toUpperCase()}
          </p>
        </motion.div>
      </div>
    </>
  );
}
