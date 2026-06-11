import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Question from "@/models/Question";
import Blog from "@/models/Blog";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ questions: [], blogs: [], categories: [] });
    }

    const regex = new RegExp(query, "i");

    // 1. Search Categories
    const allCategories = [
      { name: "React", slug: "react", desc: "Hooks, state architecture, and rendering performance." },
      { name: "React Native", slug: "react-native", desc: "Bridges, native modules, layout, and performance." },
      { name: "JavaScript", slug: "javascript", desc: "Closures, scopes, lexical state, events, and syntax." },
      { name: "TypeScript", slug: "typescript", desc: "Generics, type guards, interfaces, and safety limits." },
      { name: "Next.js", slug: "nextjs", desc: "App router, SSR, page cache, static layouts, and SEO." },
      { name: "Node.js", slug: "nodejs", desc: "Event loop, event emitters, streams, and cluster scaling." },
      { name: "HR Interview", slug: "hr-interview", desc: "STAR behavioral replies and collaboration skills." }
    ];
    const filteredCategories = allCategories.filter(
      (cat) => regex.test(cat.name) || regex.test(cat.desc)
    );

    // 2. Search Questions
    const questions = await Question.find({
      $or: [
        { question: { $regex: query, $options: "i" } },
        { answer: { $regex: query, $options: "i" } },
        { tags: { $in: [regex] } },
        { category: { $regex: query, $options: "i" } }
      ]
    })
      .select("question category slug difficulty")
      .limit(6)
      .lean();

    // 3. Search Blogs
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { summary: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    })
      .select("title slug summary category")
      .limit(6)
      .lean();

    return NextResponse.json({
      categories: filteredCategories,
      questions: questions.map((q: any) => ({
        ...q,
        // Make category safe for slugs
        categorySlug: q.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      })),
      blogs
    });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
