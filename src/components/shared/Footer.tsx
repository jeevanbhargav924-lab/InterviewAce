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

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/prepare" className="hover:text-white transition-colors">
                  Interview Questions
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blogs & Articles
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Learning Paths
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/questions/react" className="hover:text-white transition-colors">
                  React Pack
                </Link>
              </li>
              <li>
                <Link href="/questions/react-native" className="hover:text-white transition-colors">
                  React Native Pack
                </Link>
              </li>
              <li>
                <Link href="/questions/nodejs" className="hover:text-white transition-colors">
                  Node.js Pack
                </Link>
              </li>
              <li>
                <Link href="/questions/javascript" className="hover:text-white transition-colors">
                  JavaScript Pack
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal bottom row */}
        <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
          <p>© {currentYear} InterviewAceAI.online. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:underline">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
