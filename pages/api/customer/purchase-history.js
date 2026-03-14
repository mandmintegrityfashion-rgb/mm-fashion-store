import Customer from "@/models/Customer";
import Order from "@/models/Order";
import mongooseConnect from "@/lib/mongodb";
import jwt from "jsonwebtoken";

/**
 * GET /api/customer/purchase-history
 * Fetch user's purchase history and product categories
 * Used for personalized recommendations
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    // Get customer ID from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    let customerId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
      customerId = decoded.id || decoded.customerId;
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch customer's orders with product details
    const orders = await Order.find({
      customer: customerId,
      paymentStatus: "paid",
    })
      .populate("cartProducts.productId", "name category rating images price")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        purchaseHistory: [],
        purchasedProductIds: [],
        purchasedCategories: [],
        totalPurchases: 0,
      });
    }

    // Extract product IDs and categories
    const purchasedProducts = new Map(); // productId -> product data
    const purchasedCategories = new Set();

    orders.forEach((order) => {
      order.cartProducts?.forEach((item) => {
        if (item.productId) {
          purchasedProducts.set(String(item.productId._id), {
            id: String(item.productId._id),
            name: item.productId.name,
            category: item.productId.category,
            rating: item.productId.rating,
            images: item.productId.images,
          });

          if (item.productId.category) {
            purchasedCategories.add(String(item.productId.category));
          }
        }
      });
    });

    return res.status(200).json({
      purchaseHistory: orders.map((order) => ({
        orderId: String(order._id),
        date: order.createdAt,
        total: order.total,
        products: order.cartProducts?.map((p) => ({
          productId: String(p.productId?._id || p.productId),
          name: p.name,
          quantity: p.quantity,
          price: p.price,
        })),
      })),
      purchasedProductIds: Array.from(purchasedProducts.keys()),
      purchasedCategories: Array.from(purchasedCategories),
      purchasedProductsData: Array.from(purchasedProducts.values()),
      totalPurchases: orders.length,
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
