import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customerId = decoded.id;

    const { name, email, phone, address, city } = req.body;

    // 🧱 Update customer basic info
    const updateData = { name, email, phone };

    // 🏠 Update or add default address
    if (address && city) {
      updateData.addresses = [
        {
          label: "Default",
          recipientName: name,
          phone,
          street: address,
          city,
          isDefault: true,
        },
      ];
    }

    const updated = await Customer.findByIdAndUpdate(customerId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json({ success: true, customer: updated });
  } catch (err) {
    console.error("Customer update error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
