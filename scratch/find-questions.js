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

const QuestionSchema = new mongoose.Schema({
  question: String,
  slug: String,
  category: String,
});
const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

async function run() {
  try {
    await mongoose.connect(mongodbUri);
    const results = await Question.find({
      $or: [
        { question: /event loop/i },
        { question: /flatlist/i }
      ]
    }).lean();
    console.log("Matching questions:", JSON.stringify(results, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
