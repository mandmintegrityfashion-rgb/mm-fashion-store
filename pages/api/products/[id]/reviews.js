import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import Review from "@/models/Review";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await mongooseConnect();
  const { id } = req.query;

  // 🧩 Validate Product ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  // 🟢 POST — Add a New Review
  if (req.method === "POST") {
    try {
      const { title, text, rating } = req.body;

      if (!rating || !title || !text) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate rating range
      const ratingNum = Number(rating);
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      // Validate text lengths
      if (String(title).trim().length === 0 || String(text).trim().length === 0) {
        return res.status(400).json({ message: "Title and text cannot be empty" });
      }

      // ✅ Decode JWT Token (if provided)
      const authHeader = req.headers.authorization;
      let verifiedCustomer = null;

      if (authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          verifiedCustomer = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          console.warn("Invalid or expired token, proceeding as anonymous");
        }
      }

      // ✅ Ensure product exists
      const product = await Product.findById(id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      // ✅ Create Review
      const review = await Review.create({
        product: id,
        customer: verifiedCustomer?.id
          ? new mongoose.Types.ObjectId(verifiedCustomer.id)
          : null,
        customerName: verifiedCustomer?.name || "Anonymous",
        title,
        text,
        rating,
      });

      // ✅ Add review reference to product
      await Product.findByIdAndUpdate(id, { $push: { reviews: review._id } });

      // ✅ Recalculate Average Rating
      const agg = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: null,
            avg: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]);

      const avg = agg?.[0]?.avg ?? review.rating;
      await Product.findByIdAndUpdate(id, { avgRating: avg });

      // ✅ If logged in, push review to customer profile
      let updatedCustomer = null;
      if (verifiedCustomer?.id && mongoose.Types.ObjectId.isValid(verifiedCustomer.id)) {
        updatedCustomer = await Customer.findByIdAndUpdate(
          verifiedCustomer.id,
          { $push: { reviews: review._id } },
          { new: true }
        );
      }

      // ✅ Populate Review
      const populatedReview = await Review.findById(review._id).populate(
        "customer",
        "name avatar email"
      );

      return res.status(201).json({
        success: true,
        message: "Review added successfully",
        review: populatedReview,
        customer: updatedCustomer ?? null,
      });
    } catch (err) {
      console.error("Error saving review:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while saving review",
        error: err.message,
      });
    }
  }

  // 🟣 GET — Fetch All Reviews for a Product
  if (req.method === "GET") {
    try {
      const reviews = await Review.find({ product: id })
        .sort({ createdAt: -1 })
        .populate("customer", "name avatar email");
      return res.status(200).json({ success: true, reviews });
    } catch (err) {
      console.error("Error fetching reviews:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // 🚫 Unsupported Method
  return res.status(405).json({ message: "Method not allowed" });
}
