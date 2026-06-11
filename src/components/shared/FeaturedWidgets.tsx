"use client";

import React from "react";
import Link from "next/link";
import { Compass, BookOpen, Crown, FileText, ArrowRight, Star } from "lucide-react";

interface FeaturedWidgetsProps {
  position: "header" | "sidebar" | "in-article" | "footer";
  className?: string;
}

export default function FeaturedWidgets({ position, className = "" }: FeaturedWidgetsProps) {
  if (position === "header" || position === "footer") {
    // Featured Categories / Popular Tracks
    const categories = [
      { name: "React", href: "/questions/react" },
      { name: "Node.js", href: "/questions/nodejs" },
      { name: "TypeScript", href: "/questions/typescript" },
      { name: "JavaScript", href: "/questions/javascript" },
      { name: "Next.js", href: "/questions/nextjs" },
      { name: "React Native", href: "/questions/react-native" },
    ];

    return (
      <div className={`mx-auto w-full max-w-5xl bg-glass border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden my-4 backdrop-blur-md ${className}`}>
        {/* Glow overlay line */}
        <span className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />
        
        <div className="flex items-center space-x-3 text-left">
          <div className="h-8.5 w-8.5 rounded-lg bg-brand-cyan/15 flex items-center justify-center border border-brand-cyan/20 shrink-0">
            <Compass className="h-4.5 w-4.5 text-brand-cyan" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Explore Popular Learning Tracks</h4>
            <p className="text-[9px] text-slate-400 mt-0.5">Test your concepts against senior engineers' question cards.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="rounded bg-slate-900 border border-slate-800 hover:border-brand-purple/40 hover:bg-slate-800/30 px-3 py-1 text-[10px] font-semibold text-slate-300 hover:text-white transition-all duration-200"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (position === "sidebar") {
    // Trending Questions & Popular Blogs List
    return (
      <div className={`w-full max-w-sm bg-glass border border-slate-800/80 rounded-xl p-5 flex flex-col space-y-5 relative overflow-hidden backdrop-blur-md text-left ${className}`}>
        <span className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-brand-purple/20 to-transparent" />

        {/* Section 1: Trending Questions */}
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-3">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
            <span>Trending Questions</span>
          </h4>
          <ul className="space-y-3 text-[10px] text-slate-400">
            <li>
              <Link href="/questions/react/what-is-virtual-dom" className="hover:text-brand-cyan hover:underline leading-relaxed block transition-colors">
                • What is the Virtual DOM and how does React use it?
              </Link>
            </li>
            <li>
              <Link href="/questions/nodejs/what-is-event-loop" className="hover:text-brand-cyan hover:underline leading-relaxed block transition-colors">
                • Explain the Event Loop mechanism in Node.js.
              </Link>
            </li>
            <li>
              <Link href="/questions/react-native/what-is-flatlist" className="hover:text-brand-cyan hover:underline leading-relaxed block transition-colors">
                • How do we optimize FlatList performance?
              </Link>
            </li>
          </ul>
        </div>

        <hr className="border-slate-800/50" />

        {/* Section 2: Popular Articles */}
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-3">
            <BookOpen className="h-3.5 w-3.5 text-brand-purple" />
            <span>Top Collections</span>
          </h4>
          <ul className="space-y-3 text-[10px] text-slate-400">
            <li>
              <Link href="/blog/react-interview-questions-2026" className="hover:text-brand-cyan hover:underline leading-relaxed block transition-colors">
                • React Interview Questions & Answers (2026)
              </Link>
            </li>
            <li>
              <Link href="/blog/nodejs-event-loop-guide" className="hover:text-brand-cyan hover:underline leading-relaxed block transition-colors">
                • Node.js Event Loop Master Guide
              </Link>
            </li>
            <li>
              <Link href="/blog/react-native-roadmap-2026" className="hover:text-brand-cyan hover:underline leading-relaxed block transition-colors">
                • React Native Architect Roadmap (2026)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // in-article: Latest Resources / Collections
  return (
    <div className={`w-full max-w-3xl mx-auto bg-gradient-to-tr from-brand-purple/10 to-brand-cyan/10 border border-brand-purple/20 rounded-xl p-5 my-6 relative overflow-hidden backdrop-blur-md text-left ${className}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h4 className="text-[11px] font-bold text-white flex items-center space-x-2">
            <Crown className="h-4 w-4 text-brand-cyan" />
            <span>Featured Learning Resources</span>
          </h4>
          <p className="text-[10px] text-slate-400 max-w-lg leading-relaxed">
            Boost your interview confidence. Practice coding layouts, review real-time feedback, and optimize your resume structure.
          </p>
        </div>
        <Link
          href="/prepare"
          className="rounded bg-brand-cyan hover:brightness-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] px-4 py-2 text-[10px] font-bold text-white transition-all duration-200 flex items-center space-x-1"
        >
          <span>All Questions</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
