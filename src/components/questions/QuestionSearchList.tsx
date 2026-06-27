"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronRight, HelpCircle, Filter } from "lucide-react";

interface QuestionItem {
  _id: string;
  question: string;
  slug?: string;
  difficulty: "easy" | "medium" | "hard" | string;
  tags: string[];
}

interface QuestionSearchListProps {
  initialQuestions: QuestionItem[];
  catKey: string;
}

export default function QuestionSearchList({ initialQuestions, catKey }: QuestionSearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const difficulties = ["all", "easy", "medium", "hard"];

  const filteredQuestions = useMemo(() => {
    return initialQuestions.filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesDifficulty;
    });
  }, [initialQuestions, searchQuery, selectedDifficulty]);

  return (
    <div className="space-y-6 text-left">
      {/* Search and filter toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-4.5 rounded-xl bg-slate-950/40 border border-slate-800/80 backdrop-blur-md">
        {/* Search input field */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full rounded-lg bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/30"
          />
        </div>

        {/* Difficulty filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline mr-1 flex items-center space-x-1">
            <Filter className="h-3 w-3" />
            <span>Difficulty:</span>
          </span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? diff === "easy" ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black" :
                    diff === "medium" ? "bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black" :
                    diff === "hard" ? "bg-rose-500/20 border border-rose-500/40 text-rose-400 font-black" :
                    "bg-brand-purple/20 border border-brand-purple/40 text-brand-purple font-black"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Result statistics */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
        <span>Showing {filteredQuestions.length} of {initialQuestions.length} drills</span>
        {(searchQuery || selectedDifficulty !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty("all");
            }}
            className="text-brand-cyan hover:underline cursor-pointer font-bold"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid items */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-glass rounded-xl p-12 text-center border border-slate-800">
          <HelpCircle className="h-8 w-8 text-slate-700 mx-auto mb-3 animate-bounce" />
          <h4 className="text-xs font-bold text-slate-400">No matching questions found</h4>
          <p className="text-slate-500 text-[10px] mt-1">Try adjusting your filters or typing a different keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuestions.map((q, idx) => {
            const cardSlug = q.slug && q.slug !== "undefined" ? q.slug : q._id;
            return (
              <Link
                key={q._id}
                href={`/questions/${catKey}/${cardSlug}`}
                className="bg-glass border border-slate-800/80 hover:border-slate-700/80 p-5 rounded-xl flex flex-col justify-between hover:bg-slate-900/10 transition-all duration-300 text-left group relative overflow-hidden"
              >
                {/* Glow border hover line */}
                <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-purple/0 via-brand-cyan/0 to-brand-purple/0 group-hover:from-brand-purple group-hover:via-brand-cyan group-hover:to-brand-purple transition-all duration-300" />
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] text-slate-500 font-mono font-medium">Card #{idx + 1}</span>
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

                <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-800/40">
                  <div className="flex gap-1.5 overflow-hidden">
                    {q.tags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[8px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-cyan hover:underline font-bold inline-flex items-center space-x-0.5">
                    <span>Read card</span>
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
