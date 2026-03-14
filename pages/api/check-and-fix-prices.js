// pages/api/check-and-fix-prices.js
// Development utility to check and optionally fix missing product prices
// Usage: GET /api/check-and-fix-prices?fix=true

import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  // Security: Only allow in development
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "This endpoint is disabled in production" });
  }

  try {
    await mongooseConnect();

    const { fix } = req.query;
    const shouldFix = fix === "true";

    // Check products with missing prices
    const productsWithoutPrice = await Product.find({
      $or: [
        { price: null },
        { price: undefined },
        { price: { $exists: false } }
      ]
    }).lean();

    // Check all products count
    const totalProducts = await Product.countDocuments();
    const productsWithPrice = await Product.countDocuments({
      price: { $exists: true, $ne: null }
    });

    if (!shouldFix) {
      // Just return the analysis
      return res.json({
        status: "analysis",
        statistics: {
          totalProducts,
          productsWithPrice,
          productsWithoutPrice: productsWithoutPrice.length,
          percentageWithPrice: ((productsWithPrice / totalProducts) * 100).toFixed(2),
          needsFixing: productsWithoutPrice.length > 0,
        },
        sample: productsWithoutPrice.slice(0, 3).map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          promoPrice: p.promoPrice,
        })),
        message: productsWithoutPrice.length > 0 
          ? `Found ${productsWithoutPrice.length} products without prices. Call with ?fix=true to add prices.`
          : "All products have prices ✅"
      });
    }

    // If fix=true, add prices to missing products
    const results = await Promise.all(
      productsWithoutPrice.map(async (product) => {
        try {
          // Generate realistic price between ₦5,000 and ₦100,000
          const basePrice = Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000;
          
          // Round to nearest 500
          const price = Math.round(basePrice / 500) * 500;

          // 30% chance of having a promotion
          const hasPromo = Math.random() < 0.3;
          const promoPrice = hasPromo ? Math.floor(price * 0.7) : null;
          const promoType = hasPromo ? "Flash Sale" : null;
          const promoEnd = hasPromo ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null;

          await Product.findByIdAndUpdate(product._id, {
            price,
            promoPrice,
            promoType,
            promoEnd,
            isPromotion: !!hasPromo,
          });

          return {
            id: product._id,
            name: product.name,
            price,
            promoPrice,
            promoType,
            status: "fixed"
          };
        } catch (err) {
          return {
            id: product._id,
            name: product.name,
            status: "error",
            error: err.message
          };
        }
      })
    );

    const successful = results.filter(r => r.status === "fixed").length;
    const failed = results.filter(r => r.status === "error").length;

    res.json({
      status: "fixed",
      results: {
        totalProcessed: results.length,
        successful,
        failed,
      },
      details: results,
      message: `Fixed ${successful} products with prices. ${failed} failed.`
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      hint: "Make sure MongoDB is connected and the database is accessible"
    });
  }
}
