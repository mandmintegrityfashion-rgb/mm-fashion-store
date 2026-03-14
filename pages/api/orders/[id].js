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

  try {
    const order = await Order.findById(id)
      .populate("items.productId")
      .populate("cartProducts.productId")
      .lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If auth token is provided, verify ownership
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded._id;
        if (order.customer && order.customer.toString() !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
      } catch {
        // Token invalid — fall through to return order by ID
      }
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order Fetch Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
