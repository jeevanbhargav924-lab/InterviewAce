import React from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { dbConnect } from "@/lib/db";
import Question from "@/models/Question";
import Blog from "@/models/Blog";
import { Metadata } from "next";
import { Compass, BookOpen, ChevronRight, HelpCircle, FileText } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_MAP: Record<string, {
  name: string;
  intro: string;
  faqs: Array<{ question: string; answer: string }>;
}> = {
  react: {
    name: "React",
    intro: "Master functional components, hooks lifecycle, reconciliation, virtual DOM internals, and state synchronization.",
    faqs: [
      { question: "What is the primary role of React?", answer: "React is a component-based frontend library for building highly interactive user interfaces." },
      { question: "Is React 19 backward compatible?", answer: "Yes, React 19 keeps backward compatibility for class components while introducing automated compilers." }
    ]
  },
  "react-native": {
    name: "React Native",
    intro: "Learn mobile bridge systems, JavaScript Interface (JSI), performance profiling, thread execution, and Fabric layout engine.",
    faqs: [
      { question: "How does React Native communicate with native modules?", answer: "It communicates synchronously using JSI (JavaScript Interface) under the new architecture." }
    ]
  },
  javascript: {
    name: "JavaScript",
    intro: "Deep dive into prototype chains, closures, scopes, asynchronous event cycles, execution contexts, and core engine performance.",
    faqs: [
      { question: "Is JavaScript multithreaded?", answer: "No, JavaScript is a single-threaded language, but browser web APIs run asynchronous operations in helper threads." }
    ]
  },
  typescript: {
    name: "TypeScript",
    intro: "Learn generic bounds, declaration merging, type validation, intersections, mapped types, and strict configurations.",
    faqs: [
      { question: "What are the key benefits of TypeScript?", answer: "TypeScript provides static type analysis, compile-time error checks, and self-documenting code structures." }
    ]
  },
  nextjs: {
    name: "Next.js",
    intro: "Master Next.js App Router, server components (RSC), SSR routes caching, static routing generation, and SEO performance.",
    faqs: [
      { question: "What is the difference between Server and Client Components?", answer: "Server Components are pre-rendered on the server and send no JS to client, while Client Components render on client." }
    ]
  },
  nodejs: {
    name: "Node.js",
    intro: "Learn single-threaded event loop phases, pending I/O callbacks, setImmediate execution, Express middlewares, and clustering.",
    faqs: [
      { question: "What is the Event Loop in Node.js?", answer: "The Event Loop allows Node.js to run non-blocking, asynchronous I/O tasks on a single thread." }
    ]
  },
  "hr-interview": {
    name: "HR Interview",
    intro: "Prepare structured soft skill replies using the STAR framework, salary negotiations, leadership skills, and collaboration query grids.",
    faqs: [
      { question: "How should I structure behavioral replies?", answer: "Always use the STAR format: specify Situation, Task, Action, and Result." }
    ]
  }
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const catKey = resolvedParams.category.toLowerCase();
  const info = CATEGORY_MAP[catKey] || { name: resolvedParams.category, intro: "" };
  
  return {
    title: `${info.name} Interview Questions & Preparation Guides | InterviewsAceAI`,
    description: info.intro || `Master technical ${info.name} interview questions, study guides, and mock preparation materials.`,
    alternates: {
      canonical: `https://interviewsaceai.online/questions/${resolvedParams.category.toLowerCase()}`
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const catKey = resolvedParams.category.toLowerCase();
  const info = CATEGORY_MAP[catKey] || {
    name: resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1),
    intro: "Practice technical and HR queries mapped directly to modern engineering rounds.",
    faqs: []
  };

  let questions: any[] = [];
  let blogs: any[] = [];

  try {
    await dbConnect();

    // Query category questions
    const mappedCategory = catKey === "react-native" ? "React Native" :
                           catKey === "hr-interview" ? "HR Interview" :
                           catKey === "nextjs" ? "Next.js" :
                           catKey === "nodejs" ? "Node.js" :
                           info.name;

    questions = await Question.find({
      category: { $regex: new RegExp(`^${mappedCategory}$`, "i") }
    }).select("question slug difficulty tags").lean();

    // Query category blogs
    blogs = await Blog.find({
      category: { $regex: new RegExp(`^${mappedCategory}$`, "i") }
    }).select("title slug summary category coverImage").limit(4).lean();
  } catch (error) {
    console.error("Database connection failed in category list page server fetch. Falling back to empty arrays.", error);
  }

  // JSON-LD CollectionPage schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${info.name} Interview Questions & Preparation Guides`,
    "description": info.intro,
    "url": `https://interviewsaceai.online/questions/${catKey}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": questions.length,
      "itemListElement": questions.map((q: any, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://interviewsaceai.online/questions/${catKey}/${q.slug}`
      }))
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

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10 text-left">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-[11px] text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-300 font-semibold">{info.name} Questions</span>
        </nav>

        {/* Header Intro Banner */}
        <div className="border-b border-slate-800 pb-6 mb-8 relative">
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <Compass className="h-7 w-7 text-brand-cyan" />
            <span>{info.name} Preparation Pack</span>
          </h1>
          <p className="text-slate-400 text-xs mt-2 max-w-3xl leading-relaxed font-normal">
            {info.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Main questions grid */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <FileText className="h-4.5 w-4.5 text-brand-purple" />
              <span>Question Cards ({questions.length})</span>
            </h2>

            {questions.length === 0 ? (
              <div className="bg-glass rounded-xl p-10 text-center border border-slate-800 text-slate-500 text-xs">
                No question sheets seeded for {info.name} yet. Check back soon.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions.map((q: any, idx) => (
                  <Link
                    key={q._id}
                    href={`/questions/${catKey}/${(q.slug && q.slug !== "undefined") ? q.slug : q._id}`}
                    className="bg-glass border border-slate-800/80 hover:border-slate-700 p-5 rounded-xl flex flex-col justify-between hover:bg-slate-900/10 transition-all duration-200 text-left group"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[10px] text-slate-500 font-mono font-medium">Card #{idx + 1}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase border ${
                          q.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          q.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-200 leading-snug group-hover:text-white transition-colors">{q.question}</h3>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800/40">
                      <div className="flex gap-1.5 overflow-hidden">
                        {q.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-[8px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-brand-cyan hover:underline font-bold inline-flex items-center space-x-0.5">
                        <span>Read card</span>
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Category FAQs */}
            {info.faqs.length > 0 && (
              <div className="border-t border-slate-800/80 pt-10 mt-12 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center space-x-2">
                  <HelpCircle className="h-4.5 w-4.5 text-brand-cyan" />
                  <span>Frequently Asked Questions</span>
                </h2>
                <div className="space-y-4">
                  {info.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-glass border border-slate-800 rounded-xl p-4.5">
                      <h3 className="text-xs font-bold text-white">{faq.question}</h3>
                      <p className="text-[11px] text-slate-400 mt-2 font-normal leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Blogs */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <BookOpen className="h-4.5 w-4.5 text-brand-cyan" />
              <span>Related Blogs</span>
            </h2>

            {blogs.length === 0 ? (
              <div className="bg-glass rounded-xl p-5 text-center border border-slate-800 text-slate-500 text-xs italic">
                No articles published in this category yet.
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog: any) => (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className="block bg-glass border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden hover:bg-slate-900/10 transition-all duration-200"
                  >
                    <div className="h-28 w-full bg-slate-900 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h3 className="text-xs font-bold text-slate-200 hover:text-brand-cyan transition-colors leading-snug line-clamp-2">{blog.title}</h3>
                      <p className="text-[9px] text-slate-500 line-clamp-2 leading-normal">{blog.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
