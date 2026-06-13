import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { dbConnect } from "@/lib/db";
import Question from "@/models/Question";
import { Metadata } from "next";
import { ChevronRight, Bookmark, ArrowLeft, Star, Compass, Terminal, HelpCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface QuestionPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;

  try {
    await dbConnect();
    let qDoc = null;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      qDoc = await Question.findById(slug).select("question category").lean();
    } else {
      qDoc = await Question.findOne({ slug }).select("question category").lean();
    }

    if (!qDoc) {
      return { title: "Question Not Found | InterviewAceAI" };
    }
    return {
      title: `${qDoc.question} - ${qDoc.category} Interview Answer | InterviewAceAI`,
      description: `Detailed technical response, code examples, and explanation sheet for: ${qDoc.question}`,
      alternates: {
        canonical: `https://interviewaceai.online/questions/${category}/${slug}`
      }
    };
  } catch (e) {
    return { title: "Technical Interview Question | InterviewAceAI" };
  }
}

export default async function QuestionDetailPage({ params }: QuestionPageProps) {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;

  let qDoc: any = null;
  let relatedQuestions: any[] = [];

  try {
    await dbConnect();

    // Fetch target question and increment views
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      qDoc = await Question.findByIdAndUpdate(
        slug,
        { $inc: { views: 1 } },
        { new: true }
      ).lean();
    } else {
      qDoc = await Question.findOneAndUpdate(
        { slug },
        { $inc: { views: 1 } },
        { new: true }
      ).lean();
    }

    if (qDoc) {
      // Fetch related questions in same category
      relatedQuestions = await Question.find({
        category: qDoc.category,
        _id: { $ne: qDoc._id }
      })
        .select("question slug category")
        .limit(3)
        .lean();
    }
  } catch (error) {
    console.error("Database connection failed in question detail page server fetch.", error);
  }

  if (!qDoc) {
    notFound();
  }

  // capitalize category label
  const catLabel = qDoc.category;

  // JSON-LD BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://interviewaceai.online"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${catLabel} Questions`,
        "item": `https://interviewaceai.online/questions/${category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": qDoc.question,
        "item": `https://interviewaceai.online/questions/${category}/${slug}`
      }
    ]
  };

  // JSON-LD FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": qDoc.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qDoc.answer
        }
      },
      ...(qDoc.faqs || []).map((f: any) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      {/* Schema Markups */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 relative z-10 text-left">
        {/* Back and Breadcrumbs row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link
            href={`/questions/${category}`}
            className="text-xs text-slate-500 hover:text-white flex items-center space-x-1.5 transition-colors font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {catLabel} pack</span>
          </Link>

          <nav className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/questions/${category}`} className="hover:text-white transition-colors">{catLabel}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-350 truncate max-w-[150px] font-semibold">Detail</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Question Sheet */}
          <div className="lg:col-span-2 space-y-6">
            <article className="bg-glass border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
              <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-brand-purple/20 via-brand-cyan/20 to-brand-purple/20" />

              {/* Tag header */}
              <div className="flex justify-between items-center mb-4">
                <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase tracking-wider text-brand-purple">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>{catLabel} card review</span>
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase border ${
                  qDoc.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  qDoc.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}>
                  {qDoc.difficulty}
                </span>
              </div>

              {/* Question */}
              <h1 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
                {qDoc.question}
              </h1>

              {/* Answer content */}
              <div className="prose prose-invert prose-xs text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-wrap border-t border-slate-800/50 pt-5 mt-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {qDoc.answer}
                </ReactMarkdown>
              </div>

              {/* Code Example block */}
              {qDoc.example && (
                <div className="mt-8 space-y-2.5">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-brand-cyan" />
                    <span>Reference Example</span>
                  </h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 font-mono text-[10.5px] leading-relaxed text-slate-300 overflow-x-auto whitespace-pre">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {qDoc.example}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </article>

            {/* Questions FAQs */}
            {qDoc.faqs && qDoc.faqs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4.5 text-brand-cyan" />
                  <span>Card FAQs</span>
                </h3>
                <div className="space-y-3">
                  {qDoc.faqs.map((f: any, idx: number) => (
                    <div key={idx} className="bg-glass border border-slate-800 p-4.5 rounded-xl text-left">
                      <h4 className="text-xs font-bold text-white">{f.question}</h4>
                      <p className="text-[11px] text-slate-400 mt-2 font-normal leading-relaxed">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar related questions */}
          <div className="space-y-6">
            <div className="bg-glass border border-slate-800 rounded-xl p-5 relative overflow-hidden backdrop-blur-md">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-4 pb-2 border-b border-slate-800/50">
                <Compass className="h-4 w-4 text-brand-purple" />
                <span>Related Drills</span>
              </h3>

              {relatedQuestions.length === 0 ? (
                <p className="text-slate-600 text-xs italic">No related cards seeded yet.</p>
              ) : (
                <div className="space-y-4">
                  {relatedQuestions.map((req: any) => (
                    <Link
                      key={req._id}
                      href={`/questions/${category}/${req.slug}`}
                      className="block p-3 rounded-lg bg-slate-950/40 border border-slate-850 hover:border-brand-cyan/40 transition-colors text-left group"
                    >
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors leading-snug">{req.question}</h4>
                      <span className="text-[9px] text-brand-cyan hover:underline font-bold mt-2.5 inline-flex items-center space-x-0.5">
                        <span>Study card</span>
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick trust signal */}
            <div className="bg-glass border border-slate-800 rounded-xl p-5 text-left text-[11px] text-slate-400 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-brand-cyan/20 flex items-center justify-center font-bold text-brand-cyan text-[10px]">
                  JB
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Jeevan Bhargav</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Audited by Creator</p>
                </div>
              </div>
              <p className="leading-relaxed font-normal text-slate-500">
                This answer is calibrated for technical interviews. Verify benchmarks in local sandboxes before deploying.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
