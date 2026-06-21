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
  slug: { type: String },
  category: { type: String },
});
const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

function cleanSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function run() {
  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected successfully!");

    // Fetch all questions to build a map of current slugs to prevent duplicate keys
    const allQuestions = await Question.find({}).lean();
    console.log(`Fetched ${allQuestions.length} total questions from database.`);

    const existingSlugs = new Set();
    const questionsToFix = [];

    for (const q of allQuestions) {
      if (q.slug && q.slug !== "undefined" && q.slug.trim() !== "") {
        existingSlugs.add(q.slug);
      } else {
        questionsToFix.push(q);
      }
    }

    console.log(`Found ${existingSlugs.size} valid existing slugs.`);
    console.log(`Found ${questionsToFix.length} questions needing a slug.`);

    let fixedCount = 0;
    for (const q of questionsToFix) {
      let baseSlug = cleanSlug(q.question);
      if (!baseSlug) {
        baseSlug = "question-" + q._id.toString();
      }

      let uniqueSlug = baseSlug;
      let counter = 1;
      while (existingSlugs.has(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Add to set so subsequent updates don't collide
      existingSlugs.add(uniqueSlug);

      // Update in database
      await Question.updateOne({ _id: q._id }, { $set: { slug: uniqueSlug } });
      fixedCount++;
      
      if (fixedCount <= 10) {
        console.log(`Assigned slug "${uniqueSlug}" to question: "${q.question.substring(0, 50)}..."`);
      }
    }

    console.log(`Successfully fixed ${fixedCount} questions in the database!`);
  } catch (err) {
    console.error("Error during migration:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
