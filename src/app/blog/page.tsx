"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import { BookOpen, Search, ArrowRight, User } from "lucide-react";

interface BlogArticle {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    image: string;
  };
  views: number;
  createdAt: string;
}

export default function BlogFeedPage() {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "all", "React", "React Native", "JavaScript", "TypeScript", "Next.js", "Node.js", "Node.js / Backend", "MongoDB", "Career Growth", "Interview Preparation", "Interview Tips", "Resume Tips", "System Design", "AI Tools"
  ];

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        let url = `/api/blogs?`;
        if (selectedCategory !== "all") {
          url += `category=${encodeURIComponent(selectedCategory)}&`;
        }
        if (searchQuery.trim()) {
          url += `search=${encodeURIComponent(searchQuery)}&`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setBlogs(data);
          } else {
            setBlogs([]);
          }
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-805 mb-8">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-brand-purple" />
              <span>Developer Knowledge Base</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Sleek, MDX-powered blueprints covering system architecture, TS typing, and HR loops.</p>
          </div>

          {/* Search box */}
          <div className="mt-4 md:mt-0 relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-lg bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white focus:border-brand-purple focus:outline-none"
            />
          </div>
        </div>

        {/* Categories ribbon */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-slate-800/40 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-brand-purple text-white shadow-lg"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="py-20 text-center text-slate-500 animate-pulse text-xs">
                Scanning publication databases...
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-glass rounded-xl p-12 text-center border border-slate-800">
                <BookOpen className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-xs">No blog articles match this category or search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="bg-glass rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:bg-slate-900/10 transition-all flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="h-40 w-full relative bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                          {blog.category}
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center space-x-1.5 text-[9px] text-slate-500 mb-2">
                          <User className="h-3 w-3" />
                          <span>By {blog.author.name}</span>
                          <span>•</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-2 leading-snug hover:text-brand-cyan transition-colors">
                          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h3>
                        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 font-normal">{blog.summary}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-xs text-brand-purple hover:text-brand-cyan font-bold inline-flex items-center space-x-1"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            
            {/* Promotion box */}
            <div className="bg-glass rounded-xl p-5 border border-slate-800 text-center">
              <CrownIcon />
              <h3 className="text-xs font-bold text-white mt-2">Become a Sponsored Creator</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Publish system design case-studies and React components guides to our network of 10k monthly visitors.</p>
            </div>

            <AdPlaceholder position="sidebar" />

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

function CrownIcon() {
  return (
    <svg className="h-7 w-7 text-brand-cyan mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
