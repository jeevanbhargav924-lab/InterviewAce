"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate password recovery OTP delivery
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] relative px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08)_0%,_transparent_60%)]" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-black text-sm">
              A
            </span>
            <span className="text-lg font-bold text-white tracking-tight">
              InterviewAce<span className="text-brand-cyan">.AI</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-white">Reset password</h2>
          <p className="text-xs text-slate-400 mt-1">We will send a 6-digit OTP code to verify your identity.</p>
        </div>

        {success ? (
          <div className="rounded bg-emerald-500/10 border border-emerald-500/25 p-4 text-xs text-emerald-400 text-center">
            Verification code successfully generated! Redirecting to OTP screen...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-3 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              <span>{loading ? "Generating OTP..." : "Send Verification Code"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-slate-400">
          Remembered your password?{" "}
          <Link href="/login" className="text-brand-cyan font-semibold hover:underline">
            Go back to Log In
          </Link>
        </p>

      </div>
    </div>
  );
}
