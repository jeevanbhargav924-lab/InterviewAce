import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import CodingDetailClient from "@/components/coding/CodingDetailClient";
import { dbConnect } from "@/lib/db";
import Challenge from "@/models/Challenge";

interface ChallengePageProps {
  params: Promise<{ challengeId: string }>;
}

const PROBLEM_DB: Record<string, any> = {
  "two-sum": {
    title: "Two Sum",
    category: "DSA",
    difficulty: "easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
    starterCode: `function twoSum(nums, target) {\n  // Write your code here\n}`,
    functionName: "twoSum",
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isHidden: false },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]", isHidden: false },
      { input: "[3,3], 6", expectedOutput: "[0,1]", isHidden: true }
    ]
  },
  "reverse-linked-list": {
    title: "Reverse a Linked List",
    category: "DSA",
    difficulty: "medium",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    starterCode: `function reverseList(head) {\n  // Write your code here\n}`,
    functionName: "reverseList",
    testCases: [
      { input: "null", expectedOutput: "null", isHidden: false }
    ]
  },
  "js-debounce": {
    title: "Implement Debounce Function",
    category: "JavaScript",
    difficulty: "medium",
    description: `Given a function fn and a time in milliseconds t, return a debounced version of that function.`,
    starterCode: `function debounce(fn, t) {\n  // Write your code here\n}`,
    functionName: "debounce",
    testCases: [
      { input: "((a) => a), 50", expectedOutput: "undefined", isHidden: false }
    ]
  }
};

export async function generateMetadata({ params }: ChallengePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { challengeId } = resolvedParams;

  try {
    await dbConnect();
    let challenge = await Challenge.findOne({ slug: challengeId }).select("title description").lean();
    if (!challenge) {
      challenge = PROBLEM_DB[challengeId];
    }
    
    if (!challenge) {
      return { title: "Coding Challenge Not Found | InterviewAce AI" };
    }

    return {
      title: `Solve ${challenge.title} | Algorithmic Interview Drill`,
      description: challenge.description.length > 150 ? challenge.description.substring(0, 150) + "..." : challenge.description,
      alternates: {
        canonical: `https://www.interviewaceai.online/coding/${challengeId}`
      }
    };
  } catch (error) {
    return { title: "Interactive Coding Sandbox | InterviewAce AI" };
  }
}

// Force dynamic execution for fresh reads in SSR
export const revalidate = 0;

export default async function CodeWorkspacePage({ params }: ChallengePageProps) {
  const resolvedParams = await params;
  const { challengeId } = resolvedParams;

  let challengeData: any = null;

  try {
    await dbConnect();
    const rawChallenge = await Challenge.findOne({ slug: challengeId }).lean();
    if (rawChallenge) {
      challengeData = {
        _id: rawChallenge._id.toString(),
        title: rawChallenge.title,
        slug: rawChallenge.slug,
        category: rawChallenge.category,
        difficulty: rawChallenge.difficulty,
        description: rawChallenge.description,
        starterCode: rawChallenge.starterCode,
        functionName: rawChallenge.functionName,
        testCases: (rawChallenge.testCases || []).map((t: any) => ({
          input: t.input,
          expectedOutput: t.expectedOutput,
          isHidden: t.isHidden || false
        }))
      };
    } else {
      const local = PROBLEM_DB[challengeId];
      if (local) {
        challengeData = {
          _id: challengeId,
          ...local
        };
      }
    }
  } catch (error) {
    console.error("Database connection failed in coding detail Server fetch. Falling back to local PROBLEM_DB", error);
    const local = PROBLEM_DB[challengeId];
    if (local) {
      challengeData = {
        _id: challengeId,
        ...local
      };
    }
  }

  if (!challengeData) {
    notFound();
  }

  // JSON-LD SoftwareApplication Schema for Coding Editor
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `InterviewAce Coding Playground - ${challengeData.title}`,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": `Interactive Monaco Editor sandbox to practice and solve: ${challengeData.title}`
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CustomCursor />
      <Navbar />

      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-64px)] relative z-10 overflow-hidden">
        <CodingDetailClient challenge={challengeData} />
      </main>

      <Footer />
    </div>
  );
}
