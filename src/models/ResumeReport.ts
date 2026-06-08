import mongoose, { Schema, model, models } from "mongoose";

const ResumeReportSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    atsScore: { type: Number, required: true },
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
    optimizedBullets: [
      {
        original: { type: String },
        optimized: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const ResumeReport = models.ResumeReport || model("ResumeReport", ResumeReportSchema);
export default ResumeReport;
