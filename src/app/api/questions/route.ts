import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Question from "@/models/Question";
import { SEED_QUESTIONS } from "@/lib/seeder";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const slug = searchParams.get("slug");

    // Clean migration check for development: ensure seeds include slugs
    const count = await Question.countDocuments();
    if (count < 8) {
      await Question.deleteMany({});
      await Question.insertMany(SEED_QUESTIONS);
    }

    if (slug) {
      // Return single question and increment views
      const question = await Question.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true });
      if (!question) {
        return NextResponse.json({ message: "Question not found" }, { status: 404 });
      }
      return NextResponse.json(question);
    }

    const filter: any = {};
    if (category) {
      // Category parameter matches slug categories (e.g. react-native -> React Native)
      const mappedCategory = category.toLowerCase() === "react-native" ? "React Native" :
                             category.toLowerCase() === "hr-interview" ? "HR Interview" :
                             category.toLowerCase() === "nextjs" ? "Next.js" :
                             category.toLowerCase() === "nodejs" ? "Node.js" :
                             category.charAt(0).toUpperCase() + category.slice(1);
                             
      filter.category = { $regex: new RegExp(`^${mappedCategory}$`, "i") };
    }
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter);
    return NextResponse.json(questions);
  } catch (error: any) {
    console.error("Questions API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const formatQuestion = (data: any) => {
      const { question, answer, category, difficulty, tags, example, faqs } = data;
      if (!question || !answer || !category || !difficulty) {
        throw new Error(`Missing required fields (question, answer, category, or difficulty) for: "${question || 'Unknown'}"`);
      }

      const slug = question
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return {
        question,
        slug,
        answer,
        category,
        difficulty: difficulty.toLowerCase(),
        tags: tags || [],
        example: example || "",
        faqs: faqs || [],
        views: 0
      };
    };

    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ message: "Empty questions array provided" }, { status: 400 });
      }
      const preparedQuestions = body.map((item: any) => formatQuestion(item));
      const newQuestions = await Question.insertMany(preparedQuestions);
      return NextResponse.json({
        message: `Successfully inserted ${newQuestions.length} questions`,
        insertedCount: newQuestions.length,
        data: newQuestions
      }, { status: 201 });
    } else {
      const prepared = formatQuestion(body);
      const newQuestion = await Question.create(prepared);
      return NextResponse.json(newQuestion, { status: 201 });
    }
  } catch (error: any) {
    console.error("Questions POST API error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
