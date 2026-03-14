// pages/api/account/newsletter.js
import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ✅ Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await mongooseConnect();

  try {
    // ✅ Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ✅ Extract and verify JWT token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Handle different token field names
    const userId = decoded.id || decoded._id || decoded.sub;
    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // ✅ Get the subscribed preference from request body
    const { subscribed } = req.body;

    if (typeof subscribed !== "boolean") {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // ✅ Find customer by ID and update newsletter preference
    const customer = await Customer.findByIdAndUpdate(
      userId,
      { newsletterSubscribed: subscribed },
      { new: true }
    ).lean();

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // ✅ Set cache headers
    res.setHeader("Cache-Control", "no-cache, no-store, max-age=0");

    return res.status(200).json({
      success: true,
      subscribed: customer.newsletterSubscribed,
    });
  } catch (err) {
    const errorMessage = err?.message || "Failed to update newsletter preference";
    
    console.error("Newsletter update error:", errorMessage);
    
    // ✅ Handle JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    return res.status(500).json({
      error: "Failed to update newsletter preference",
      ...(process.env.NODE_ENV === "development" && { details: errorMessage }),
    });
  }
}
