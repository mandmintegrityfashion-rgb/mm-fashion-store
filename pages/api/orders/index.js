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
        <div style="font-family: 'Segoe UI', sans-serif; background: #F7FAFC; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(26,93,171,0.08);">
            <div style="background: #1A5DAB; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-family: Georgia, serif; letter-spacing: 1px;">M&amp;M Fashion</h2>
              <p style="margin: 4px 0 0; color: #4C9EFF; font-size: 14px;">Your Order Has Been Received!</p>
            </div>

            <div style="padding: 25px;">
              <p>Hi <strong>${escapeHtml(customer.name)}</strong>,</p>
              <p>Thank you for your order! We’ve received your order <strong>${
                order._id
              }</strong> and our team is preparing it for shipment.</p>

              <h3 style="margin-top: 25px; color: #1F2D3D;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background: #E6F0FA;">
                    <th style="padding: 8px; border-bottom: 1px solid #C5D9ED; text-align: left; color: #1F2D3D;">Item</th>
                    <th style="padding: 8px; border-bottom: 1px solid #C5D9ED; text-align: left; color: #1F2D3D;">Qty</th>
                    <th style="padding: 8px; border-bottom: 1px solid #C5D9ED; text-align: left; color: #1F2D3D;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${savedItems
                    .map(
                      (p) => `
                        <tr>
                          <td style="padding: 8px; border-bottom: 1px solid #E6F0FA;">${
                            p.name
                          }</td>
                          <td style="padding: 8px; border-bottom: 1px solid #E6F0FA;">${
                            p.quantity
                          }</td>
                          <td style="padding: 8px; border-bottom: 1px solid #E6F0FA;">₦${p.price.toLocaleString()}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>

              <div style="margin-top: 20px; padding: 16px; background: #E6F0FA; border-radius: 8px; border-left: 4px solid #4C9EFF;">
                <p style="margin: 4px 0; color: #1F2D3D;"><strong>Subtotal:</strong> ₦${subtotal.toLocaleString()}</p>
                <p style="margin: 4px 0; color: #1F2D3D;"><strong>Shipping:</strong> ₦${shippingCost.toLocaleString()}</p>
                <p style="margin: 8px 0 0; font-size: 18px; color: #1A5DAB;"><strong>Total:</strong> ₦${total.toLocaleString()}</p>
              </div>
              <p style="margin-top: 12px; color: #1F2D3D;"><strong>Status:</strong> <span style="color: #4C9EFF; font-weight: 600;">Pending</span></p>

              <h3 style="margin-top: 25px; color: #1F2D3D;">📍 Delivery Details</h3>
              <div style="padding: 12px; border: 1px solid #C5D9ED; border-radius: 8px; background: #F7FAFC;">
                <p style="margin: 2px 0; color: #1F2D3D;">
                ${escapeHtml(customer.address)}<br/>
                ${escapeHtml(customer.city)}<br/>
                Phone: ${escapeHtml(customer.phone)}
              </p>

              <p style="margin-top: 30px; color: #1F2D3D;">Thank you for shopping with <strong style="color: #4C9EFF;">M&amp;M Fashion</strong>!</p>
              <p style="font-size: 12px; color: #668299;">If you have any questions, reply to this email or contact us at <a href="mailto:mandmintegrityfashion@gmail.com" style="color: #4C9EFF; text-decoration: none;">mandmintegrityfashion@gmail.com</a>.</p>
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
