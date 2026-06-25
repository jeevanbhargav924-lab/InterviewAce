import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import CodingClient from "@/components/coding/CodingClient";
import { dbConnect } from "@/lib/db";
import Challenge from "@/models/Challenge";

export const metadata: Metadata = {
  title: "Algorithmic DSA & Frontend Coding Challenges | InterviewAce AI",
  description: "Improve your technical execution. Compile code, run hidden test cases, and solve real-world coding questions asked in Big Tech.",
  alternates: {
    canonical: "https://www.interviewaceai.online/coding"
  }
};

const STATIC_CHALLENGES = [
  {
    id: "two-sum",
    title: "Two Sum",
    category: "DSA" as const,
    difficulty: "easy" as const,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    companies: ["Google", "Amazon", "Microsoft"]
  },
  {
    id: "reverse-linked-list",
    title: "Reverse a Linked List",
    category: "DSA" as const,
    difficulty: "medium" as const,
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list node.",
    companies: ["Facebook", "Stripe", "Netflix"]
  },
  {
    id: "js-debounce",
    title: "Implement Debounce Function",
    category: "JavaScript" as const,
    difficulty: "medium" as const,
    description: "Create a debounced function that delays invoking the runner until after wait milliseconds have elapsed.",
    companies: ["Uber", "Lyft", "Airbnb"]
  },
  {
    id: "react-counter",
    title: "Build a React Counter Hook",
    category: "React" as const,
    difficulty: "easy" as const,
    description: "Develop a custom hook useCounter that supports increments, decrements, and optional reset bounds.",
    companies: ["Stripe", "Meta", "Coinbase"]
  }
];

// Force dynamic execution for fresh reads in SSR
export const revalidate = 0;

export default async function CodingChallengesPage() {
  let challenges: any[] = [];

  try {
    await dbConnect();
    const rawChallenges = await Challenge.find({}).lean();

    if (rawChallenges && rawChallenges.length > 0) {
      challenges = rawChallenges.map((c: any) => ({
        id: c.slug || c._id.toString(),
        title: c.title,
        category: c.category,
        difficulty: c.difficulty,
        description: c.description.length > 150 ? c.description.substring(0, 150) + "..." : c.description,
        companies: c.companyTags || []
      }));
    } else {
      challenges = STATIC_CHALLENGES;
    }
  } catch (error) {
    console.error("Database connection failed in coding list Server fetch. Falling back to static values.", error);
    challenges = STATIC_CHALLENGES;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <CodingClient initialChallenges={challenges} />
      </main>

      <Footer />
    </div>
  );
}
