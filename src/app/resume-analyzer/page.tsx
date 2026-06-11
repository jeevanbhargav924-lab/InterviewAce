"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import { FREE_BETA } from "@/lib/config";
import { FileText, Upload, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Clipboard } from "lucide-react";

interface Report {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  optimizedBullets: Array<{
    original: string;
    optimized: string;
  }>;
}

export default function ResumeAnalyzerPage() {
  const { data: session } = useSession();
  
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("resume_profile.txt");
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  const hasPremiumRecord = (session?.user as any)?.subscription?.plan === "premium" && 
                          (session?.user as any)?.subscription?.status === "active";
  const isPremium = true;

  const handleTextPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Extract file info if any
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError("Please sign in or register an account to run ATS Resume Analysis.");
      return;
    }
    if (!resumeText.trim() || analyzing) return;

    setAnalyzing(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: resumeText,
          fileName
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to analyze resume.");

      setReport(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSampleResume = () => {
    setFileName("sample_software_engineer.txt");
    setResumeText(`Jane Doe - Software Engineer
Email: jane.doe@domain.com | LinkedIn: /in/janedoe

PROFESSIONAL SUMMARY:
Frontend Developer with 3 years experience. Helped build frontend components and websites. Experienced in CSS and writing HTML. Worked on fixing bugs in databases.

EXPERIENCE:
Junior Web Developer | TechCorp (2023 - Present)
- Worked on writing some React components for our web app.
- Styled interfaces and did bug fixes.
- Helped push code updates and talked with clients.
- Managed database using MongoDB.

SKILLS:
JavaScript, React, CSS, HTML, databases, Git.`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="border-b border-slate-800 pb-5 mb-8">
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <FileText className="h-6 w-6 text-brand-cyan" />
            <span>ATS Resume Scorer</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Audit your resume keywords, upgrade job statements, and match recruitment filters.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Paste Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-glass rounded-xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Paste Resume Experience Sheets</h2>
                <button
                  type="button"
                  onClick={loadSampleResume}
                  className="text-[10px] text-brand-cyan hover:text-brand-purple font-semibold hover:underline"
                >
                  Load sample resume template
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={12}
                    required
                    placeholder="Paste your full text resume here... (include summary, experience, education, and skills sections)"
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-4 text-xs text-slate-300 placeholder-slate-600 focus:border-brand-purple focus:outline-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Mock filename:</span>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] px-2 py-1 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={analyzing || !resumeText.trim()}
                    className="rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan px-6 py-2.5 text-xs font-semibold text-white shadow-xl hover:brightness-110 disabled:opacity-40 transition-all flex items-center space-x-1"
                  >
                    <span>{analyzing ? "Running parser..." : "Analyze ATS Scores"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* RESULTS VIEW */}
            {report && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Score and Keyword sections split */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Score gauge circle */}
                  <div className="bg-glass border border-slate-800 rounded-xl p-6 text-center flex flex-col items-center justify-center">
                    <p className="text-xs font-bold text-white mb-4 uppercase tracking-wider">ATS MATCHING INDEX</p>
                    <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-slate-800">
                      <span className={`text-3xl font-black ${
                        report.atsScore >= 80 ? "text-emerald-400" :
                        report.atsScore >= 60 ? "text-amber-400" :
                        "text-rose-400"
                      }`}>
                        {report.atsScore}%
                      </span>
                      <span className="absolute bottom-4 text-[8px] text-slate-500 font-bold uppercase">SCORE</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                      {report.atsScore >= 80 ? "Excellent. Ready to submit." : 
                       report.atsScore >= 60 ? "Average. Tweak statements to pass." :
                       "Needs work. Inject critical skill tags."}
                    </p>
                  </div>

                  {/* Missing keywords badging */}
                  <div className="md:col-span-2 bg-glass border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wider flex items-center space-x-1">
                        <AlertTriangle className="h-4.5 w-4.5 text-brand-purple" />
                        <span>Identified Keyword Gaps</span>
                      </h3>
                      <p className="text-slate-400 text-[10px] mb-4">Adding these keywords directly to your experience bullet points raises callback ratios.</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {report.missingKeywords.map(kw => (
                          <span
                            key={kw}
                            className="text-[10px] text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-0.5 rounded-full font-semibold"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 mt-4 pt-3 border-t border-slate-800/40">
                      {report.missingKeywords.length > 0 
                        ? `Missing ${report.missingKeywords.length} essential tech tags.`
                        : "Outstanding keyword matches!"}
                    </div>
                  </div>

                </div>

                {/* Bullet Optimization comparative (Monetization Gate for full access) */}
                <div className="bg-glass border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                  


                  <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-brand-cyan" />
                    <span>Side-by-side upgraded bullet statements</span>
                  </h3>

                  <div className="space-y-4">
                    {report.optimizedBullets.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800/40 last:border-b-0 last:pb-0">
                        <div className="rounded bg-slate-900/40 p-3 border border-slate-850">
                          <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Original Draft</p>
                          <p className="text-[11px] text-slate-400 italic font-normal leading-relaxed">"{item.original}"</p>
                        </div>
                        <div className="rounded bg-brand-cyan/5 p-3 border border-brand-cyan/20">
                          <p className="text-[9px] font-bold text-brand-cyan uppercase mb-1">Upgraded Optimizer Output</p>
                          <p className="text-[11px] text-slate-200 font-semibold leading-relaxed">"{item.optimized}"</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Suggestions list card */}
            {report && (
              <div className="bg-glass rounded-xl p-5 border border-slate-800">
                <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">ATS upgrade suggestions</h3>
                <ul className="space-y-3.5 text-[11px] text-slate-400 font-normal">
                  {report.suggestions.map((sug, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-purple shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <AdPlaceholder position="sidebar" />

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
