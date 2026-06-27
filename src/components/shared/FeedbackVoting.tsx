"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";

interface FeedbackVotingProps {
  slug: string;
  className?: string;
}

export default function FeedbackVoting({ slug, className = "" }: FeedbackVotingProps) {
  const [voted, setVoted] = useState<"helpful" | "unhelpful" | null>(null);
  const storageKey = `feedback_vote_${slug}`;

  useEffect(() => {
    // Read local storage to set initial vote status
    const existingVote = localStorage.getItem(storageKey);
    if (existingVote === "helpful" || existingVote === "unhelpful") {
      setVoted(existingVote);
    }
  }, [storageKey]);

  const handleVote = (choice: "helpful" | "unhelpful") => {
    if (voted) return; // Prevent revoting

    localStorage.setItem(storageKey, choice);
    setVoted(choice);

    // Call Google Analytics event tracker
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", `feedback_${choice}`, {
        event_category: "Engagement",
        event_label: slug,
      });
    }
  };

  return (
    <div className={`p-5 rounded-xl bg-slate-950/40 border border-slate-800/80 backdrop-blur-md text-left relative overflow-hidden transition-all duration-300 ${className}`}>
      {/* Decorative colored glow stripe */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent" />
      
      {voted ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white leading-none">Thank You!</p>
              <p className="text-[8px] text-slate-500 mt-1 leading-normal font-normal">
                Your response has been registered. This helps Jeevan audit card accuracies.
              </p>
            </div>
          </div>
          <div className="text-[9px] font-semibold text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/5 rounded px-2.5 py-1">
            {voted === "helpful" ? "Thumbs Up Registered" : "Improvement Feedback Noted"}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Was this card helpful?</h4>
            <p className="text-[8px] text-slate-500 font-normal">Help us rank high-quality interview preparation materials.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote("helpful")}
              className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 text-[10px] font-semibold transition-all duration-200 cursor-pointer"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes, helped me</span>
            </button>
            
            <button
              onClick={() => handleVote("unhelpful")}
              className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 text-[10px] font-semibold transition-all duration-200 cursor-pointer"
            >
              <ThumbsDown className="h-3 w-3" />
              <span>Needs editing</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
