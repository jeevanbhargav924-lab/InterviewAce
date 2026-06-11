"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const errorParam = searchParams.get("error");

  React.useEffect(() => {
    if (errorParam) {
      if (errorParam === "OAuthCallback") {
        setError("Google authentication failed. This usually indicates an issue with your Google client keys, database connection, or SSL/time synchronization.");
      } else if (errorParam === "AccessDenied") {
        setError("Access denied. The database or server rejected your authentication request.");
      } else {
        setError(`Authentication error: ${errorParam}`);
      }
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setError("");
    setLoading(true);
    try {
      if (provider === "google") {
        await signIn("google", { callbackUrl });
      }
    } catch (e) {
      setError("Google sign-in failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] relative px-4 py-12">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08)_0%,_transparent_60%)]" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-black text-sm">
              A
            </span>
            <span className="text-lg font-bold text-white tracking-tight">
              InterviewAce<span className="text-brand-cyan">.AI</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-white">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to resume mock interviews and resume reviews.</p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase">
                Password
              </label>
              <Link href="/forgot-password" className="text-[10px] text-brand-cyan hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-3 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Log In"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <span className="w-1/5 border-b border-slate-800" />
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Or Sign In With</span>
          <span className="w-1/5 border-b border-slate-800" />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-lg border border-slate-800 bg-slate-950 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.488 0-6.322-2.833-6.322-6.322s2.834-6.322 6.322-6.322c1.683 0 3.12.581 4.254 1.636l3.14-3.14C19.206 2.378 16.037 1 12.24 1 6.033 1 12 6.033 12 12.24s5.033 11.24 11.24 11.24c6.478 0 11.24-4.557 11.24-11.24 0-.768-.068-1.516-.188-2.235H12.24z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-brand-cyan font-semibold hover:underline">
            Sign up for free
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030014] text-slate-500 flex items-center justify-center text-xs animate-pulse">
        Loading signin assets...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
