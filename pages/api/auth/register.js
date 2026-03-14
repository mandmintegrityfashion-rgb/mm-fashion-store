import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { registerLimiter, applyRateLimit } from "@/lib/rateLimit";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const rateCheck = applyRateLimit(registerLimiter, req);
  if (rateCheck.rateLimited) {
    return res.status(429).json({ success: false, message: rateCheck.message });
  }

  try {
    await mongooseConnect();

    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // Case-insensitive email normalization
    const normalizedEmail = String(email).trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Sanitize name
    const sanitizedName = String(name).trim().slice(0, 100);

    const existing = await Customer.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    const customer = await Customer.create({
      name: sanitizedName,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry: tokenExpiry,
      cart: [],
      wishlist: [],
      addresses: [],
      storeCredit: 0,
      newsletterSubscribed: true,
      avatar: "", // Optional: you can allow default avatar
      orders: [],
    });

    // Email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"M&M Fashion" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: "Verify your email",
      html: `
        <h1>Welcome, ${escapeHtml(customer.name)}</h1>
        <p>Please confirm your account by clicking below:</p>
        <a href="${verifyUrl}" style="padding:10px 15px; background:#4C9EFF; color:white; border-radius:5px; text-decoration:none;">
          Verify Email
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Check your email to verify.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
