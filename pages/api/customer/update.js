import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import jwt from "jsonwebtoken";

function sanitizeString(str, maxLength = 200) {
  return String(str || "").trim().slice(0, maxLength);
}

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

    // Validate and sanitize inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedPhone = sanitizeString(phone, 20);
    const sanitizedAddress = sanitizeString(address, 300);
    const sanitizedCity = sanitizeString(city, 100);

    if (!sanitizedName) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Validate and normalize email
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone format (digits, spaces, dashes, plus)
    if (sanitizedPhone && !/^[0-9\s\-+()]{7,20}$/.test(sanitizedPhone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Check if email is taken by another customer
    const emailOwner = await Customer.findOne({ email: normalizedEmail });
    if (emailOwner && emailOwner._id.toString() !== customerId) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const updateData = {
      name: sanitizedName,
      email: normalizedEmail,
      phone: sanitizedPhone,
    };

    // Update or add default address
    if (sanitizedAddress && sanitizedCity) {
      updateData.addresses = [
        {
          label: "Default",
          recipientName: sanitizedName,
          phone: sanitizedPhone,
          street: sanitizedAddress,
          city: sanitizedCity,
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
