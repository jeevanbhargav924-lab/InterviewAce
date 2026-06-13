"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Sparkles, Compass, BookOpen, Clock, Loader2, ArrowRight } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    categories: Array<{ name: string; slug: string; desc: string }>;
    questions: Array<{ _id: string; question: string; categorySlug: string; slug: string; difficulty: string }>;
    blogs: Array<{ _id: string; title: string; slug: string; summary: string; category: string }>;
  }>({ categories: [], questions: [], blogs: [] });

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isOpen]);

  // Autofocus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle keybindings (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Fetch results on query update
  useEffect(() => {
    if (!query.trim()) {
      setResults({ categories: [], questions: [], blogs: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok && data) {
          setResults({
            categories: Array.isArray(data.categories) ? data.categories : [],
            questions: Array.isArray(data.questions) ? data.questions : [],
            blogs: Array.isArray(data.blogs) ? data.blogs : [],
          });
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const addRecentSearch = (term: string) => {
    const next = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 5);
    setRecentSearches(next);
    localStorage.setItem("recentSearches", JSON.stringify(next));
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const next = recentSearches.filter((t) => t !== term);
    setRecentSearches(next);
    localStorage.setItem("recentSearches", JSON.stringify(next));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleLinkClick = (href: string, termToSave?: string) => {
    if (termToSave) {
      addRecentSearch(termToSave);
    }
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#030014]/85 backdrop-blur-sm" onClick={onClose} />

      {/* Search Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col max-h-[80vh] backdrop-blur-md">
        
        {/* Glow overlay lines */}
        <span className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-brand-purple/20 via-brand-cyan/20 to-brand-purple/20" />

        {/* Input Block */}
        <div className="flex items-center border-b border-slate-800/80 px-4 py-3.5 relative">
          <Search className="h-5 w-5 text-slate-500 mr-3 shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, articles, categories..."
            className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder-slate-600 focus:ring-0 focus:outline-none w-full"
          />

          {loading ? (
            <Loader2 className="h-4.5 w-4.5 text-brand-cyan animate-spin mr-3 shrink-0" />
          ) : query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-500 hover:text-white mr-3 shrink-0 focus:outline-none"
            >
              Clear
            </button>
          )}

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white rounded-lg border border-slate-800 p-1.5 hover:bg-white/5 transition-all focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Result Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Default / Recent Searches */}
          {!query && (
            <div className="space-y-4">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                    <span>Recent Searches</span>
                    <button onClick={clearAllRecent} className="hover:text-red-400 font-bold lowercase">
                      clear all
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => setQuery(term)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/40 hover:bg-slate-850/40 border border-slate-800/30 cursor-pointer text-xs text-slate-300 hover:text-white group"
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>{term}</span>
                        </div>
                        <button
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 px-1 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <Sparkles className="h-7 w-7 text-brand-purple/40 mx-auto animate-pulse" />
                  <p className="text-xs">Type your target keywords to look up preparation materials</p>
                  <p className="text-[10px] text-slate-600">Try searching "React Hook", "Event Loop", or "FlatList"</p>
                </div>
              )}
            </div>
          )}

          {/* Search Result Matches */}
          {query && !loading && (
            <div className="space-y-6">
              
              {/* No results */}
              {results.categories.length === 0 && results.questions.length === 0 && results.blogs.length === 0 && (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <p className="text-xs">No matches found for "{query}"</p>
                  <p className="text-[10px] text-slate-650">Verify your query string or try another category keyword.</p>
                </div>
              )}

              {/* Categories */}
              {results.categories.length > 0 && (
                <div>
                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Categories</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.categories.map((cat) => (
                      <div
                        key={cat.slug}
                        onClick={() => handleLinkClick(`/questions/${cat.slug}`, cat.name)}
                        className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-brand-cyan/40 hover:bg-slate-800/20 cursor-pointer flex flex-col justify-between"
                      >
                        <span className="text-xs font-bold text-white block">{cat.name}</span>
                        <span className="text-[9px] text-slate-500 mt-1 leading-normal line-clamp-2">{cat.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions */}
              {results.questions.length > 0 && (
                <div>
                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Questions</h4>
                  <div className="space-y-2">
                    {results.questions.map((q) => (
                      <div
                        key={q._id}
                        onClick={() => handleLinkClick(`/questions/${q.categorySlug}/${q.slug}`, q.question)}
                        className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-brand-purple/40 hover:bg-slate-800/20 cursor-pointer flex justify-between items-center group"
                      >
                        <div className="flex-1 pr-4">
                          <span className="inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20 mb-1.5">
                            {q.categorySlug}
                          </span>
                          <p className="text-xs font-semibold text-slate-200 leading-snug group-hover:text-white transition-colors">{q.question}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs */}
              {results.blogs.length > 0 && (
                <div>
                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Blogs & Articles</h4>
                  <div className="space-y-2">
                    {results.blogs.map((b) => (
                      <div
                        key={b._id}
                        onClick={() => handleLinkClick(`/blog/${b.slug}`, b.title)}
                        className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-brand-cyan/40 hover:bg-slate-800/20 cursor-pointer flex justify-between items-center group"
                      >
                        <div className="flex-1 pr-4">
                          <span className="inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 mb-1.5">
                            {b.category}
                          </span>
                          <h5 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{b.title}</h5>
                          <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 font-normal leading-relaxed">{b.summary}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-slate-805/50 px-4 py-2.5 bg-slate-950/50 flex justify-between items-center text-[9px] text-slate-550 font-semibold font-mono">
          <div className="flex space-x-3">
            <span><kbd className="bg-slate-800 border border-slate-700 rounded px-1">esc</kbd> close</span>
            <span><kbd className="bg-slate-800 border border-slate-700 rounded px-1">↵</kbd> select</span>
          </div>
          <span>InterviewAceAI.online</span>
        </div>

      </div>
    </div>
  );
}
