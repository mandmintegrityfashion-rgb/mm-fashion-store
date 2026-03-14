// pages/api/auth/verify.js
import { mongooseConnect } from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  await mongooseConnect();

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: "No token provided" });
  }

  try {
    const customer = await Customer.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!customer) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    customer.isVerified = true;
    customer.verificationToken = undefined;
    customer.verificationTokenExpiry = undefined;
    await customer.save();

    return res.redirect("/login?verified=1"); // ✅ redirect to login page
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
