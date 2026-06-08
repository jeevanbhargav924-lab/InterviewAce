import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: [
        "React", 
        "JavaScript", 
        "TypeScript", 
        "React Native", 
        "Next.js", 
        "Node.js", 
        "MongoDB", 
        "HR", 
        "Behavioral"
      ] 
    },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Question = models.Question || model("Question", QuestionSchema);
export default Question;
