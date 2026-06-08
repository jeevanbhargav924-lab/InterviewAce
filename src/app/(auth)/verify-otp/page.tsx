"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, ShieldCheck, ArrowRight } from "lucide-react";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"otp" | "reset">("otp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      setLoading(false);
      return;
    }

    // Simulate OTP verify
    setTimeout(() => {
      setLoading(false);
      setStep("reset");
    }, 1000);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    // Simulate password change
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
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
          <h2 className="mt-4 text-xl font-bold text-white">
            {step === "otp" ? "Enter OTP Code" : "Create New Password"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === "otp" 
              ? `Verification digits sent to ${email}`
              : "Specify your strong new access key."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {success ? (
          <div className="rounded bg-emerald-500/10 border border-emerald-500/25 p-4 text-xs text-emerald-400 text-center">
            Password updated successfully! Forwarding to sign in page...
          </div>
        ) : step === "otp" ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-between items-center space-x-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-12 rounded bg-slate-950 border border-slate-800 text-center text-lg font-bold text-white focus:border-brand-cyan focus:outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-3 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              <span>{loading ? "Verifying code..." : "Confirm Verification"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword}
              className="w-full rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-3 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              <span>{loading ? "Saving password..." : "Confirm Password Change"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-slate-400">
          Didn't receive the email?{" "}
          <button 
            type="button"
            onClick={() => {
              setOtp(["", "", "", "", "", ""]);
              setError("");
              alert("A simulated reset OTP code has been re-dispatched!");
            }}
            className="text-brand-cyan font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Resend Code
          </button>
        </p>

      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030014] text-slate-500 flex items-center justify-center text-xs animate-pulse">
        Loading verification assets...
      </div>
    }>
      <VerifyOtpForm />
    </Suspense>
  );
}
