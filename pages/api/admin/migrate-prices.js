// pages/api/admin/migrate-prices.js
// Admin endpoint to add prices to products that don't have them
// Only works in development mode or with admin auth

import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  // Only allow in development or with a simple header check
  const adminKey = req.headers["x-admin-key"];
  if (process.env.NODE_ENV === "production" && adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    // Get all products without prices
    const productsWithoutPrice = await Product.find({
      $or: [
        { price: null },
        { price: undefined },
        { price: { $exists: false } }
      ]
    });

    if (productsWithoutPrice.length === 0) {
      return res.json({ message: "All products already have prices", updated: 0 });
    }

    // Add random prices between ₦5,000 and ₦50,000 for demo
    const updated = await Promise.all(
      productsWithoutPrice.map(async (product) => {
        const randomPrice = Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000;
        product.price = randomPrice;
        // Optionally add promo prices (30% discount)
        if (Math.random() > 0.7) {
          product.promoPrice = Math.floor(randomPrice * 0.7);
          product.promoType = "Flash Sale";
          product.promoEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }
        return product.save();
      })
    );

    res.json({
      message: "Prices migrated successfully",
      updated: updated.length,
      products: updated.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        promoPrice: p.promoPrice,
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
