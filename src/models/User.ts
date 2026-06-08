import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscription: {
      plan: { type: String, enum: ["free", "premium"], default: "free" },
      status: { type: String, enum: ["active", "inactive"], default: "inactive" },
      expiresAt: { type: Date, default: null },
      stripeCustomerId: { type: String, default: null },
      stripeSubscriptionId: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
