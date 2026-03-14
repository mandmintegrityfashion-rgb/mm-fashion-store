import Product from "@/models/Product";
import mongooseConnect from "@/lib/mongodb";

/**
 * GET /api/recommendations/personalized
 * Smart recommendations based on:
 * 1. User's viewing history (from context)
 * 2. Products in same category as viewed items
 * 3. Highest quality products (rating, reviews)
 *
 * Query params:
 * - viewedProductIds: comma-separated product IDs user has viewed
 * - viewedCategories: comma-separated category IDs user has viewed
 * - limit: number of products to return (default: 8)
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    const {
      viewedProductIds = "",
      viewedCategories = "",
      limit = "8",
      excludeOutOfStock = "true",
    } = req.query;

    const limitNum = Math.min(parseInt(limit) || 8, 50);
    const viewedIds = viewedProductIds
      .split(",")
      .filter((id) => id.trim() && id !== "undefined");
    const viewedCats = viewedCategories
      .split(",")
      .filter((cat) => cat.trim() && cat !== "undefined");

    // If no viewing history, return empty
    if (viewedIds.length === 0 && viewedCats.length === 0) {
      return res.status(200).json([]);
    }

    let query = {};

    // Exclude products the user has already viewed
    if (viewedIds.length > 0) {
      query._id = { $nin: viewedIds };
    }

    // Exclude out of stock if requested
    if (excludeOutOfStock === "true") {
      query.stock = { $gt: 0 };
    }

    // Build filters for categories
    const categoryFilters = [];
    if (viewedCats.length > 0) {
      categoryFilters.push({ category: { $in: viewedCats } });
    }

    // Get all potential recommendations
    const allProducts = await Product.find(query)
      .lean()
      .select("_id name price promoPrice category rating reviews stock images createdAt")
      .exec();

    if (!allProducts || allProducts.length === 0) {
      return res.status(200).json([]);
    }

    // Score and sort products
    const scored = allProducts.map((product) => {
      let score = 0;

      // Factor 1: Category match (higher priority for viewed categories)
      if (viewedCats.includes(String(product.category))) {
        score += 50; // Same category user browsed
      } else {
        score += 10; // Different category (still relevant)
      }

      // Factor 2: Quality/Rating (0-25 points)
      if (product.rating && product.rating > 0) {
        score += (product.rating / 5) * 25;
      }

      // Factor 3: Review count/Popularity (0-20 points)
      const reviewCount = product.reviews?.length || 0;
      score += Math.min((reviewCount / 50) * 20, 20);

      // Factor 4: Stock availability (0-10 points)
      if (product.stock) {
        if (product.stock > 20) score += 10;
        else if (product.stock > 10) score += 7;
        else if (product.stock > 0) score += 3;
      }

      // Factor 5: Recency boost (0-15 points) - newer products
      const daysOld = Math.floor(
        (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysOld < 7) score += 15;
      else if (daysOld < 30) score += 10;
      else if (daysOld < 90) score += 5;

      return { ...product, _score: score };
    });

    // Sort by score descending
    scored.sort((a, b) => b._score - a._score);

    // Get top candidates (3x limit) and shuffle for variety
    const topCandidates = scored.slice(0, limitNum * 3);
    const shuffled = fisherYates(topCandidates);
    const final = shuffled.slice(0, limitNum);

    // Remove score from response
    return res.status(200).json(
      final.map(({ _score, ...product }) => product)
    );
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Fisher-Yates shuffle algorithm for randomizing array
 */
function fisherYates(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
