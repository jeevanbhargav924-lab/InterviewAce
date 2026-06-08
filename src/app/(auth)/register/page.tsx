"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, User, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetPlan = searchParams.get("plan") || "free";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create account
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      // 2. Auto sign-in
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        setError("Account created, but automatic sign-in failed. Please log in manually.");
        setLoading(false);
        return;
      }

      // 3. Handle Premium redirect or standard redirect
      if (targetPlan === "premium") {
        // Upgrade mock/real checkout
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ simulatedSuccess: true }), // Simulated direct activation for demo speed!
        });
        const checkoutData = await checkoutRes.json();
        
        router.refresh();
        router.push("/dashboard?checkout=success");
      } else {
        router.refresh();
        router.push("/dashboard");
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during account creation.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] relative px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08)_0%,_transparent_60%)]" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-black text-sm">
              A
            </span>
            <span className="text-lg font-bold text-white tracking-tight">
              InterviewAce<span className="text-brand-cyan">.AI</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-white">Create your account</h2>
          <p className="text-xs text-slate-400 mt-1">
            {targetPlan === "premium" 
              ? "Upgrading to Pro Membership Plan" 
              : "Start practicing questions and tracking analytics."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <input type="checkbox" required className="rounded bg-slate-950 border-slate-800 text-brand-purple" />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-3 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
          >
            <span>{loading ? "Registering account..." : "Sign Up"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-cyan font-semibold hover:underline">
            Log in instead
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030014] text-slate-500 flex items-center justify-center text-xs animate-pulse">
        Loading signup assets...
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
