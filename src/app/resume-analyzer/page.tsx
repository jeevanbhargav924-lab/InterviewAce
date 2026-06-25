import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import ResumeClient from "@/components/resume/ResumeClient";

export const metadata: Metadata = {
  title: "AI ATS Resume Matcher & Keyword Optimizer | InterviewAce AI",
  description: "Score your resume compatibility against real software engineer job descriptions. Identify missing keywords and upgrade your job statement bullet points.",
  alternates: {
    canonical: "https://www.interviewaceai.online/resume-analyzer"
  }
};

export default function ResumeAnalyzerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <ResumeClient />
      </main>

      <Footer />
    </div>
  );
}
