"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { Compass, ShieldCheck, Mail, Globe, Cpu } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-4xl w-full px-4 py-16 sm:px-6 lg:px-8 relative z-10 text-left">
        {/* Glow overlay */}
        <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-brand-purple/10 to-transparent pointer-events-none" />

        <div className="space-y-12">
          {/* Header */}
          <div className="border-b border-slate-800 pb-8">
            <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
              <Compass className="h-8 w-8 text-brand-cyan" />
              <span>About InterviewsAce.AI</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Our mission is to help software engineers scale their careers and master technical interviews using interactive sandboxes, instant ATS analyzers, and dynamic AI-powered simulators.
            </p>
          </div>

          {/* Platform Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-glass border border-slate-800/80 rounded-xl p-6 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                <Cpu className="h-4.5 w-4.5 text-brand-purple" />
                <span>Our Goal</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed font-normal">
                InterviewsAce.AI was created to bridge the gap between traditional learning and actual interview environments. We provide candidates with real-time feedback loops to verify their communications, algorithms performance, and ATS compliance.
              </p>
            </div>
            <div className="bg-glass border border-slate-800/80 rounded-xl p-6 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                <ShieldCheck className="h-4.5 w-4.5 text-brand-cyan" />
                <span>Technical Authority</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed font-normal">
                By indexing structured interview sheets curated by senior engineers and technical recruiters, we ensure our content stays fresh, factual, and aligned with modern engineering requirements in 2026.
              </p>
            </div>
          </div>

          {/* Author/Creator Profile */}
          <div className="bg-glass border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-brand-purple/20 via-brand-cyan/20 to-brand-purple/20" />
            
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan p-0.5 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
              <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center font-black text-white text-xl uppercase">
                JB
              </div>
            </div>

            <div className="space-y-3 text-center md:text-left flex-1">
              <div>
                <h3 className="text-base font-bold text-white">Jeevan Bhargav</h3>
                <p className="text-xs text-brand-cyan font-medium mt-0.5">Creator of InterviewsAce.AI</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">React Native Developer • Frontend Engineer</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-normal">
                Jeevan is a passionate Frontend Engineer specializing in highly responsive UI systems, cross-platform mobile app development with React Native, and AI API integrations. He built InterviewsAce.AI to give back to the engineering community, sharing study blueprints and sandbox compilers that he wished he had early in his career.
              </p>
              
              <div className="flex justify-center md:justify-start gap-4 pt-2">
                <a
                  href="mailto:jeeevanbhargav286@gmail.com"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4 fill-current text-slate-400 hover:text-white transition-colors" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
