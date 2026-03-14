import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <Component {...pageProps} />
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
