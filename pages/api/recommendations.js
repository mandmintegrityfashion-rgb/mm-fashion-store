// /pages/api/recommendations.js
// Smart product recommendation engine

import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";

/**
 * Smart Recommendation API
 * 
 * Query Parameters:
 * - categoryId: Current product's category (for context-aware recommendations)
 * - productId: Current product ID (to exclude from results)
 * - limit: Number of products to return (default: 6)
 * - excludeOutOfStock: Exclude out-of-stock products (default: true)
 * 
 * Returns: Array of recommended products sorted by relevance score
 */

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    const {
      categoryId,
      productId,
      limit = 6,
      excludeOutOfStock = true
    } = req.query;

    // ============================================
    // STEP 1: Build MongoDB Filter
    // ============================================
    const filters = {};

    // Exclude current product
    if (productId) {
      filters._id = { $ne: productId };
    }

    // Only get in-stock products
    if (excludeOutOfStock === 'true' || excludeOutOfStock === true) {
      filters.stock = { $gt: 0 };
    }

    // ============================================
    // STEP 2: Fetch Products with Required Fields
    // ============================================
    let products = await Product.find(filters)
      .select(
        "name " +
        "price " +
        "promoPrice " +
        "images " +
        "isPromotion " +
        "promoType " +
        "promoEnd " +
        "promoStart " +
        "rating " +
        "reviews " +
        "stock " +
        "category " +
        "createdAt"
      )
      .lean();

    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    // ============================================
    // STEP 3: Score Each Product
    // ============================================
    const scoredProducts = products.map((product) => ({
      ...product,
      recommendationScore: calculateScore(product, categoryId)
    }));

    // ============================================
    // STEP 4: Sort by Score (Highest First)
    // ============================================
    const sortedByScore = scoredProducts.sort(
      (a, b) => b.recommendationScore - a.recommendationScore
    );

    // ============================================
    // STEP 5: Get Top Candidates and Randomize
    // ============================================
    // Get top 3x the limit for variety
    const topCandidates = sortedByScore.slice(0, parseInt(limit) * 3);

    // Shuffle within top candidates for variety
    const shuffled = shuffleArray(topCandidates);

    // Get final products
    const recommendedProducts = shuffled.slice(0, parseInt(limit));

    // ============================================
    // STEP 6: Remove Score Before Sending
    // ============================================
    const cleanedProducts = recommendedProducts.map(({ recommendationScore, ...product }) => product);

    // ============================================
    // Return Results
    // ============================================
    res.status(200).json(JSON.parse(JSON.stringify(cleanedProducts)));

  } catch (error) {
    console.error("Recommendation API Error:", error);
    res.status(500).json({
      error: "Failed to load recommendations",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Calculate relevance score for a product
 * Higher score = Higher priority for recommendation
 */
function calculateScore(product, userCategoryId) {
  let score = 0;

  // ─────────────────────────────────────────────
  // 1. CATEGORY MATCH (Highest Priority) - Up to 50 points
  // ─────────────────────────────────────────────
  if (product.category && userCategoryId) {
    if (product.category.toString() === userCategoryId.toString()) {
      score += 50; // Same category = highest priority
    } else {
      score += 10; // Different category gets minimal boost
    }
  } else if (product.category && !userCategoryId) {
    score += 15; // Category exists but no user category to match
  }

  // ─────────────────────────────────────────────
  // 2. QUALITY INDICATORS - Up to 25 points
  // ─────────────────────────────────────────────
  if (product.rating && product.rating > 0) {
    // Rating scale: 1-5 stars × 5 = up to 25 points
    score += Math.min(product.rating * 5, 25);
  }

  // ─────────────────────────────────────────────
  // 3. POPULARITY (Review Count) - Up to 15 points
  // ─────────────────────────────────────────────
  const reviewCount = product.reviews?.length || 0;
  if (reviewCount > 0) {
    // More reviews = more popular
    // 1-10 reviews = 1-7.5 points
    // 10+ reviews = 7.5-15 points
    score += Math.min((reviewCount / 10) * 15, 15);
  }

  // ─────────────────────────────────────────────
  // 4. ACTIVE PROMOTION - Up to 20 points
  // ─────────────────────────────────────────────
  if (product.isPromotion && product.promoEnd) {
    const now = new Date();
    const promoEnd = new Date(product.promoEnd);

    // Check if promotion is currently active
    if (promoEnd > now) {
      score += 20; // Active promo = strong boost
    } else {
      score += 0; // Expired promo = no boost
    }
  }

  // ─────────────────────────────────────────────
  // 5. PRODUCT RECENCY (New Products) - Up to 15 points
  // ─────────────────────────────────────────────
  if (product.createdAt) {
    const daysOld = (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24);

    if (daysOld < 7) {
      score += 15; // Brand new (< 1 week) = high boost
    } else if (daysOld < 30) {
      score += 10; // Recent (< 1 month) = medium boost
    } else if (daysOld < 90) {
      score += 5;  // Relatively new (< 3 months) = small boost
    }
    // Older products get no recency boost
  }

  // ─────────────────────────────────────────────
  // 6. STOCK AVAILABILITY - Up to 5 points
  // ─────────────────────────────────────────────
  if (product.stock) {
    if (product.stock > 20) {
      score += 5; // Good stock = boost
    } else if (product.stock > 10) {
      score += 3; // Medium stock = small boost
    } else if (product.stock > 0) {
      score += 1; // Low stock = minimal boost
    }
  }

  // ─────────────────────────────────────────────
  // TOTAL POSSIBLE SCORE: 140 points
  // ─────────────────────────────────────────────

  return score;
}

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 */
function shuffleArray(array) {
  const shuffled = [...array]; // Create copy to avoid mutating original

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
