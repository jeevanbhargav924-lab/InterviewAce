"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { Terminal, Play, CheckCircle, XCircle, ChevronLeft, BookOpen, AlertTriangle } from "lucide-react";

interface ChallengeData {
  title: string;
  category: string;
  difficulty: string;
  description: string;
  starterCode: string;
  functionName: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }>;
}

const PROBLEM_DB: Record<string, ChallengeData> = {
  "two-sum": {
    title: "Two Sum",
    category: "DSA",
    difficulty: "easy",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

### Example 1
**Input:** nums = [2,7,11,15], target = 9
**Output:** [0,1]
**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].

### Constraints
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\``,
    starterCode: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
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
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.

### Example 1
**Input:** head = [1,2,3,4,5]
**Output:** [5,4,3,2,1]

### Constraints
- The number of nodes in the list is in the range \`[0, 5000]\`.
- \`-5000 <= Node.val <= 5000\``,
    starterCode: `// Represents a singly-linked list node:
// class ListNode {
//   constructor(val, next = null) {
//     this.val = val;
//     this.next = next;
//   }
// }

function reverseList(head) {
  // Write your code here
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
    functionName: "reverseList",
    testCases: [
      { input: "null", expectedOutput: "null", isHidden: false }
    ]
  },
  "js-debounce": {
    title: "Implement Debounce Function",
    category: "JavaScript",
    difficulty: "medium",
    description: `Given a function \`fn\` and a time in milliseconds \`t\`, return a **debounced** version of that function.

A **debounced** function is a function whose execution is delayed by \`t\` milliseconds and whose execution is cancelled if it is called again within that window.

The debounced function should also receive the passed parameters.`,
    starterCode: `function debounce(fn, t) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, t);
  }
}`,
    functionName: "debounce",
    testCases: [
      { input: "((a) => a), 50", expectedOutput: "undefined", isHidden: false }
    ]
  }
};

export default function CodeWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.challengeId as string;

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [code, setCode] = useState("");
  const [consoleResults, setConsoleResults] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "console">("desc");

  useEffect(() => {
    async function loadChallenge() {
      try {
        const res = await fetch(`/api/challenges?id=${encodeURIComponent(challengeId)}`);
        if (res.ok) {
          const data = await res.json();
          setChallenge(data);
          setCode(data.starterCode);
        } else {
          // Fall back to local PROBLEM_DB config
          const localData = PROBLEM_DB[challengeId];
          if (localData) {
            setChallenge(localData);
            setCode(localData.starterCode);
          }
        }
      } catch (err) {
        console.error("Failed to load challenge from API, falling back to local PROBLEM_DB", err);
        const localData = PROBLEM_DB[challengeId];
        if (localData) {
          setChallenge(localData);
          setCode(localData.starterCode);
        }
      }
    }
    loadChallenge();
  }, [challengeId]);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-400 flex items-center justify-center text-xs animate-pulse">
        Challenge data sheet not found...
      </div>
    );
  }

  const handleRunCode = async () => {
    setRunning(true);
    setActiveTab("console");
    try {
      const res = await fetch("/api/coding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          testCases: challenge.testCases,
          functionName: challenge.functionName
        })
      });
      const data = await res.json();
      setConsoleResults(data);
    } catch (e) {
      console.error("Code runner failed:", e);
      setConsoleResults({ success: false, message: "Server sandbox is temporarily unreachable." });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-64px)] relative z-10 overflow-hidden">
        
        {/* Left Side: Instructions Panel */}
        <div className="w-full lg:w-1/2 border-r border-slate-800 bg-slate-950/40 p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header tags */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                onClick={() => router.push("/coding")}
                className="text-xs text-slate-500 hover:text-white flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>All problems</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                  challenge.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  challenge.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {challenge.difficulty}
                </span>
                <span className="text-[10px] text-brand-cyan font-bold uppercase">{challenge.category}</span>
              </div>
            </div>

            {/* Description content */}
            <div className="prose prose-invert prose-xs leading-relaxed max-w-none text-xs text-slate-300 font-normal">
              <h2 className="text-lg font-extrabold text-white mb-3">{challenge.title}</h2>
              
              {/* Render simple markdown layout */}
              <div className="space-y-4 whitespace-pre-wrap">
                {challenge.description}
              </div>
            </div>

          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center space-x-1.5">
            <BookOpen className="h-4 w-4" />
            <span>Ensure function signatures match starter code to run test cases.</span>
          </div>
        </div>

        {/* Right Side: Editor & Console Split */}
        <div className="w-full lg:w-1/2 flex flex-col h-full bg-[#030014]">
          
          {/* Top Panel: Monaco Editor */}
          <div className="flex-grow relative h-3/5 border-b border-slate-800">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between z-10 relative">
              <span className="text-[10px] font-semibold text-slate-400 font-mono">index.js</span>
              
              <button
                onClick={handleRunCode}
                disabled={running}
                className="rounded bg-brand-cyan hover:brightness-110 disabled:opacity-40 px-3.5 py-1 text-[10px] font-bold text-white flex items-center space-x-1 transition-all active:scale-95"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{running ? "Running tests..." : "Run Code"}</span>
              </button>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-9">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  fontFamily: "'Geist Mono', Courier, monospace",
                  lineNumbers: "on",
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Bottom Panel: Output Console */}
          <div className="h-2/5 bg-slate-950 flex flex-col">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("desc")}
                className={`text-[10px] font-bold uppercase tracking-wider pb-1 pt-1 focus:outline-none transition-colors ${
                  activeTab === "desc" ? "text-brand-cyan border-b-2 border-brand-cyan" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab("console")}
                className={`text-[10px] font-bold uppercase tracking-wider pb-1 pt-1 focus:outline-none transition-colors ${
                  activeTab === "console" ? "text-brand-cyan border-b-2 border-brand-cyan" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Console Outputs
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px]">
              {activeTab === "desc" ? (
                /* Static testcases listings */
                <div className="space-y-3">
                  {challenge.testCases.map((tc, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-lg">
                      <p className="text-slate-500 mb-1">Test Case #{idx + 1} {tc.isHidden && "(Hidden Case)"}</p>
                      <p className="text-slate-300"><span className="text-brand-purple">Input:</span> {tc.input}</p>
                      <p className="text-slate-300"><span className="text-brand-cyan">Expected:</span> {tc.expectedOutput}</p>
                    </div>
                  ))}
                </div>
              ) : (
                /* Run outputs logs */
                <div>
                  {!consoleResults ? (
                    <div className="text-slate-600 text-center py-6">
                      Click "Run Code" to view sandbox outputs.
                    </div>
                  ) : !consoleResults.success ? (
                    <div className="text-red-400 p-2 border border-red-500/20 bg-red-500/5 rounded">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      {consoleResults.message}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Overall badge */}
                      <div className={`p-3 rounded-lg border ${
                        consoleResults.allPassed 
                          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
                          : "border-rose-500/20 bg-rose-500/5 text-rose-400"
                      }`}>
                        <p className="font-bold">
                          {consoleResults.allPassed ? "✓ All Tests Passed!" : "✗ Test Suite Failures Detected"}
                        </p>
                        <p className="text-[10px] mt-0.5">
                          Passed {consoleResults.passedCount} out of {consoleResults.totalCount} cases.
                        </p>
                      </div>

                      {/* Cases detailed */}
                      <div className="space-y-2">
                        {consoleResults.results.map((res: any) => (
                          <div
                            key={res.id}
                            className={`p-2.5 border rounded-lg ${
                              res.passed ? "border-slate-800 bg-slate-900/40" : "border-rose-950 bg-rose-950/10"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-slate-500">Case #{res.id}</span>
                              <span className="flex items-center space-x-1">
                                {res.passed ? (
                                  <>
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 text-[9px] uppercase font-bold">Passed</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3.5 w-3.5 text-rose-400" />
                                    <span className="text-rose-400 text-[9px] uppercase font-bold">Failed</span>
                                  </>
                                )}
                              </span>
                            </div>
                            
                            {res.error ? (
                              <p className="text-rose-400 text-[10px] whitespace-pre-wrap">{res.error}</p>
                            ) : (
                              <div className="space-y-0.5 text-[10px] text-slate-300">
                                <p><span className="text-slate-500">Actual:</span> {res.actual}</p>
                                <p><span className="text-slate-500">Expected:</span> {res.expected}</p>
                              </div>
                            )}

                            {/* Console logs nested */}
                            {res.logs && res.logs.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-800/40 text-[9px] text-slate-500">
                                <p className="font-bold uppercase tracking-wider text-[8px] mb-0.5">Console Output:</p>
                                {res.logs.map((log: string, lIdx: number) => (
                                  <p key={lIdx} className="text-slate-400">{log}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
