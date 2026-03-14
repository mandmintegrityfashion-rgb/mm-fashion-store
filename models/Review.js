// models/Review.js
import mongoose from "mongoose";
const { Schema, models } = mongoose;

const ReviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", default: null },
    customerName: { type: String, default: "Anonymous", trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, createdAt: -1 });

const Review = models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
