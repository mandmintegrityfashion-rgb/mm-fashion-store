import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const customer = await Customer.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    }).select("_id");

    if (!customer) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset link. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Customer.updateOne(
      { _id: customer._id },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
