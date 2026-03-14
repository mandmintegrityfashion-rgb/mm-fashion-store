// pages/api/auth/login.js
import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginLimiter, applyRateLimit } from "@/lib/rateLimit";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Rate limiting
  const rateCheck = applyRateLimit(loginLimiter, req);
  if (rateCheck.rateLimited) {
    return res.status(429).json({ success: false, message: rateCheck.message });
  }

  try {
    await mongooseConnect();

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Case-insensitive email lookup
    const normalizedEmail = String(email).trim().toLowerCase();

    // Find customer (exclude heavy arrays for login speed)
    const customer = await Customer.findOne({ email: normalizedEmail })
      .select("name email phone password avatar isVerified");

    if (!customer) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!customer.isVerified) {
      return res.status(400).json({ success: false, message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Create JWT token with 24-hour expiry
    const token = jwt.sign(
      { id: customer._id, name: customer.name, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Respond with lightweight data
    return res.status(200).json({
      success: true,
      token,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar || "",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
