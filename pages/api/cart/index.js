import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await mongooseConnect();

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Handle different token field names
    const userId = decoded.id || decoded._id || decoded.sub;
    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    if (req.method === "GET") {
      // ✅ Fetch with populated cart
      const customer = await Customer.findById(userId).populate("cart.product");
      if (!customer) return res.status(401).json({ error: "Invalid token" });
      return res.json(customer.cart || []);
    }

    if (req.method === "POST") {
      const { cart } = req.body;

      // ✅ Update directly to avoid VersionError
      const updatedCustomer = await Customer.findByIdAndUpdate(
        userId,
        { cart },
        { new: true } // return updated doc
      ).populate("cart.product");

      if (!updatedCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      return res.json(updatedCustomer.cart);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
