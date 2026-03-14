import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await mongooseConnect();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized - No token" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const customerId = decoded.id; // assuming you sign JWTs with { id: customer._id }
    if (!customerId) {
      return res.status(400).json({ error: "Invalid customerId in token" });
    }

    // Clear cart in DB
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { cart: [] },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.json({ success: true, cart: customer.cart });
  } catch (err) {
    console.error("Clear cart error:", err);
    return res.status(500).json({ error: "Server error clearing cart" });
  }
}
