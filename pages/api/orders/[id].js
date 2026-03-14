// pages/api/orders/[id].js
import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await mongooseConnect();

  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Authenticate the request
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;

    const order = await Order.findById(id)
      .populate("items.productId")
      .populate("cartProducts.productId")
      .lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only allow the order owner to view it
    if (order.customer.toString() !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    console.error("Order Fetch Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
