import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import ProductClient from "@/components/ProductClient";

export default function ProductPage({ product }) {
  // server component wrapping a client component
  return <ProductClient product={product} />;
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id).lean();

  if (!product) return { notFound: true };

  return { props: { product: JSON.parse(JSON.stringify(product)) } };
}
