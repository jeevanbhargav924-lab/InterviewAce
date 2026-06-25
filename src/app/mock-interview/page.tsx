import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import MockInterviewClient from "@/components/mock-interview/MockInterviewClient";

export const metadata: Metadata = {
  title: "AI Voice Mock Interview Simulator | InterviewAce AI",
  description: "Configure and start live verbal mock interviews. Experience real-time speech analytics, technical grading, and communication reports.",
  alternates: {
    canonical: "https://www.interviewaceai.online/mock-interview"
  }
};

export default function MockInterviewSetupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_60%)] pointer-events-none" />
        <MockInterviewClient />
      </main>

      <Footer />
    </div>
  );
}
