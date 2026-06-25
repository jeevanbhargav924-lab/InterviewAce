"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Award, Briefcase, ChevronRight } from "lucide-react";
import AdPlaceholder from "../shared/AdPlaceholder";

interface Challenge {
  id: string;
  title: string;
  category: "DSA" | "Frontend" | "React" | "JavaScript";
  difficulty: "easy" | "medium" | "hard";
  description: string;
  companies: string[];
}

interface CodingClientProps {
  initialChallenges: Challenge[];
}

export default function CodingClient({ initialChallenges }: CodingClientProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filtered = selectedFilter === "all" 
    ? initialChallenges 
    : initialChallenges.filter(c => c.category === selectedFilter);

  return (
    <>
      {/* Banner Title */}
      <div className="border-b border-slate-800 pb-5 mb-8 text-left">
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <Terminal className="h-6 w-6 text-brand-cyan" />
          <span>Algorithmic Coding Challenges</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">Develop technical accuracy and run automated test suites directly in your browser.</p>
      </div>

      {/* Filters and Category selection */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-center space-x-2">
          {["all", "DSA", "JavaScript", "React"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedFilter === filter
                  ? "bg-brand-cyan text-white shadow-lg"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {filter === "all" ? "All categories" : filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Challenges listing */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>{selectedFilter === "all" ? "All Problems" : `${selectedFilter} Problems`}</span>
          </h2>
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-glass rounded-xl p-5 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2.5 mb-2">
                  <h3 className="text-xs font-bold text-white hover:text-brand-cyan transition-colors">
                    {c.title}
                  </h3>
                  <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                    c.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    c.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {c.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">{c.category}</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl mb-3">{c.description}</p>
                
                {/* Company Badges */}
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <Briefcase className="h-3 w-3 text-slate-600 shrink-0" />
                  {c.companies.map(comp => (
                    <span key={comp} className="text-[9px] text-slate-500 font-medium bg-slate-950 px-2 py-0.5 rounded">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/coding/${c.id}`}
                className="rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 text-xs font-semibold flex items-center justify-center space-x-1 hover:border-brand-cyan transition-all shrink-0"
              >
                <span>Solve Problem</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          
          {/* User progress widget mockup */}
          <div className="bg-glass rounded-xl p-5 border border-slate-800 text-center">
            <Award className="h-8 w-8 text-brand-purple mx-auto mb-2" />
            <h2 className="text-xs font-bold text-white font-sans">Your Coding Progress</h2>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Sign in to track completed questions and compare runtime execution speeds against other candidates.</p>
            
            <div className="mt-4 flex items-center justify-between text-xs text-slate-300 px-4 py-2 bg-slate-950/40 rounded-lg">
              <span>Completed Tasks</span>
              <span className="font-bold text-brand-cyan">0 / {initialChallenges.length}</span>
            </div>
          </div>

          <AdPlaceholder position="sidebar" />

        </div>

      </div>
    </>
  );
}
