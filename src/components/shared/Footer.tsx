"use client";

import React from "react";
import Link from "next/link";
import { Compass, Cpu, Terminal, FileText, BookOpen, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const affiliateResources = [
    { name: "Ultimate JavaScript Course", url: "#", desc: "Save 20% on enrollment" },
    { name: "Cracking the Coding Interview", url: "#", desc: "Top Recommended Prep Book" },
    { name: "Frontend Masters Membership", url: "#", desc: "Advanced React & CSS lessons" },
    { name: "Sleek IDE Extensions Pack", url: "#", desc: "Boost your productivity" }
  ];

  return (
    <footer className="border-t border-slate-200/10 bg-slate-950 text-slate-400 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-extrabold text-sm shadow">
                A
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                InterviewAce<span className="text-brand-cyan">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Accelerate your engineering journey. Prepare with state-of-the-art AI mock interview loops, instant ATS scoring, and interactive coding sandboxes.
            </p>
            <div className="text-[10px] text-brand-purple/70 font-semibold uppercase tracking-wider">
              Affiliated Partner Ecosystem Enabled
            </div>
          </div>

          {/* Site Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Features
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/prepare" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Interview Prepare Questions</span>
                </Link>
              </li>
              <li>
                <Link href="/mock-interview" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>AI Mock Interviews</span>
                </Link>
              </li>
              <li>
                <Link href="/coding" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Coding Challenge Editor</span>
                </Link>
              </li>
              <li>
                <Link href="/resume-analyzer" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <FileText className="h-3.5 w-3.5" />
                  <span>ATS Resume Reviewer</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Affiliate links (Monetization Requirement) */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Developer Resources
            </h3>
            <ul className="space-y-2.5 text-xs">
              {affiliateResources.map((res, i) => (
                <li key={i}>
                  <a
                    href={res.url}
                    className="group flex items-center justify-between hover:text-white transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{res.name}</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-500">{res.desc}</span>
                    </div>
                    <ExternalLink className="h-3 w-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Weekly Prep Tips
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Subscribe to get curated DSA study guides and HR question breakdowns directly in your inbox.
            </p>
            <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="developer@domain.com"
                required
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="rounded bg-gradient-to-r from-brand-purple to-brand-cyan px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Legal bottom row */}
        <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
          <p>© {currentYear} InterviewAce AI Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Affiliate Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
