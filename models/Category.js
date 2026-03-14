import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: [{ type: Schema.Types.Mixed }],
  image: [
    {
      full: String,
      thumb: String,
    },
  ],
  slug: { type: String },
});

CategorySchema.index({ name: 1 });
CategorySchema.index({ slug: 1 });

export const Category =
  models?.Category || model("Category", CategorySchema);
