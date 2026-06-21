const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Read MONGODB_URI from .env.local
const envPath = path.join(__dirname, "../.env.local");
let mongodbUri = "mongodb://localhost:27017/interviewace";
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/^MONGODB_URI=(.*)$/m);
  if (match && match[1]) {
    mongodbUri = match[1].trim();
  }
}

console.log("Connecting to:", mongodbUri);

const QuestionSchema = new mongoose.Schema({
  question: String,
  slug: String,
  category: String,
});
const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

async function run() {
  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected successfully!");
    const totalCount = await Question.countDocuments();
    const missingSlugCount = await Question.countDocuments({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" },
        { slug: "undefined" }
      ]
    });
    console.log("Total questions in database:", totalCount);
    console.log("Questions missing a slug:", missingSlugCount);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
