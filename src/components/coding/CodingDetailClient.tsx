"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Terminal, Play, CheckCircle, XCircle, ChevronLeft, BookOpen, AlertTriangle } from "lucide-react";

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface ChallengeData {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  starterCode: string;
  functionName: string;
  testCases: TestCase[];
}

interface CodingDetailClientProps {
  challenge: ChallengeData;
}

export default function CodingDetailClient({ challenge }: CodingDetailClientProps) {
  const router = useRouter();
  const [code, setCode] = useState(challenge.starterCode);
  const [consoleResults, setConsoleResults] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "console">("desc");

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
    <>
      {/* Left Side: Instructions Panel */}
      <div className="w-full lg:w-1/2 border-r border-slate-800 bg-slate-950/40 p-6 overflow-y-auto flex flex-col justify-between h-[calc(100vh-64px)]">
        <div className="space-y-6 text-left">
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
          <div className="prose prose-invert prose-xs leading-relaxed max-w-none text-xs text-slate-350 font-normal">
            <h2 className="text-lg font-extrabold text-white mb-3">{challenge.title}</h2>
            <div className="space-y-4 whitespace-pre-wrap leading-relaxed text-slate-400">
              {challenge.description}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center space-x-1.5 text-left">
          <BookOpen className="h-4 w-4" />
          <span>Ensure function signatures match starter code to run test cases.</span>
        </div>
      </div>

      {/* Right Side: Editor & Console Split */}
      <div className="w-full lg:w-1/2 flex flex-col h-[calc(100vh-64px)] bg-[#030014]">
        {/* Top Panel: Monaco Editor */}
        <div className="flex-grow relative h-3/5 border-b border-slate-800">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between z-10 relative">
            <span className="text-[10px] font-semibold text-slate-400 font-mono">index.js</span>
            
            <button
              onClick={handleRunCode}
              disabled={running}
              className="rounded bg-brand-cyan hover:brightness-110 disabled:opacity-40 px-3.5 py-1 text-[10px] font-bold text-white flex items-center space-x-1 transition-all active:scale-95 cursor-pointer"
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
              className={`text-[10px] font-bold uppercase tracking-wider pb-1 pt-1 focus:outline-none transition-colors cursor-pointer ${
                activeTab === "desc" ? "text-brand-cyan border-b-2 border-brand-cyan" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setActiveTab("console")}
              className={`text-[10px] font-bold uppercase tracking-wider pb-1 pt-1 focus:outline-none transition-colors cursor-pointer ${
                activeTab === "console" ? "text-brand-cyan border-b-2 border-brand-cyan" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Console Outputs
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] text-left">
            {activeTab === "desc" ? (
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
    </>
  );
}
