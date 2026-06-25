import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import PrepareClient from "@/components/prepare/PrepareClient";

export const metadata: Metadata = {
  title: "Interview Question Cards Practice Hub | InterviewAce AI",
  description: "Browse hundreds of frontend, backend, database, and HR interview questions. Study top questions with answers and tags.",
  alternates: {
    canonical: "https://www.interviewaceai.online/prepare"
  }
};

export default function PreparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <PrepareClient />
      </main>

      <Footer />
    </div>
  );
}
