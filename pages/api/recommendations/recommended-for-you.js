import Product from "@/models/Product";
import mongooseConnect from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";

/**
 * GET /api/recommendations/recommended-for-you
 * Personalized recommendations combining:
 * 1. User's purchase history (if logged in)
 * 2. Highest rated products in purchased categories
 * 3. Popular trending products
 * 4. New arrivals in favorite categories
 *
 * Query params:
 * - limit: number of products (default: 8)
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    const { limit = "8" } = req.query;
    const limitNum = Math.min(parseInt(limit) || 8, 50);

    // Get customer ID from token if available
    const authHeader = req.headers.authorization;
    let customerId = null;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        customerId = decoded.id || decoded.customerId;
      } catch (err) {
        // User not authenticated, fall back to general recommendations
      }
    }

    // Fetch user's purchase history if logged in
    let purchasedCategories = [];
    let purchasedProductIds = [];

    if (customerId) {
      const orders = await Order.find({
        customer: customerId,
        paymentStatus: "paid",
      })
        .populate("cartProducts.productId", "category _id")
        .lean()
        .exec();

      const categorySet = new Set();
      const productSet = new Set();

      orders.forEach((order) => {
        order.cartProducts?.forEach((item) => {
          if (item.productId?.category) {
            categorySet.add(String(item.productId.category));
          }
          if (item.productId?._id) {
            productSet.add(String(item.productId._id));
          }
        });
      });

      purchasedCategories = Array.from(categorySet);
      purchasedProductIds = Array.from(productSet);
    }

    // Get recommendations based on purchase history or popular products
    let recommendations = [];

    if (purchasedCategories.length > 0) {
      // Strategy 1: Products from categories user has purchased in
      const categoryRecommendations = await Product.find({
        category: { $in: purchasedCategories },
        _id: { $nin: purchasedProductIds },
        stock: { $gt: 0 },
      })
        .lean()
        .select("_id name price promoPrice category rating reviews stock images")
        .sort({ rating: -1, "reviews.length": -1 })
        .limit(limitNum * 2)
        .exec();

      recommendations = categoryRecommendations;
    }

    // Strategy 2: If not enough, add trending/popular products
    if (recommendations.length < limitNum) {
      const trendingProducts = await Product.find({
        _id: { $nin: [...purchasedProductIds, ...recommendations.map((r) => r._id)] },
        stock: { $gt: 0 },
      })
        .lean()
        .select("_id name price promoPrice category rating reviews stock images")
        .sort({ rating: -1, "reviews.length": -1 })
        .limit(limitNum * 2)
        .exec();

      recommendations = [...recommendations, ...trendingProducts];
    }

    // Strategy 3: If still not enough, add recent products
    if (recommendations.length < limitNum) {
      const recentProducts = await Product.find({
        _id: { $nin: [...purchasedProductIds, ...recommendations.map((r) => r._id)] },
        stock: { $gt: 0 },
      })
        .lean()
        .select("_id name price promoPrice category rating reviews stock images")
        .sort({ createdAt: -1 })
        .limit(limitNum * 2)
        .exec();

      recommendations = [...recommendations, ...recentProducts];
    }

    // Remove duplicates and score
    const uniqueMap = new Map();
    recommendations.forEach((product) => {
      const key = String(product._id);
      if (!uniqueMap.has(key)) {
        // Calculate score for sorting
        let score = 0;
        if (product.rating) score += (product.rating / 5) * 30;
        const reviewCount = product.reviews?.length || 0;
        score += Math.min((reviewCount / 50) * 20, 20);
        score += Math.random() * 10; // Add randomness for variety

        uniqueMap.set(key, { ...product, _score: score });
      }
    });

    // Sort by score and get top results
    const sorted = Array.from(uniqueMap.values()).sort((a, b) => b._score - a._score);
    const final = sorted.slice(0, limitNum);

    return res.status(200).json(
      final.map(({ _score, ...product }) => product)
    );
  } catch (error) {
    console.error("Error fetching recommended-for-you:", error);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
