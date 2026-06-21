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
  question: { type: String, required: true },
  slug: { type: String, required: true },
});
const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

const UPDATES = [
  {
    question: "What is the Event Loop in Node.js?",
    targetSlug: "what-is-event-loop"
  },
  {
    question: "What is FlatList and why should it be used?",
    targetSlug: "what-is-flatlist"
  }
];

async function run() {
  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected successfully!");

    for (const item of UPDATES) {
      const q = await Question.findOne({ question: item.question });
      if (q) {
        console.log(`Found question: "${q.question}" with current slug: "${q.slug}". Updating to: "${item.targetSlug}"`);
        await Question.updateOne({ _id: q._id }, { $set: { slug: item.targetSlug } });
      } else {
        console.warn(`Could not find question matching title: "${item.question}"`);
      }
    }

    console.log("Updates complete.");
  } catch (err) {
    console.error("Error during updating slugs:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
