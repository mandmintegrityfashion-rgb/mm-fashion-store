"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsVisible(true);
    const handleComplete = () => {
      setTimeout(() => setIsVisible(false), 300);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Animated Logo */}
            <motion.div
              animate={{
                rotateY: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ perspective: 1000 }}
              className="relative w-22 h-22 sm:w-30 sm:h-30"
            >
              <Image
                src="/images/Logo.png"
                alt="Loading"
                fill
                sizes="(max-width: 640px) 88px, 120px"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Loading Text */}
            <motion.div
              className="flex gap-2 items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white font-semibold text-lg">Loading</span>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white text-lg font-bold"
              >
                •
              </motion.span>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="text-white text-lg font-bold"
              >
                •
              </motion.span>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="text-white text-lg font-bold"
              >
                •
              </motion.span>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="w-40 h-1 bg-white/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#C9A96E] to-[#B89A5C] rounded-full"
                animate={{
                  width: ["10%", "60%", "90%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
