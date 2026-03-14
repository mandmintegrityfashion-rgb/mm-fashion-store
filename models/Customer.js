// models/Customer.js
import mongoose, { Schema, models } from "mongoose";

const cartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const wishlistItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "Nigeria" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const customerSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    phone: { type: String },
    password: { type: String, required: true },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },

    cart: [cartItemSchema],
    wishlist: [wishlistItemSchema],
    addresses: [addressSchema],
    newsletterSubscribed: { type: Boolean, default: true },
    storeCredit: { type: Number, default: 0, min: 0 },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Customer = models.Customer || mongoose.model("Customer", customerSchema);
export default Customer;
