import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await mongooseConnect();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Not authenticated" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle different token field names
    const userId = decoded.id || decoded._id || decoded.sub;
    if (!userId) return res.status(401).json({ error: "Invalid token payload" });

    const customer = await Customer.findById(userId).populate("wishlist.product");
    if (!customer) return res.status(404).json({ error: "User not found" });

    if (req.method === "GET") {
      return res.json(customer.wishlist || []);
    }

    if (req.method === "POST") {
      const { wishlist } = req.body;
      customer.wishlist = wishlist.map((id) => ({ product: id }));
      await customer.save();
      return res.json({ success: true, wishlist: customer.wishlist });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
