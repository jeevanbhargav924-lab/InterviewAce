"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import { Terminal, Award, Briefcase, ChevronRight, Check } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  category: "DSA" | "Frontend" | "React" | "JavaScript";
  difficulty: "easy" | "medium" | "hard";
  description: string;
  companies: string[];
}

const STATIC_CHALLENGES: Challenge[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    category: "DSA",
    difficulty: "easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    companies: ["Google", "Amazon", "Microsoft"]
  },
  {
    id: "reverse-linked-list",
    title: "Reverse a Linked List",
    category: "DSA",
    difficulty: "medium",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list node.",
    companies: ["Facebook", "Stripe", "Netflix"]
  },
  {
    id: "js-debounce",
    title: "Implement Debounce Function",
    category: "JavaScript",
    difficulty: "medium",
    description: "Create a debounced function that delays invoking the runner until after wait milliseconds have elapsed.",
    companies: ["Uber", "Lyft", "Airbnb"]
  },
  {
    id: "react-counter",
    title: "Build a React Counter Hook",
    category: "React",
    difficulty: "easy",
    description: "Develop a custom hook useCounter that supports increments, decrements, and optional reset bounds.",
    companies: ["Stripe", "Meta", "Coinbase"]
  }
];

export default function CodingChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    async function loadChallenges() {
      setLoading(true);
      try {
        const res = await fetch("/api/challenges");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((c: any) => ({
              id: c.slug || c._id,
              title: c.title,
              category: c.category,
              difficulty: c.difficulty,
              description: c.description.length > 150 ? c.description.substring(0, 150) + "..." : c.description,
              companies: c.companyTags || []
            }));
            setChallenges(mapped);
          } else {
            setChallenges(STATIC_CHALLENGES);
          }
        } else {
          setChallenges(STATIC_CHALLENGES);
        }
      } catch (err) {
        console.error("Failed to load challenges from API. Falling back to static data.", err);
        setChallenges(STATIC_CHALLENGES);
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);
  
  const filtered = selectedFilter === "all" 
    ? challenges 
    : challenges.filter(c => c.category === selectedFilter);

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Title */}
        <div className="border-b border-slate-800 pb-5 mb-8">
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
          <div className="lg:col-span-2 space-y-4">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="bg-glass rounded-xl p-5 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2.5 mb-2">
                    <span className="text-xs font-bold text-white hover:text-brand-cyan transition-colors">
                      {c.title}
                    </span>
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
                  className="rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 text-xs font-semibold flex items-center justify-center space-x-1 hover:border-brand-cyan transition-all"
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
              <h3 className="text-xs font-bold text-white">Your Coding Progress</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Sign in to track completed questions and compare runtime execution speeds against other candidates.</p>
              
              <div className="mt-4 flex items-center justify-between text-xs text-slate-300 px-4 py-2 bg-slate-950/40 rounded-lg">
                <span>Completed Tasks</span>
                <span className="font-bold text-brand-cyan">0 / 4</span>
              </div>
            </div>

            <AdPlaceholder position="sidebar" />

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
