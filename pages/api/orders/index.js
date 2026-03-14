// pages/api/orders.js
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { mongooseConnect } from "@/lib/mongoose";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { paymentLimiter, applyRateLimit } from "@/lib/rateLimit";

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "POST") {
    try {
      await applyRateLimit(req, res, paymentLimiter);
    } catch {
      return res.status(429).json({ success: false, message: "Too many order attempts. Please try again later." });
    }

    try {
      const { customer, cartProducts, items, subtotal, shippingCost, total } =
        req.body;

      if (!customer?.email || !cartProducts?.length || !total) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Find existing customer or create with a secure random password
      let customerDoc = await Customer.findOne({ email: customer.email });
      if (!customerDoc) {
        const randomPassword = crypto.randomBytes(32).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 12);
        customerDoc = await Customer.create({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          password: hashedPassword,
        });
      }

      // ✅ Normalize cart products
      const normalizedCart = await Promise.all(
        cartProducts.map(async (item) => {
          const product = await Product.findById(item._id).select(
            "name salePriceIncTax images"
          );
          return {
            productId: item._id,
            name: product?.name || item.name,
            price: item.price,
            quantity: item.quantity,
            image:
              Array.isArray(product?.images) && product.images.length > 0
                ? product.images[0]
                : item.image || null,
          };
        })
      );

      // ✅ Save items snapshot with productId included
      const savedItems = items?.map((i) => ({
        productId: i._id || i.productId, // ensure productId is stored
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image || null,
      }));

      // ✅ Create the order
      const order = await Order.create({
        customer: customerDoc._id,
        shippingDetails: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
        },
        cartProducts: normalizedCart,
        items: savedItems,
        subtotal,
        shippingCost,
        total,
        status: "Pending",
        paymentStatus: "Pending",
      });

      // 📨 Configure Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // 🧾 Build fancy HTML email
      const htmlBody = `
        <div style="font-family: 'Segoe UI', sans-serif; background: #FDFBF7; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(15,25,35,0.08);">
            <div style="background: #0F1923; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-family: Georgia, serif; letter-spacing: 1px;">M&amp;M Fashion</h2>
              <p style="margin: 4px 0 0; color: #C9A96E; font-size: 14px;">Your Order Has Been Received!</p>
            </div>

            <div style="padding: 25px;">
              <p>Hi <strong>${escapeHtml(customer.name)}</strong>,</p>
              <p>Thank you for your order! We’ve received your order <strong>${
                order._id
              }</strong> and our team is preparing it for shipment.</p>

              <h3 style="margin-top: 25px;">📦 Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background: #F5F0E8;">
                    <th style="padding: 8px; border-bottom: 1px solid #E8E0D4; color: #0F1923;">Item</th>
                    <th style="padding: 8px; border-bottom: 1px solid #E8E0D4; color: #0F1923;">Qty</th>
                    <th style="padding: 8px; border-bottom: 1px solid #E8E0D4; color: #0F1923;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${savedItems
                    .map(
                      (p) => `
                        <tr>
                          <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${
                            p.name
                          }</td>
                          <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${
                            p.quantity
                          }</td>
                          <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">₦${p.price.toLocaleString()}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>

              <p style="margin-top: 20px;"><strong>Subtotal:</strong> ₦${subtotal.toLocaleString()}</p>
              <p><strong>Shipping:</strong> ₦${shippingCost.toLocaleString()}</p>
              <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
              <p><strong>Status:</strong> Pending</p>

              <h3 style="margin-top: 25px;">&#128205; Delivery Details</h3>
              <p>
                ${escapeHtml(customer.address)}<br/>
                ${escapeHtml(customer.city)}<br/>
                Phone: ${escapeHtml(customer.phone)}
              </p>

              <p style="margin-top: 30px;">Thank you for shopping with <strong>M&M Fashion</strong>!</p>
              <p style="font-size: 12px; color: #8E95A2;">If you have any questions, reply to this email or contact us at mandmintegrityfashion@gmail.com.</p>
            </div>
          </div>
        </div>
      `;

      // 🏪 Vendor and Company emails (update these)
      const companyEmail = "mandmintegrityfashion@gmail.com";

      // ✅ Send one email (to customer, CC vendor & company)
      await transporter.sendMail({
        from: `"M&M Fashion" <${process.env.EMAIL_USER}>`,
        to: customer.email,
        cc: [companyEmail],
        subject: `Order Confirmation - M&M Fashion`,
        html: htmlBody,
      });

      return res.status(201).json({
        success: true,
        orderId: order._id,
        order,
      });
    } catch (err) {
      console.error("Order creation error:", err);
      return res.status(500).json({
        success: false,
        message: "Error saving order",
      });
    }
  }

  if (req.method === "GET") {
    try {
      const orders = await Order.find()
        .populate("customer", "name email phone")
        .populate("cartProducts.productId", "name image salePriceIncTax")
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({ success: true, orders });
    } catch (err) {
      console.error("Order fetch error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching orders" });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
