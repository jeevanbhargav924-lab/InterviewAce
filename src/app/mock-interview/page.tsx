"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { Cpu, Play, Sparkles, CheckSquare, MessageSquare, AlertCircle } from "lucide-react";

export default function MockInterviewSetupPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [topic, setTopic] = useState("React Developer");
  const [experience, setExperience] = useState("mid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { name: "React Developer", desc: "Hooks, fibers, styling, custom architectures, memory leaks." },
    { name: "JavaScript Developer", desc: "Prototypes, event loops, async patterns, engine closures." },
    { name: "MERN Stack Developer", desc: "MongoDB schemas, Express routes, Node cluster, REST designs." }
  ];

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError("Please sign in or register an account to start mock interviews.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create session in DB
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          topic: `${topic} (${experience === "junior" ? "Junior" : experience === "mid" ? "Mid-Level" : "Senior"})`,
          messages: []
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initialize interview.");

      router.push(`/mock-interview/${data.sessionId}`);
    } catch (err: any) {
      setError(err.message || "Could not launch interview session.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_60%)] pointer-events-none" />

        <div className="w-full max-w-xl bg-glass border border-slate-800 rounded-2xl p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-brand-purple/20 to-brand-cyan/20 flex items-center justify-center border border-brand-purple/30 mx-auto mb-4">
              <Cpu className="h-6 w-6 text-brand-cyan" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Interview Simulator</h1>
            <p className="text-xs text-slate-400 mt-1">Configure your mock session parameters to begin.</p>
          </div>

          {error && (
            <div className="mb-6 rounded bg-red-500/10 border border-red-500/25 p-3.5 text-xs text-red-400 flex items-start space-x-2">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStartInterview} className="space-y-6">
            
            {/* Pick Job Profile */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-3">
                Target Job Profile
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.name}
                    type="button"
                    onClick={() => setTopic(role.name)}
                    className={`text-left rounded-lg p-4 border transition-all ${
                      topic === role.name
                        ? "border-brand-purple bg-brand-purple/5"
                        : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{role.name}</span>
                      {topic === role.name && (
                        <span className="h-2 w-2 rounded-full bg-brand-purple" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "junior", label: "Junior (0-2 Y)" },
                  { id: "mid", label: "Mid-Level (2-5 Y)" },
                  { id: "senior", label: "Senior (5+ Y)" }
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperience(exp.id)}
                    className={`rounded-lg py-2.5 text-center text-xs font-semibold border transition-all ${
                      experience === exp.id
                        ? "border-brand-cyan bg-brand-cyan/5 text-white"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Consent checklist */}
            <div className="rounded-lg bg-slate-950/60 border border-slate-850 p-4 space-y-2.5 text-[10px] text-slate-400 leading-relaxed">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-3.5 w-3.5 text-brand-cyan shrink-0" />
                <span>Simulates live browser Speech Recognition.</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-3.5 w-3.5 text-brand-cyan shrink-0" />
                <span>Evaluates communication pacing and technical correctness.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-3.5 text-xs font-semibold text-white shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              <Play className="h-4.5 w-4.5 fill-current" />
              <span>{loading ? "Starting simulator..." : "Launch AI Interview"}</span>
            </button>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
