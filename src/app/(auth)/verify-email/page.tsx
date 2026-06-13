"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { sendEmailVerification, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Mail, RefreshCw, LogOut, ArrowRight, ShieldCheck } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetPlan = searchParams.get("plan") || "free";
  const urlEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(urlEmail);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Sync Firebase Auth user and extract email if not set
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || urlEmail);
      } else if (!urlEmail) {
        // No firebase user and no URL email -> redirect to login
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [urlEmail, router]);

  // Countdown timer logic for resending
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Polling to automatically detect if email verified
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkVerification = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(intervalId);
            setSuccessMessage("Email verified successfully! Logging you in...");
            
            // Retrieve Firebase ID Token
            const idToken = await user.getIdToken(true);
            
            // Authenticate with NextAuth credentials provider
            const res = await signIn("credentials", {
              idToken,
              redirect: false,
            });

            if (res?.error) {
              setError("Email verified, but session synchronization failed: " + res.error);
            } else {
              // Successfully verified and signed in!
              if (targetPlan === "premium") {
                // Simulate checkout activation for premium flow
                await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ simulatedSuccess: true }),
                });
                router.push("/dashboard?checkout=success");
              } else {
                router.push("/");
              }
            }
          }
        } catch (err: any) {
          console.error("Error checking verification status:", err);
        }
      }
    };

    // Run verification check every 3 seconds
    intervalId = setInterval(checkVerification, 3000);

    return () => clearInterval(intervalId);
  }, [router, targetPlan]);

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setError("");
    setSuccessMessage("");
    setResending(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setSuccessMessage("Verification link sent! Please check your inbox.");
        setCountdown(60);
      } else {
        setError("Unable to resend: No active session found. Please try logging in again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification link.");
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    setError("");
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (err: any) {
      setError("Failed to sign out. Please try refreshing.");
    } finally {
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
          <div className="mt-6 flex justify-center">
            <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-full animate-pulse">
              <Mail className="h-6 w-6 text-brand-cyan" />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">Verify your email</h2>
          <p className="text-xs text-slate-400 mt-1">
            We have sent a verification link to your registered email address.
          </p>
        </div>

        {email && (
          <div className="mb-6 text-center">
            <span className="px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-semibold text-brand-cyan">
              {email}
            </span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-400 leading-relaxed">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400 leading-relaxed">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="w-full rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-3 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {resending ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
            <span>
              {countdown > 0
                ? `Resend Verification (${countdown}s)`
                : "Resend Verification Email"}
            </span>
          </button>

          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-lg border border-slate-800 bg-slate-950 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-all disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Use a different account</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500">
            Waiting for verification... Once you click the link in the email, this page will automatically redirect you.
          </p>
        </div>

      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030014] text-slate-500 flex items-center justify-center text-xs animate-pulse">
          Loading verification screen...
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
