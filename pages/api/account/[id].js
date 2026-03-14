// pages/api/account/[id].js
import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await mongooseConnect();

  const { id } = req.query;

  // Authenticate the request
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;

    // Only allow users to access their own data
    if (userId !== id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const customer = await Customer.findById(id)
      .select("-password -verificationToken -verificationTokenExpiry")
      .populate("wishlist.product")
      .lean();

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(200).json(customer);
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    console.error("Error fetching customer:", err);
    return res.status(500).json({ error: "Failed to fetch customer" });
  }
}
