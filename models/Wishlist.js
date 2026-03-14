// models/Wishlist.js
import mongoose, { Schema, models } from "mongoose";

const WishlistSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
