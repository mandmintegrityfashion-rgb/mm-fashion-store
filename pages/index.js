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
        <meta name="description" content="Shop the best deals on M&M Fashion Store" />
      </Head>

      <div className={`${playfair.className} bg-[#FDFBF7] min-h-screen`}>
        <Navbar />
        <HeroSection />
        <CategoryList />

        {/* Flash Sales */}
        {flashProducts?.length > 0 && (
          <Section title="Flash Sales" bg="bg-gradient-to-r from-[#FEF7EC] via-[#FDFBF7] to-[#FEF7EC]">
            <div className="relative">
              <div
                id="flash-scroll"
                className="flex gap-5 overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory py-2"
              >
                {flashProducts.map((p, i) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="min-w-[75%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[24%] snap-start"
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => scrollBy("flash-scroll", -300)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white border border-[#E8E0D4] text-[#0F1923] rounded-full flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all z-10 shadow-sm hidden sm:flex"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollBy("flash-scroll", 300)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white border border-[#E8E0D4] text-[#0F1923] rounded-full flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all z-10 shadow-sm hidden sm:flex"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </Section>
        )}

        {/* Category Sections */}
        {categories?.length > 0 ? (
          categories.map((cat) => (
            <Section key={cat._id} title={cat.name} bg="bg-[#FDFBF7]">
              <div className="relative bg-white rounded-2xl p-4 sm:p-6 border border-[#F0EBE3]" style={{ boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
                <div
                  id={`cat-scroll-${cat._id}`}
                  className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory"
                >
                  {productsByCategory[cat._id.toString()]?.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.35 }}
                      className="min-w-[75%] sm:min-w-[45%] md:min-w-[32%] lg:min-w-[24%] snap-start"
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => scrollBy(`cat-scroll-${cat._id}`, -300)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-[#E8E0D4] text-[#0F1923] rounded-full flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all z-10 shadow-sm hidden sm:flex"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollBy(`cat-scroll-${cat._id}`, 300)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-[#E8E0D4] text-[#0F1923] rounded-full flex items-center justify-center hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all z-10 shadow-sm hidden sm:flex"
                >
                  <FiChevronRight size={16} />
                </button>

                {productsByCategory[cat._id.toString()]?.length > 4 && (
                  <div className="text-center sm:text-right mt-4">
                    <Link
                      href={`/product?category=${cat.slug || cat._id}`}
                      className="text-[#A88B4A] font-semibold hover:text-[#C9A96E] transition-colors text-sm inline-flex items-center gap-1"
                    >
                      See All <FiChevronRight size={14} />
                    </Link>
                  </div>
                )}

                {productsByCategory[cat._id.toString()]?.length === 0 && (
                  <p className="col-span-full text-center text-[#8E95A2] mt-4 text-sm">
                    No products available.
                  </p>
                )}
              </div>
            </Section>
          ))
        ) : (
          <p className="text-center text-[#8E95A2] text-sm py-12">
            No categories available.
          </p>
        )}

        {/* Products You May Like */}
        <Carousel
          products={
            moreProducts?.map((p) => ({ ...p, cardComponent: ProductCard })) || []
          }
          title="Products You May Like"
          color="text-[#0F1923]"
          bg="bg-[#F5F0E8]"
        />

        {/* Footer */}
        <Footer onOpenPage={handleOpenPage} />

        {openPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative border border-[#F0EBE3]"
              style={{ boxShadow: "0 16px 48px rgba(15,25,35,0.12)" }}
            >
              <button
                onClick={handleClosePage}
                className="absolute top-4 right-4 text-[#8E95A2] hover:text-[#0F1923] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F0E8]"
              >
                <span className="text-lg font-bold">&times;</span>
              </button>
              {createElement(FooterPages[openPage])}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const products = await Product.find().populate("category").lean();

  let categories = [];
  try {
    const categoriesRes = await fetch(`${baseUrl}/api/categories`);
    if (categoriesRes.ok) {
      categories = await categoriesRes.json();
    } else {
      console.error("Failed to fetch categories:", categoriesRes.status);
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
