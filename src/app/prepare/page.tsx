"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import { FREE_BETA } from "@/lib/config";
import { Compass, BookOpen, AlertCircle, ChevronDown, CheckCircle, Lock, Crown } from "lucide-react";

interface QuestionItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

export default function PreparePage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("React");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});

  const categoriesList = [
    "React", "JavaScript", "TypeScript", "React Native", "Next.js", "Node.js", "MongoDB", "HR", "Behavioral"
  ];

  const hasPremiumRecord = (session?.user as any)?.subscription?.plan === "premium" && 
                          (session?.user as any)?.subscription?.status === "active";
  const isPremium = true;

  useEffect(() => {
    async function loadQuestions() {
      setLoading(true);
      try {
        let url = `/api/questions?category=${encodeURIComponent(selectedCategory)}`;
        if (selectedDifficulty !== "all") {
          url += `&difficulty=${selectedDifficulty}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setQuestions(data);
          } else {
            setQuestions([]);
          }
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [selectedCategory, selectedDifficulty]);

  const toggleAnswer = (id: string) => {
    setVisibleAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Return all questions directly
  const getDisplayQuestions = () => {
    return questions;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center space-x-2">
              <Compass className="h-6 w-6 text-brand-cyan" />
              <span>Interview Question Cards</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Review structured technical sheets and verbal behavioral formulas.</p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-2 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-slate-800/40 no-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-lg"
                  : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Questions main area */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="py-20 text-center text-slate-500 animate-pulse text-xs">
                Analyzing question data sheets...
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-glass rounded-xl p-12 text-center border border-slate-800">
                <AlertCircle className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-xs">No questions loaded for this filter combo. Try another.</p>
              </div>
            ) : (
              getDisplayQuestions().map((q: any, idx) => (
                <div
                  key={q._id}
                  className={`bg-glass rounded-xl p-5 border transition-all duration-300 ${
                    q.isLocked 
                      ? "border-slate-800/40 opacity-70" 
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 font-mono text-xs">#{idx + 1}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                        q.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        q.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex space-x-1">
                      {q.tags.map((tag: string) => (
                        <span key={tag} className="text-[9px] text-slate-500 bg-slate-900 border border-slate-800/60 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-relaxed mb-4">
                    {q.question}
                  </h3>

                  <div>
                    <button
                      onClick={() => toggleAnswer(q._id)}
                      className="flex items-center space-x-1 text-xs text-brand-cyan hover:text-brand-purple font-semibold focus:outline-none"
                    >
                      <span>{visibleAnswers[q._id] ? "Hide Answer" : "Show Best Answer"}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${visibleAnswers[q._id] ? "rotate-180" : ""}`} />
                    </button>

                    {visibleAnswers[q._id] && (
                      <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-normal animate-fadeIn">
                        {q.answer}
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Right sidebar details */}
          <div className="space-y-6">
            
            {/* Sidebar info */}

            {/* Sidebar ad banner */}
            <AdPlaceholder position="sidebar" />

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
