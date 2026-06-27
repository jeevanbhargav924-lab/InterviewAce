"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled runtime boundary error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-[#030014] text-slate-100 items-center justify-center px-4 text-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.04)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-md w-full border border-rose-950/40 bg-slate-950/40 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden space-y-6">
        <span className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-rose-500/20" />

        <div className="space-y-2">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4 animate-pulse">
            <AlertTriangle className="h-6 w-6" />
          </div>
          
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Something Went Wrong!
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while executing client components. We have recorded this log file boundary.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-1 rounded inline-block mt-2">
              Digest ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-center space-x-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-350 hover:text-white transition-all active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
