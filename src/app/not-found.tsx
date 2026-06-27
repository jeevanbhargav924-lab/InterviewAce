import React from "react";
import Link from "next/link";
import { Compass, Cpu, Terminal, FileText, ArrowRight, Home } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16 relative z-10 text-center">
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.06)_0%,_transparent_60%)] pointer-events-none" />

        <div className="max-w-xl w-full border border-slate-800/80 bg-slate-950/40 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden space-y-6">
          <span className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-brand-purple/20 via-brand-cyan/20 to-brand-purple/20" />
          
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-3 py-1 rounded-full animate-pulse">
              Error Code: 404
            </span>
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              We couldn't find the page you're looking for. It might have been moved, renamed, or is temporarily unavailable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link
              href="/prepare"
              className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-purple/40 hover:bg-slate-900 transition-all text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <Compass className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white leading-none mb-1 group-hover:text-brand-purple transition-colors">Prepare Hub</p>
                <p className="text-[10px] text-slate-500 truncate">Browse interview question cards</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-655 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/mock-interview"
              className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-cyan/40 hover:bg-slate-900 transition-all text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white leading-none mb-1 group-hover:text-brand-cyan transition-colors">AI Mock Interview</p>
                <p className="text-[10px] text-slate-500 truncate">Run voice-guided interview loops</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-655 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/coding"
              className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-cyan/40 hover:bg-slate-900 transition-all text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                <Terminal className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white leading-none mb-1 group-hover:text-brand-cyan transition-colors">Coding Challenges</p>
                <p className="text-[10px] text-slate-500 truncate">Solve DSA sandboxed queries</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-655 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/resume-analyzer"
              className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-purple/40 hover:bg-slate-900 transition-all text-left group"
            >
              <div className="h-8 w-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white leading-none mb-1 group-hover:text-brand-purple transition-colors">ATS Resume Scorer</p>
                <p className="text-[10px] text-slate-500 truncate">Benchmark keyword match index</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-655 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800/60">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
