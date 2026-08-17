import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import LandingClient from "@/components/landing/LandingClient";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";
import Question from "@/models/Question";

export const metadata: Metadata = {
  title: "InterviewAce AI | AI Interview Prep & ATS Resume Review",
  description: "Prepare for your dream tech job with real-time AI mock interviews, instant ATS resume scoring, and interactive coding challenges.",
};

// Set ISR static cache revalidation to 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function Home() {
  let blogs: any[] = [];
  let totalQuestions = 22;
  let totalBlogs = 17;
  const categoryCounts: Record<string, number> = {
    "react": 4,
    "javascript": 4,
    "typescript": 3,
    "react-native": 2,
    "nextjs": 3,
    "nodejs": 3,
    "hr-interview": 3
  };

  try {
    await dbConnect();
    
    // Fetch total database counts
    totalBlogs = await Blog.countDocuments();
    totalQuestions = await Question.countDocuments();

    // Fetch specific category counts
    const categoriesList = ["React", "JavaScript", "TypeScript", "React Native", "Next.js", "Node.js", "HR Interview"];
    for (const cat of categoriesList) {
      const dbCategory = cat === "React Native" ? "React Native" :
                         cat === "Next.js" ? "Next.js" :
                         cat === "Node.js" ? "Node.js" :
                         cat === "HR Interview" ? "HR Interview" :
                         cat;
      categoryCounts[cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")] = await Question.countDocuments({
        category: { $regex: new RegExp(`^${dbCategory}$`, "i") }
      });
    }

    const rawBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title slug summary category coverImage")
      .lean();

    blogs = rawBlogs.map((b: any) => ({
      title: b.title,
      slug: b.slug,
      summary: b.summary,
      category: b.category,
      coverImage: b.coverImage,
    }));
  } catch (error) {
    console.error("Database connection failed in Landing page server fetch. Falling back to static values.", error);
  }
  // Fallback blogs if database is not seeded/reachable
  const displayBlogs = blogs.length > 0 ? blogs : [
    {
      title: "Mastering React 19: New Hooks and Compiler Features",
      slug: "mastering-react-19-hooks-compiler",
      summary: "Dive deep into React 19's brand new compiler (React Forget) and modern hooks like useActionState and useOptimistic.",
      category: "React",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
    },
    {
      title: "Demystifying System Design: How to Scale to 1M Users",
      slug: "demystifying-system-design-scale-1m",
      summary: "A practical step-by-step architectural breakdown showing how to scale a web app from local host to 1 million active users.",
      category: "System Design",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    },
    {
      title: "10 Resume Rules to Bypass Modern ATS Filters",
      slug: "10-resume-rules-bypass-ats-filters",
      summary: "Struggling to get interviews? Follow these 10 actionable resume formatting rules to guarantee you score high on ATS screenings.",
      category: "Resume Tips",
      coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-[#030014]">
      {/* Absolute cursor overlay */}
      <CustomCursor />

      {/* Top Banner Navbar */}
      <Navbar />

      {/* Primary landing component */}
      <main className="flex-grow">
        <LandingClient 
          initialBlogs={displayBlogs} 
          totalQuestions={totalQuestions} 
          totalBlogs={totalBlogs} 
          categoryCounts={categoryCounts}
        />
      </main>

      {/* Bottom Footer block */}
      <Footer />
    </div>
  );
}
