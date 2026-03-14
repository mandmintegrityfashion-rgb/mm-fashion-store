// models/Product.js
import mongoose from "mongoose";
const { Schema, models } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  images: [{ full: String, thumb: String }],
  description: { type: String, default: "" },
  category: { type: String, default: "" },
  properties: [{ type: Schema.Types.Mixed }],
  quantity: { type: Number, default: 0, min: 0 },
  minStock: { type: Number, default: 0, min: 0 },
  maxStock: { type: Number, default: 0, min: 0 },
  isPromotion: { type: Boolean, default: false },
  promoPrice: { type: Number, min: 0 },
  promoStart: Date,
  promoEnd: Date,
  totalUnitsSold: { type: Number, default: 0, min: 0 },
  totalRevenue: { type: Number, default: 0, min: 0 },
  lastSoldAt: Date,
  salesHistory: [
    {
      orderId: { type: Schema.Types.ObjectId, ref: "Order" },
      quantity: { type: Number, default: 0 },
      salePrice: { type: Number, default: 0 },
      soldAt: { type: Date, default: Date.now },
    },
  ],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  avgRating: { type: Number, default: 0, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

const Product = models.Product || mongoose.model("Product", ProductSchema);
export default Product;
