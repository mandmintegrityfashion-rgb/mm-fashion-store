// /pages/api/featured-products.js
// Featured products for homepage carousel

import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

/**
 * Featured Products API for Homepage
 * 
 * Strategy:
 * 1. Priority: Active promotional products (best conversion)
 * 2. Fill remaining with top-rated products (proven quality)
 * 3. If needed: Recently added products (freshness)
 * 4. Randomize for variety on each page load
 * 
 * Query Parameters:
 * - limit: Number of products to return (default: 6)
 * 
 * Returns: Array of featured products
 */

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    const { limit = 6 } = req.query;
    const limitNum = parseInt(limit);
    const now = new Date();

    // ============================================
    // STEP 1: Get Active Promotional Products
    // ============================================
    // These convert best, so prioritize them
    const promoProducts = await Product.find({
      isPromotion: true,
      promoEnd: { $gt: now },
      stock: { $gt: 0 }
    })
      .select(
        "name " +
        "price " +
        "promoPrice " +
        "images " +
        "isPromotion " +
        "promoType " +
        "promoEnd " +
        "rating " +
        "reviews"
      )
      .sort({ promoEnd: 1 }) // Show expiring soon first (urgency)
      .limit(Math.ceil(limitNum * 0.4)) // Up to 40% of recommendations
      .lean();

    // ============================================
    // STEP 2: Get Top-Rated Products
    // ============================================
    // Fill remaining slots with proven quality
    const topRatedLimit = limitNum - promoProducts.length;

    const topRatedProducts = await Product.find({
      _id: { $nin: promoProducts.map(p => p._id) },
      stock: { $gt: 0 },
      rating: { $exists: true, $gt: 0 }
    })
      .select(
        "name " +
        "price " +
        "promoPrice " +
        "images " +
        "rating " +
        "reviews"
      )
      .sort({
        rating: -1,           // Higher rating first
        "reviews.length": -1  // Then by number of reviews
      })
      .limit(topRatedLimit)
      .lean();

    // ============================================
    // STEP 3: If Still Need Products, Add Recent Ones
    // ============================================
    let finalProducts = [...promoProducts, ...topRatedProducts];

    if (finalProducts.length < limitNum) {
      const stillNeed = limitNum - finalProducts.length;

      const recentProducts = await Product.find({
        _id: { $nin: finalProducts.map(p => p._id) },
        stock: { $gt: 0 }
      })
        .select(
          "name " +
          "price " +
          "promoPrice " +
          "images " +
          "createdAt"
        )
        .sort({ createdAt: -1 }) // Newest first
        .limit(stillNeed)
        .lean();

      finalProducts = [...finalProducts, ...recentProducts];
    }

    // ============================================
    // STEP 4: Shuffle Results for Variety
    // ============================================
    // Shuffle so carousel shows different products each time
    // But keep at least the promos at start for visibility
    const shuffledResults = shuffleArray(finalProducts);

    // ============================================
    // STEP 5: Limit to Requested Amount
    // ============================================
    const resultProducts = shuffledResults.slice(0, limitNum);

    // ============================================
    // Return Results
    // ============================================
    res.status(200).json(JSON.parse(JSON.stringify(resultProducts)));

  } catch (error) {
    console.error("Featured Products API Error:", error);
    res.status(500).json({
      error: "Failed to load featured products",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Fisher-Yates shuffle algorithm
 * Randomizes array in-place for variety
 */
function shuffleArray(array) {
  const shuffled = [...array]; // Create copy

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
