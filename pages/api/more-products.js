// pages/api/more-products.js
import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    const moreProducts = await Product.find().skip(6).limit(6).lean();
    res.status(200).json(moreProducts);
  } catch (error) {
    console.error("Failed to fetch more products:", error);
    res.status(500).json({ error: "Failed to load more products" });
  }
}
