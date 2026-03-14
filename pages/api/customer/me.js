import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await mongooseConnect();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer = await Customer.findById(decoded.id).lean();
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // ✅ Extract default address
    let address = "";
    let city = "";
    let country = "";
    if (Array.isArray(customer.addresses) && customer.addresses.length > 0) {
      const defaultAddr =
        customer.addresses.find((a) => a.isDefault) || customer.addresses[0];
      address = defaultAddr.street || "";
      city = defaultAddr.city || "";
      country = defaultAddr.country || "";
    }

    return res.status(200).json({
      success: true,
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address,
        city,
        country,
      },
    });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
