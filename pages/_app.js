import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { Overpass } from "next/font/google";
import "@/styles/globals.css";

const overpass = Overpass({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-overpass",
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <div className={`${overpass.variable} font-sans`} style={{ fontFamily: "var(--font-overpass), sans-serif" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={router.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Component {...pageProps} />
                </motion.div>
              </AnimatePresence>
            </div>
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
