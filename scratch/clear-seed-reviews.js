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

const ReviewSchema = new mongoose.Schema({
  name: String,
  role: String,
  stars: Number,
  quote: String,
});
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

const SEED_NAMES = ["Devon Lane", "Kristin Watson", "Amir Al-Otaibi"];

async function run() {
  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected successfully!");

    const countBefore = await Review.countDocuments();
    console.log("Reviews count before delete:", countBefore);

    const deleteResult = await Review.deleteMany({ name: { $in: SEED_NAMES } });
    console.log(`Deleted ${deleteResult.deletedCount} seed reviews.`);

    const countAfter = await Review.countDocuments();
    console.log("Reviews count after delete:", countAfter);

  } catch (err) {
    console.error("Error during clearing seed reviews:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
