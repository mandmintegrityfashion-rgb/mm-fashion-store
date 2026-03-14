// pages/api/paystack/verify.js
import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";
import axios from "axios";

export default async function handler(req, res) {
  await mongooseConnect();

  const { reference, orderId } = req.body;

  if (!reference) {
    return res.status(400).json({ error: "Missing reference" });
  }

  try {
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = verifyRes.data?.data;
    if (!data) {
      return res.status(400).json({ error: "Invalid Paystack response" });
    }

    const resolvedOrderId = orderId || data.metadata?.orderId;
    if (!resolvedOrderId) {
      return res.status(400).json({ error: "Order ID missing from request and metadata" });
    }

    const paymentStatus = data.status === "success" ? "paid" : "failed";
    const orderStatus = data.status === "success" ? "processing" : "pending";

    const order = await Order.findByIdAndUpdate(
      resolvedOrderId,
      {
        paymentReference: reference,
        paymentStatus,
        status: orderStatus,
      },
      { new: true }
    )
      .populate("cartProducts.productId", "name images")
      .populate("customer", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error("Verify Error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Payment verification failed" });
  }
}
