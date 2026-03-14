// pages/api/debug-prices.js
// TEMPORARY DEBUG ENDPOINT - Remove in production

import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  // Allow in development only
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Debug endpoint disabled in production" });
  }

  await mongooseConnect();

  try {
    // Get first 5 products
    const products = await Product.find().limit(5).lean();

    // Check their prices
    const analysis = products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      promoPrice: p.promoPrice,
      promoType: p.promoType,
      hasPrice: !!p.price,
      hasPromoPrice: !!p.promoPrice,
    }));

    // Count products with missing prices
    const totalProducts = await Product.countDocuments();
    const productsWithPrice = await Product.countDocuments({ price: { $exists: true, $ne: null } });
    const productsWithoutPrice = totalProducts - productsWithPrice;

    res.json({
      sampleProducts: analysis,
      statistics: {
        totalProducts,
        productsWithPrice,
        productsWithoutPrice,
        percentageWithPrice: ((productsWithPrice / totalProducts) * 100).toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
