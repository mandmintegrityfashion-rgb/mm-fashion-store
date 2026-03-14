import Product from "@/models/Product";
import Order from "@/models/Order";
import mongooseConnect from "@/lib/mongodb";
import jwt from "jsonwebtoken";

/**
 * GET /api/recommendations/previous-purchases
 * Show similar products to what user previously purchased
 * Returns:
 * 1. Products frequently bought together
 * 2. Upgraded versions of previously purchased items
 * 3. New products in categories user loves
 *
 * Only for authenticated users
 * Query params:
 * - limit: number of products (default: 8)
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    // Get customer ID from JWT token (required)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - login required" });
    }

    const token = authHeader.substring(7);
    let customerId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
      customerId = decoded.id || decoded.customerId;
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { limit = "8" } = req.query;
    const limitNum = Math.min(parseInt(limit) || 8, 50);

    // Fetch customer's purchase history
    const orders = await Order.find({
      customer: customerId,
      paymentStatus: "paid",
    })
      .populate("cartProducts.productId", "_id category rating reviews price")
      .lean()
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    // Extract purchased product IDs and their categories
    const purchasedProductIds = new Set();
    const purchasedCategories = new Map(); // category -> count
    const purchasedProducts = new Map(); // productId -> product data

    orders.forEach((order) => {
      order.cartProducts?.forEach((item) => {
        if (item.productId) {
          const productId = String(item.productId._id);
          purchasedProductIds.add(productId);

          if (item.productId.category) {
            const catId = String(item.productId.category);
            purchasedCategories.set(
              catId,
              (purchasedCategories.get(catId) || 0) + 1
            );
          }

          purchasedProducts.set(productId, {
            id: productId,
            category: item.productId.category,
          });
        }
      });
    });

    // Find products similar to purchased items
    const allProducts = await Product.find({
      $and: [
        { _id: { $nin: Array.from(purchasedProductIds) } }, // Don't recommend already purchased
        {
          $or: [
            // Strategy 1: Same categories they love (by frequency)
            {
              category: {
                $in: Array.from(purchasedCategories.keys()),
              },
            },
          ],
        },
        { stock: { $gt: 0 } }, // Only in-stock
      ],
    })
      .lean()
      .select("_id name price promoPrice category rating reviews stock images createdAt")
      .exec();

    if (!allProducts || allProducts.length === 0) {
      return res.status(200).json([]);
    }

    // Score products
    const scored = allProducts.map((product) => {
      let score = 0;

      // Factor 1: Is it in a category user frequently purchases from?
      const categoryScore = purchasedCategories.get(String(product.category)) || 0;
      score += categoryScore * 20; // Higher score for more frequently purchased categories

      // Factor 2: Quality (rating)
      if (product.rating && product.rating > 0) {
        score += (product.rating / 5) * 30;
      }

      // Factor 3: Popularity (reviews)
      const reviewCount = product.reviews?.length || 0;
      score += Math.min((reviewCount / 50) * 25, 25);

      // Factor 4: Stock/Availability
      if (product.stock > 20) score += 15;
      else if (product.stock > 10) score += 10;
      else score += 5;

      // Factor 5: Recency (new products)
      const daysOld = Math.floor(
        (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysOld < 14) score += 20;
      else if (daysOld < 60) score += 10;

      return { ...product, _score: score };
    });

    // Sort by score
    scored.sort((a, b) => b._score - a._score);

    // Get top candidates and shuffle for variety
    const topCandidates = scored.slice(0, Math.max(limitNum * 2, 20));
    const shuffled = fisherYates(topCandidates).slice(0, limitNum);

    return res.status(200).json(
      shuffled.map(({ _score, ...product }) => product)
    );
  } catch (error) {
    console.error("Error fetching previous-purchases recommendations:", error);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Fisher-Yates shuffle
 */
function fisherYates(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
