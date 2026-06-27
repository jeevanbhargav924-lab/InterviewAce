import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import BlogClient from "@/components/blog/BlogClient";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";

export const metadata: Metadata = {
  title: "Developer Knowledge Base & Interview Guides | InterviewAce AI",
  description: "Read advanced articles on System Design scaling, React 19 compiler hooks, TypeScript validations, and HR STAR behavioral templates.",
  alternates: {
    canonical: "https://www.interviewaceai.online/blog"
  }
};

// Set ISR static cache revalidation to 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function BlogFeedPage() {
  let initialBlogs: any[] = [];

  try {
    await dbConnect();
    const rawBlogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    
    initialBlogs = rawBlogs.map((b: any) => ({
      _id: b._id.toString(),
      title: b.title,
      slug: b.slug,
      summary: b.summary,
      coverImage: b.coverImage,
      category: b.category,
      tags: b.tags || [],
      author: b.author ? {
        name: b.author.name || "Anonymous",
        image: b.author.image || ""
      } : { name: "Anonymous", image: "" },
      views: b.views || 0,
      createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error("Database connection failed in Blog Feed Server fetch. Falling back to empty arrays.", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <BlogClient initialBlogs={initialBlogs} />
      </main>

      <Footer />
    </div>
  );
}
