import { useState, useMemo } from "react";
import { createElement } from "react";
import useSWR from "swr";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryList from "@/components/CategoryList";
import Footer from "@/components/footer/Footer";
import * as FooterPages from "@/components/footer/pages";
import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import { Playfair_Display } from "next/font/google";
import Carousel from "@/components/Carousel";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-playfair",
});

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home({ products, categories }) {
  const { data: moreProducts } = useSWR("/api/more-products", fetcher, {
    revalidateOnFocus: false,
  });

  const [openPage, setOpenPage] = useState(null);
  const now = useMemo(() => new Date(), []);

  const scrollBy = (id, distance) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollBy({ left: distance, behavior: "smooth" });
  };

  // 🔥 Flash Sale
  const flashProducts = useMemo(
    () =>
      products?.filter((product) => {
        if (!product?.isPromotion) return false;
        const start = product?.promoStart ? new Date(product.promoStart) : null;
        const end = product?.promoEnd ? new Date(product.promoEnd) : null;
        if (start && end) return now >= start && now <= end;
        if (start && !end) return now >= start;
        if (!start && end) return now <= end;
        return true;
      }) || [],
    [products, now]
  );

  // Group products by category id
  const productsByCategory = useMemo(() => {
    const grouped = {};
    products?.forEach((p) => {
      if (!p?.category) return;
      const catId = p.category.toString();
      if (!grouped[catId]) grouped[catId] = [];
      grouped[catId].push(p);
    });
    return grouped;
  }, [products]);

  const handleOpenPage = (page) => setOpenPage(page);
  const handleClosePage = () => setOpenPage(null);

  return (
    <>
      <Head>
        <title>M&M Fashion Store</title>
        <meta name="description" content="Shop the best deals on OmaHub Store" />
      </Head>

      <div className={`${playfair.className} bg-gray-50 min-h-screen`}>
        <Navbar />
        <HeroSection />
        <CategoryList />

        {/* 🔥 Flash Sales Section */}
        {flashProducts?.length > 0 && (
          <Section
            title="🔥 Flash Sales"
            bg="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50"
          >
            <div className="relative">
              <div
                id="flash-scroll"
                className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory py-4"
              >
                {flashProducts.map((p) => (
                  <div
                    key={p._id}
                    className="
                      min-w-[80%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[28%]
                      snap-start transition-all duration-300 transform hover:scale-105
                    "
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Left/Right Arrows */}
              <button
                onClick={() => scrollBy("flash-scroll", -300)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-gray-100 transition-all z-10 hidden sm:flex"
              >
                <FiChevronLeft size={28} />
              </button>
              <button
                onClick={() => scrollBy("flash-scroll", 300)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-gray-100 transition-all z-10 hidden sm:flex"
              >
                <FiChevronRight size={28} />
              </button>
            </div>
          </Section>
        )}

        {/* Dynamic Category Sections */}
        {categories?.length > 0 ? (
          categories.map((cat) => (
            <Section key={cat._id} title={cat.name} bg="bg-gray-50">
              <div className="relative backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-md border border-yellow-300 hover:shadow-2xl transition duration-500">
                <div
                  id={`cat-scroll-${cat._id}`}
                  className="flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory"
                >
                  {productsByCategory[cat._id.toString()]?.map((p) => (
                    <div
                      key={p._id}
                      className="
                        min-w-[80%] sm:min-w-[45%] md:min-w-[32%] lg:min-w-[25%]
                        snap-start transition-all duration-300 transform hover:scale-105
                      "
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>

                {/* Left/Right Arrows */}
                <button
                  onClick={() => scrollBy(`cat-scroll-${cat._id}`, -300)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-gray-100 transition-all z-10 hidden sm:flex"
                >
                  <FiChevronLeft size={28} />
                </button>
                <button
                  onClick={() => scrollBy(`cat-scroll-${cat._id}`, 300)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-gray-100 transition-all z-10 hidden sm:flex"
                >
                  <FiChevronRight size={28} />
                </button>

                {/* See All link */}
                {productsByCategory[cat._id.toString()]?.length > 4 && (
                  <div className="text-center sm:text-right mt-3 sm:mt-4">
                    <Link
                      href={`/product?category=${cat.slug || cat._id}`}
                      className="text-yellow-600 font-semibold hover:text-yellow-500 transition-colors text-sm sm:text-base"
                    >
                      See All &rarr;
                    </Link>
                  </div>
                )}

                {/* Empty category */}
                {productsByCategory[cat._id.toString()]?.length === 0 && (
                  <p className="col-span-full text-center text-gray-500 mt-4 text-sm sm:text-base">
                    No products available.
                  </p>
                )}
              </div>
            </Section>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            No categories available.
          </p>
        )}

        {/* Products You May Like */}
        <Carousel
          products={
            moreProducts?.map((p) => ({ ...p, cardComponent: ProductCard })) || []
          }
          title="Products You May Like"
          color="text-[#546258]"
          bg="bg-[#E8F2E6]"
        />

        {/* Footer + Modal */}
        <Footer
          onOpenPage={handleOpenPage}
          socialLinks={{
            facebook: "https://web.facebook.com/people/Allure-Suite/61567780641202/",
            twitter: "#",
            instagram: "#",
            linkedin: "#",
            target: "_blank",
            rel: "noopener noreferrer",
          }}
        />

        {openPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative"
            >
              <button
                onClick={handleClosePage}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-lg"
              >
                ×
              </button>
              {createElement(FooterPages[openPage])}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

// ✅ Server-side fetching
export async function getServerSideProps() {
  await mongooseConnect();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const products = await Product.find().populate("category").lean();

  let categories = [];
  try {
    const categoriesRes = await fetch(`${baseUrl}/api/categories`);
    if (categoriesRes.ok) {
      categories = await categoriesRes.json();
        } else {
      console.error(" Failed to fetch categories:", categoriesRes.status);
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
  }

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories,
    },
  };
}
