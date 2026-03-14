// pages/api/auth/login.js
import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Find customer (exclude heavy arrays for login speed)
    const customer = await Customer.findOne({ email })
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

    // Create JWT token
    const token = jwt.sign(
      { id: customer._id, name: customer.name, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Respond with lightweight data
    return res.status(200).json({
      success: true,
      token,
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
