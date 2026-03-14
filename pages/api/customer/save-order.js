import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Authenticate the request
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const { orderId } = req.body;

  if (!orderId) return res.status(400).json({ error: "Order ID is required" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;

    await mongooseConnect();

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Verify the order belongs to this customer
    if (order.customer.toString() !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    await Customer.findByIdAndUpdate(userId, {
      $addToSet: { orders: order._id },
    });

    res.status(200).json({ success: true, message: "Order saved to customer profile" });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to save order" });
  }
}
