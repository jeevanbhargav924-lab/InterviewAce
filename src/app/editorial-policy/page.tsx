import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { BookOpen, ShieldCheck, UserCheck, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy & Content Integrity Standards | InterviewAce AI",
  description: "Review our content editorial policy, peer review pipelines, code execution verification protocols, and content accuracy guarantees.",
  alternates: {
    canonical: "https://www.interviewaceai.online/editorial-policy"
  }
};

export default function EditorialPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-16 text-slate-350 relative z-10 leading-relaxed text-left">
        {/* Glow overlay */}
        <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-brand-purple/10 to-transparent pointer-events-none" />

        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-brand-cyan" />
          <span>Editorial Policy</span>
        </h1>
        <p className="text-xs text-slate-500 mb-8 font-mono">Last Updated: June 11, 2026</p>

        <section className="space-y-8 text-sm">
          <div className="space-y-3">
            <p>
              At <strong>InterviewAce.AI</strong>, our mission is to provide the software engineering community with highly accurate, up-to-date, and technically rigorous interview preparation resources. To ensure that our code sandboxes, mock tests, and article sheets meet the highest standards, we adhere to a strict editorial policy.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-brand-purple" />
              <span>1. Technical Rigor & Code Validation</span>
            </h2>
            <p>
              Every code snippet, algorithm block, and architectural diagram published on our platform is vetted by experienced software engineers. We enforce a local compiling validation protocol: before any code card is uploaded into our databases, it is executed against sandboxed test suites to guarantee correctness, optimal time/space complexity, and compatibility with modern runtime versions (including Node.js 20+ and React 19 rules).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-brand-cyan" />
              <span>2. Peer-Review Pipeline</span>
            </h2>
            <p>
              Our guides are subject to peer reviews by engineering contributors and technical leads. Disagreements in best-practice design patterns or coding choices are resolved through benchmark comparisons and official documentation cross-referencing (e.g., matching TC39 specifications or React Core Team announcements). We strictly avoid superficial, unvetted AI-generated generic guides.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Flame className="h-5 w-5 text-brand-purple" />
              <span>3. Transparency & Continuous Updates</span>
            </h2>
            <p>
              Technology moves quickly. When standard specifications are updated (such as new ES releases or React lifecycle changes), we schedule revisions to keep our databases accurate. Each question, blog, and compiler sandbox display is explicitly marked with its "Last Updated" timestamp and revision author details to ensure complete transparency.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              If you discover an error, a spelling mistake, or have feedback about code benchmarks in any of our technical guides, please email us directly at: <a href="mailto:jeeevanbhargav286@gmail.com" className="text-brand-cyan hover:underline">jeeevanbhargav286@gmail.com</a>. We investigate all user reports within 7 business days.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
