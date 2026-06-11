import { MetadataRoute } from "next";
import { dbConnect } from "@/lib/db";
import Question from "@/models/Question";
import Blog from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://interviewsaceai.online";

  // Static site paths
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/prepare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/resume-analyzer`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/mock-interview`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/coding`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  // Category paths
  const categories = ["react", "javascript", "typescript", "react-native", "nextjs", "nodejs", "hr-interview"];
  const categoryPaths: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/questions/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  let questionPaths: MetadataRoute.Sitemap = [];
  let blogPaths: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();

    // Query active questions
    const questions = await Question.find({}).select("category slug updatedAt").lean();
    questionPaths = questions.map((q: any) => {
      const formattedCategory = q.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        url: `${baseUrl}/questions/${formattedCategory}/${q.slug}`,
        lastModified: new Date(q.updatedAt || Date.now()),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

    // Query active blogs
    const blogs = await Blog.find({}).select("slug updatedAt").lean();
    blogPaths = blogs.map((b: any) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(b.updatedAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to read database entries for dynamic sitemap gen:", error);
  }

  return [...staticPaths, ...categoryPaths, ...questionPaths, ...blogPaths];
}
