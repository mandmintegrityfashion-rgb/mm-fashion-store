import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Component {...pageProps} />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
