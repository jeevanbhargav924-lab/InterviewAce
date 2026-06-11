import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    answer: { type: String, required: true },
    example: { type: String, default: "" },
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
        "Behavioral",
        "HR Interview"
      ] 
    },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    tags: [{ type: String }],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Question = models.Question || model("Question", QuestionSchema);
export default Question;
