import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    quote: { type: String, required: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Review = models.Review || model("Review", ReviewSchema);
export default Review;
