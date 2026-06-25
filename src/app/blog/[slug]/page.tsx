import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug }).select("title summary").lean();
    if (!blog) {
      return { title: "Article Not Found | InterviewAce AI" };
    }

    return {
      title: `${blog.title} | Developer Insights & Guides`,
      description: blog.summary,
      alternates: {
        canonical: `https://www.interviewaceai.online/blog/${slug}`
      }
    };
  } catch (error) {
    return { title: "Technical Development Blog | InterviewAce AI" };
  }
}

// Force dynamic execution for fresh reads in SSR
export const revalidate = 0;

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let blogData: any = null;

  try {
    await dbConnect();
    // Fetch and increment views in a single operation
    const rawBlog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (rawBlog) {
      blogData = {
        _id: rawBlog._id.toString(),
        title: rawBlog.title,
        slug: rawBlog.slug,
        content: rawBlog.content,
        summary: rawBlog.summary,
        coverImage: rawBlog.coverImage,
        category: rawBlog.category,
        tags: rawBlog.tags || [],
        author: {
          name: rawBlog.author.name || "Anonymous",
          image: rawBlog.author.image || "",
          bio: rawBlog.author.bio || ""
        },
        views: rawBlog.views || 0,
        comments: (rawBlog.comments || []).map((c: any) => ({
          _id: c._id.toString(),
          userName: c.userName,
          userImage: c.userImage,
          content: c.content,
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString()
        })),
        createdAt: rawBlog.createdAt ? new Date(rawBlog.createdAt).toISOString() : new Date().toISOString()
      };
    }
  } catch (error) {
    console.error("Database connection failed in Blog Detail Server fetch.", error);
  }

  if (!blogData) {
    notFound();
  }

  // JSON-LD BlogPosting Schema for Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogData.title,
    "description": blogData.summary,
    "image": blogData.coverImage,
    "datePublished": blogData.createdAt,
    "dateModified": blogData.createdAt,
    "author": {
      "@type": "Person",
      "name": blogData.author.name,
      "image": blogData.author.image || undefined
    },
    "publisher": {
      "@type": "Organization",
      "name": "InterviewAce AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.interviewaceai.online/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.interviewaceai.online/blog/${blogData.slug}`
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 relative z-10">
        <BlogDetailClient initialBlog={blogData} />
      </main>

      <Footer />
    </div>
  );
}
