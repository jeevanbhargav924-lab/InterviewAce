import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    userName: { type: String, required: true },
    userImage: { type: String, default: "" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    coverImage: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: [
        "React",
        "React Native",
        "JavaScript",
        "TypeScript",
        "Next.js",
        "Node.js",
        "Node.js / Backend",
        "MongoDB",
        "Career Growth",
        "Interview Preparation",
        "Interview Tips",
        "Resume Tips",
        "System Design",
        "AI Tools"
      ] 
    },
    tags: [{ type: String }],
    author: {
      name: { type: String, required: true },
      image: { type: String, default: "" },
      bio: { type: String, default: "" },
    },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", BlogSchema);
export default Blog;
