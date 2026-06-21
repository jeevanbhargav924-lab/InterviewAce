"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import { FREE_BETA } from "@/lib/config";
import { LayoutDashboard, Shield, Cpu, FileText, CheckCircle, Crown, Lock, RefreshCw } from "lucide-react";

interface InterviewHistory {
  _id: string;
  topic: string;
  scores: {
    overall: number;
  };
  createdAt: string;
}

interface ResumeHistory {
  _id: string;
  fileName: string;
  atsScore: number;
  createdAt: string;
}

function UserDashboardContent() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get("checkout");

  const [interviews, setInterviews] = useState<InterviewHistory[]>([]);
  const [resumes, setResumes] = useState<ResumeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);

  const hasPremiumRecord = (session?.user as any)?.subscription?.plan === "premium" && 
                          (session?.user as any)?.subscription?.status === "active";
  const isPremium = FREE_BETA || hasPremiumRecord;

  useEffect(() => {
    if (!session) return;

    async function loadHistory() {
      try {
        // Query user's records from DB
        const [interviewsRes, resumesRes] = await Promise.all([
          fetch("/api/mock-interview"),
          fetch("/api/resume")
        ]);
        
        if (interviewsRes.ok && resumesRes.ok) {
          const interviewsData = await interviewsRes.json();
          const resumesData = await resumesRes.json();
          setInterviews(interviewsData);
          setResumes(resumesData);
        }
      } catch (err) {
        console.error("Failed to load dashboard logs:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadHistory();
  }, [session]);

  // Sync session on Stripe checkout redirect
  useEffect(() => {
    if (checkoutStatus === "success" && session) {
      const syncSession = async () => {
        await update({
          subscription: {
            plan: "premium",
            status: "active",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
        router.replace("/dashboard");
      };
      syncSession();
    }
  }, [checkoutStatus, session, update, router]);

  const handleUpgrade = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulatedSuccess: true }) // Fast simulated purchase redirect
      });
      const data = await res.json();
      if (res.ok) {
        // Trigger NextAuth token reload
        await update({
          subscription: {
            plan: "premium",
            status: "active",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
        alert("Simulated Premium activation successful! Ads disabled and premium interview packs unlocked.");
        router.refresh();
      }
    } catch (e) {
      console.error("Checkout upgrade failed:", e);
    } finally {
      setBillingLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-400 flex flex-col items-center justify-center p-6">
        <p className="text-xs mb-3">Please sign in to view your dashboard logs.</p>
        <button onClick={() => router.push("/login")} className="text-brand-cyan text-xs underline">
          Log In Page
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800/80 mb-8">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6 text-brand-cyan" />
              <span>User Dashboard Workspace</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Monitor mock transcript grades, study schedules, and billing status.</p>
          </div>
        </div>

        {/* Analytics Top overview grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Mock interview metrics */}
          <div className="bg-glass border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
            <div className="h-10 w-10 rounded bg-brand-cyan/15 flex items-center justify-center shrink-0 border border-brand-cyan/20">
              <Cpu className="h-5 w-5 text-brand-cyan" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Mock Interviews conducted</p>
              <h3 className="text-lg font-bold text-white mt-0.5">{interviews.length} Completed</h3>
            </div>
          </div>

          {/* Resume analyzer uploads metrics */}
          <div className="bg-glass border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
            <div className="h-10 w-10 rounded bg-brand-purple/15 flex items-center justify-center shrink-0 border border-brand-purple/20">
              <FileText className="h-5 w-5 text-brand-purple" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Resumes Analyzed</p>
              <h3 className="text-lg font-bold text-white mt-0.5">{resumes.length} {resumes.length === 1 ? "Report" : "Reports"}</h3>
            </div>
          </div>

          {/* Membership widget */}
          <div className="bg-glass border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded bg-brand-cyan/10 flex items-center justify-center shrink-0 border border-brand-cyan/20">
                <Crown className="h-5 w-5 text-brand-cyan" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Account Access</p>
                <h3 className="text-xs font-bold text-white mt-0.5">
                  {hasPremiumRecord ? "Premium Subscription (Active)" : FREE_BETA ? "Free Beta Access (Unlimited)" : "Free Tier (Basic)"}
                </h3>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Area: History Logs lists */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Mock dialogue records */}
            <div className="bg-glass border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Mock Interview History</h3>
              {loading ? (
                <div className="text-center py-6 text-slate-600 animate-pulse text-xs">Loading histories...</div>
              ) : interviews.length === 0 ? (
                <p className="text-slate-650 text-xs italic">No interviews conducted yet.</p>
              ) : (
                <div className="space-y-3">
                  {interviews.map(item => (
                    <div key={item._id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-xs font-semibold text-white">{item.topic}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-brand-cyan">{item.scores.overall}%</span>
                        <span className="block text-[8px] text-slate-500 uppercase font-bold">Grade</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resume optimization logs */}
            <div className="bg-glass border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">ATS Resume Reports</h3>
              {loading ? (
                <div className="text-center py-6 text-slate-600 animate-pulse text-xs">Loading CV logs...</div>
              ) : resumes.length === 0 ? (
                <p className="text-slate-650 text-xs italic">No resumes analyzed yet.</p>
              ) : (
                <div className="space-y-3">
                  {resumes.map(item => (
                    <div key={item._id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-xs font-semibold text-white">{item.fileName}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-brand-purple">{item.atsScore}%</span>
                        <span className="block text-[8px] text-slate-500 uppercase font-bold">ATS MATCH</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Direct dashboard navigation promotion */}
            <div className="bg-gradient-to-tr from-brand-purple/20 to-brand-cyan/20 rounded-xl p-5 border border-brand-purple/30 text-center">
              <Shield className="h-7 w-7 text-brand-cyan mx-auto mb-3" />
              <h3 className="text-xs font-bold text-white">Interactive Sandbox Utilities</h3>
              <p className="text-[10px] text-slate-550 leading-relaxed mt-1 mb-4">Launch new AI interviews or upload optimized resumes.</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => router.push("/mock-interview")}
                  className="rounded bg-brand-purple hover:brightness-110 py-2 text-[10px] font-bold text-white shadow-md"
                >
                  New Interview
                </button>
                <button
                  onClick={() => router.push("/resume-analyzer")}
                  className="rounded bg-slate-950 border border-slate-850 hover:text-white py-2 text-[10px] font-bold text-slate-400"
                >
                  Analyze CV
                </button>
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

export default function UserDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030014] text-slate-500 flex items-center justify-center text-xs animate-pulse">
        Loading dashboard metrics...
      </div>
    }>
      <UserDashboardContent />
    </Suspense>
  );
}
