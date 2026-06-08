import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  role: { type: String, enum: ["interviewer", "user"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MockInterviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true }, // e.g. "React Developer"
    messages: [MessageSchema],
    scores: {
      technical: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
    },
    feedback: { type: String, default: "" },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

const MockInterview = models.MockInterview || model("MockInterview", MockInterviewSchema);
export default MockInterview;
