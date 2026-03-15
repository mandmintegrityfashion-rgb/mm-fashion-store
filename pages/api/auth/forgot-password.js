import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

  try {
    await mongooseConnect();

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const customer = await Customer.findOne({ email: normalizedEmail }).select("name email");

    // Always return success to prevent email enumeration
    if (!customer) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    await Customer.updateOne(
      { _id: customer._id },
      { resetPasswordToken: resetToken, resetPasswordExpiry: resetExpiry }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetUrl = `${process.env.VERCEL_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"M&M Fashion" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: "Reset Your Password - M&M Fashion",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #1F2D3D;">Password Reset</h1>
          <p>Hi ${escapeHtml(customer.name)},</p>
          <p>We received a request to reset your password. Click the button below to set a new one:</p>
          <a href="${resetUrl}" style="display:inline-block; padding:12px 24px; background:#4C9EFF; color:white; border-radius:8px; text-decoration:none; font-weight:600; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color:#8E95A2; font-size:14px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
