import mongoose, { Schema, model, models } from "mongoose";

const TestCaseSchema = new Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const ChallengeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    category: { 
      type: String, 
      enum: ["DSA", "Frontend", "React", "JavaScript"], 
      required: true 
    },
    starterCode: { type: String, required: true },
    testCases: [TestCaseSchema],
    companyTags: [{ type: String }],
  },
  { timestamps: true }
);

const Challenge = models.Challenge || model("Challenge", ChallengeSchema);
export default Challenge;
