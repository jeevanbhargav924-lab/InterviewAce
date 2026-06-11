"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Terminal, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Play, 
  Sparkles, 
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Layers,
  Code,
  Crown
} from "lucide-react";
import AdPlaceholder from "../shared/AdPlaceholder";
import { FREE_BETA } from "@/lib/config";

interface BlogPreview {
  title: string;
  slug: string;
  summary: string;
  category: string;
  coverImage: string;
}

interface LandingClientProps {
  initialBlogs: BlogPreview[];
}

export default function LandingClient({ initialBlogs }: LandingClientProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // States for Interactive Demos
  const [demoTopic, setDemoTopic] = useState("React Developer");
  const [demoMessages, setDemoMessages] = useState<Array<{role: string, content: string}>>([
    { role: "interviewer", content: "Great! Let's start. Can you explain the difference between functional components with hooks and class components in React?" }
  ]);
  const [demoInput, setDemoInput] = useState("");
  const [demoIsTyping, setDemoIsTyping] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);

  // Resume Analyzer Demo State
  const [resumeText, setResumeText] = useState("");
  const [analyzedScore, setAnalyzedScore] = useState<number | null>(null);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim()) return;

    const userMsg = demoInput;
    setDemoMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setDemoInput("");
    setDemoIsTyping(true);

    setTimeout(() => {
      setDemoIsTyping(false);
      if (demoMessages.length >= 2) {
        setDemoMessages(prev => [...prev, {
          role: "interviewer",
          content: "Excellent response. Your point about hook lifecycle mapping is spot on. That concludes our quick demo! Log in to experience full voice support, score evaluations, and customized dashboards."
        }]);
        setDemoCompleted(true);
      } else {
        setDemoMessages(prev => [...prev, {
          role: "interviewer",
          content: "Good summary. Next, how do you handle state optimization to prevent unnecessary re-renders in a deep component tree?"
        }]);
      }
    }, 1500);
  };

  const handleAnalyzeResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    
    // Simulate ATS reading
    const lowerText = resumeText.toLowerCase();
    let score = 50;
    if (lowerText.includes("react")) score += 10;
    if (lowerText.includes("typescript")) score += 10;
    if (lowerText.includes("next.js")) score += 10;
    if (lowerText.includes("node.js")) score += 10;
    if (lowerText.includes("optimized")) score += 5;
    if (lowerText.includes("led")) score += 5;

    setAnalyzedScore(Math.min(100, score));
  };

  const categories = [
    { name: "React", count: "120+ Questions", slug: "react", desc: "Hooks, fiber engine, reconciliation, state patterns." },
    { name: "React Native", count: "85+ Questions", slug: "react-native", desc: "Bridges, Fabric UI engine, layout offsets, JSI execution." },
    { name: "JavaScript", count: "150+ Questions", slug: "javascript", desc: "Prototypes, closures, scope chains, event loops." },
    { name: "TypeScript", count: "95+ Questions", slug: "typescript", desc: "Generics, declaration merging, strict validation rules." },
    { name: "Next.js", count: "75+ Questions", slug: "nextjs", desc: "App router routing, SSR caching, Static params, schemas." },
    { name: "Node.js", count: "110+ Questions", slug: "nodejs", desc: "Thread pools, non-blocking I/O event loops, stream feeds." },
    { name: "HR Interview", count: "60+ Questions", slug: "hr-interview", desc: "STAR behavioral answers, salary negotiations, leadership." }
  ];

  const faqs = [
    { q: "How does the AI Mock Interview system grade my answers?", a: "Our AI evaluates your verbal transcripts or typed replies across three specific core vectors: Technical accuracy (matching engineering specifications), Communication skill (articulating architecture designs concisely), and Confidence (speech pace, placeholder word metrics)." },
    { q: "Can I use the resume analyzer for multiple job descriptions?", a: "Yes! The dashboard allows you to paste the specific job description alongside your resume upload. Our ATS parser matches details and recommends exact keywords to add to maximize your callback rate." },
    { q: "Do you support standard DSA compiler evaluations?", a: "Yes. Our Coding Challenges page features a robust Monaco editor and sandboxed runtime engine that executes code against hidden test suites, providing real-time runtime pass/fail logs." },
    { q: "How does the free trial work?", a: "We are currently offering a 3-month free trial for all new accounts. You get unlimited access to mock interviews, coding sandboxes, and ATS resume scoring without needing a credit card." }
  ];

  return (
    <div className="relative">
      
      {/* Radial overlay */}
      <div className="absolute inset-x-0 top-0 h-[800px] glow-overlay pointer-events-none" />
      
      <div className="grid-mesh absolute inset-0 opacity-40 pointer-events-none" />

      {/* AD PLACEMENT: HEADER ADS */}
      <div className="py-4">
        <AdPlaceholder position="header" />
      </div>

      {/* 1. Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-semibold text-brand-purple border border-brand-purple/20">
            <Sparkles className="h-3 w-3" />
            <span>Next-Generation AI Interview Sandbox</span>
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Land Your Dream Tech Role <br />
            With <span className="text-gradient-purple-cyan font-black">InterviewAce.AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Ace technical rounds, system design screenings, DSA boards, and HR behavioral loops. Simulate live verbal chats and analyze your resume ATS scoring.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan px-6 py-3.5 text-base font-semibold text-white shadow-xl hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              Get Started for Free
            </Link>
            <Link
              href="/mock-interview"
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-base font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center space-x-2"
            >
              <span>Try Live AI Demo</span>
              <Play className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border border-slate-800/80 bg-slate-955/40 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="text-center space-y-1">
              <p className="text-2xl font-black text-white bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">1,000+</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Interview Questions</p>
            </div>
            <div className="text-center space-y-1 border-l border-slate-800/50">
              <p className="text-2xl font-black text-white bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">200+</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Technical Articles</p>
            </div>
            <div className="text-center space-y-1 border-l border-slate-800/50">
              <p className="text-2xl font-black text-white bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">50+</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Learning Paths</p>
            </div>
            <div className="text-center space-y-1 border-l border-slate-800/50">
              <p className="text-2xl font-black text-white bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">15K+</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simulations Done</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Trusted By logos */}
      <section className="py-8 border-y border-slate-200/10 bg-slate-950/40 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-500">
            Trusted by candidates hired at leading organizations
          </p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-40">
            {["Google", "Microsoft", "Meta", "Amazon", "Netflix", "Stripe"].map((brand) => (
              <span key={brand} className="text-sm font-black tracking-widest text-slate-300">
                {brand.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need in one powerful ecosystem
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400 text-sm">
            Stop juggling multiple prep tools. Master programming interviews, optimize resumes, and run code sandbox workflows.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Voice Mock Interviews",
              desc: "Simulate live verbal tech panels. Talk directly into your microphone, receive live follow-ups, and receive scorecards covering tech skills and pacing.",
              icon: Cpu,
            },
            {
              title: "Sandboxed Coding Challenges",
              desc: "Write JS & DSA answers inside an integrated Monaco Editor. Run test suites locally in the browser runtime.",
              icon: Terminal,
            },
            {
              title: "ATS Resume Optimization",
              desc: "Upload your resume, analyze keywords, match target descriptions, calculate scoring index, and receive bullet adjustments.",
              icon: FileText,
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-glass rounded-xl p-6 border border-slate-800 flex flex-col hover:border-brand-purple/40 hover:-translate-y-1 transition-all duration-300 glow-card"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-brand-purple/20 to-brand-cyan/20 flex items-center justify-center border border-brand-purple/30 mb-6">
                  <Icon className="h-6 w-6 text-brand-cyan" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">{feat.desc}</p>
                <Link
                  href="/register"
                  className="mt-auto text-xs font-semibold text-brand-purple hover:text-brand-cyan inline-flex items-center space-x-1"
                >
                  <span>Learn more</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interview Categories */}
      <section className="py-16 bg-slate-950/20 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Targeted Categories & Question Cards</h2>
            <p className="text-slate-400 text-xs mt-2">Pick a category to begin drills across easy, medium, and hard modes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/questions/${cat.slug}`}
                className="bg-glass rounded-lg p-5 border border-slate-800 hover:border-brand-cyan/30 flex flex-col justify-between hover:bg-slate-900/40 transition-all duration-200 text-left"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-white">{cat.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{cat.count}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{cat.desc}</p>
                </div>
                <span className="text-[10px] text-brand-cyan mt-4 font-semibold inline-flex items-center space-x-1">
                  <span>Start Practice</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4b. Featured Learning Paths */}
      <section className="py-16 border-t border-slate-900 bg-[#030014] relative z-10 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Featured Learning Paths</h2>
            <p className="text-slate-400 text-xs mt-2">Structured engineering curriculum to scale from junior engineer to systems architect.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Frontend Architect Path",
                desc: "Master layout performance, state design patterns, components compilation, interfaces design, and SEO audits.",
                techs: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Next.js"],
                color: "from-brand-purple/20 to-brand-cyan/20 border-brand-purple/30"
              },
              {
                title: "Backend Scalability Path",
                desc: "Learn express logic, single-threaded event loops concurrency, cluster sharding, caching, and clean scaling models.",
                techs: ["JavaScript", "TypeScript", "Node.js", "Express", "MongoDB", "Redis"],
                color: "from-brand-cyan/20 to-brand-purple/20 border-brand-cyan/30"
              },
              {
                title: "Mobile Dev Architect Path",
                desc: "Deep dive into React Native bridge modules, thread execution models, synchronization channels, and local caches.",
                techs: ["React", "TypeScript", "React Native", "Fabric", "JSI", "Native Bridges"],
                color: "from-brand-purple/20 to-brand-cyan/20 border-brand-purple/30"
              }
            ].map((path, idx) => (
              <div
                key={idx}
                className={`bg-glass rounded-2xl p-6 border ${path.color} flex flex-col justify-between hover:scale-[1.01] transition-all`}
              >
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">{path.title}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">{path.desc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/40">
                  {path.techs.map((tech) => (
                    <span key={tech} className="text-[8px] text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4c. Latest & Trending Interview Questions */}
      <section className="py-16 border-t border-slate-900 bg-slate-950/20 relative z-10 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Latest & Trending Questions</h2>
            <p className="text-slate-400 text-xs mt-2">Drill technical concepts on recently asked candidate sheets from major tech firms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                question: "What is the Virtual DOM and how does React use it to render pages?",
                category: "React",
                slug: "what-is-virtual-dom",
                difficulty: "easy"
              },
              {
                question: "Explain the Event Loop in Node.js and its phases.",
                category: "Node.js",
                slug: "what-is-event-loop",
                difficulty: "hard"
              },
              {
                question: "How do you optimize FlatList rendering performance in React Native?",
                category: "React Native",
                slug: "what-is-flatlist",
                difficulty: "hard"
              },
              {
                question: "What is the difference between interfaces and type aliases in TypeScript?",
                category: "TypeScript",
                slug: "interface-vs-type",
                difficulty: "easy"
              }
            ].map((q, idx) => (
              <Link
                key={idx}
                href={`/questions/${q.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${q.slug}`}
                className="bg-glass border border-slate-800 hover:border-brand-purple/40 rounded-xl p-5 hover:bg-slate-900/10 flex flex-col justify-between transition-all"
              >
                <div>
                  <span className="inline-block text-[8px] font-black uppercase bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2 py-0.5 rounded mb-2">
                    {q.category}
                  </span>
                  <h3 className="text-xs font-bold text-slate-200 leading-snug">{q.question}</h3>
                </div>
                <div className="text-[10px] text-brand-cyan font-bold hover:underline mt-4 pt-3 border-t border-slate-800/40 inline-flex items-center space-x-0.5">
                  <span>Practice Card</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AD PLACEMENT: SIDEBAR / MIDDLE ADS PLACED NEXT TO THE LIVE DEMO */}
      <section className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* 5. AI Mock Interview Demo */}
        <div className="lg:col-span-2 bg-glass rounded-2xl p-6 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Live AI Interview Console (Demo)</h3>
            </div>
            <select
              value={demoTopic}
              onChange={(e) => {
                setDemoTopic(e.target.value);
                setDemoMessages([{ role: "interviewer", content: `Great! Let's start. Can you explain the difference between functional components with hooks and class components in ${e.target.value}?` }]);
                setDemoCompleted(false);
              }}
              className="rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 focus:outline-none"
            >
              <option>React Developer</option>
              <option>JavaScript Developer</option>
              <option>MERN Stack Developer</option>
            </select>
          </div>

          {/* Transcript Screen */}
          <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-3 p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            {demoMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "interviewer" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    m.role === "interviewer"
                      ? "bg-slate-900 border border-slate-800 text-slate-300"
                      : "bg-brand-purple text-white"
                  }`}
                >
                  <p className="font-semibold text-[10px] mb-0.5 opacity-60">
                    {m.role === "interviewer" ? "AI Interviewer" : "You (Demo Candidate)"}
                  </p>
                  <p>{m.content}</p>
                </div>
              </div>
            ))}
            {demoIsTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-500 animate-pulse">
                  AI Interviewer is analyzing response...
                </div>
              </div>
            )}
          </div>

          {/* Form console input */}
          <form onSubmit={handleDemoSubmit} className="mt-4 flex space-x-2">
            <input
              type="text"
              value={demoInput}
              disabled={demoCompleted || demoIsTyping}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder={demoCompleted ? "Demo complete! Sign up to start full drills." : "Type your answer here..."}
              className="flex-1 rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-brand-cyan focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={demoCompleted || demoIsTyping || !demoInput.trim()}
              className="rounded bg-brand-cyan hover:brightness-110 px-4 py-2 text-xs font-semibold text-white active:scale-95 transition-all disabled:opacity-50"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Ad block side wrapper */}
        <div className="flex items-center justify-center">
          <AdPlaceholder position="sidebar" />
        </div>
      </section>

      {/* 6. Resume Analyzer Demo & 7. Coding Challenges preview */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Resume Analyzer Mock */}
        <div className="bg-glass rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-brand-purple" />
              <span>Free ATS Resume Matcher</span>
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Paste your resume profile or experience summary below to test how it scores against critical industry engineering keywords.
            </p>
            <form onSubmit={handleAnalyzeResume} className="space-y-3">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste resume details... (e.g. Developed apps in React, worked on TypeScript, styled with Tailwind CSS.)"
                rows={5}
                className="w-full rounded bg-slate-900 border border-slate-800 p-3 text-xs text-white placeholder-slate-600 focus:border-brand-purple focus:outline-none"
              />
              <button
                type="submit"
                disabled={!resumeText.trim()}
                className="w-full rounded bg-brand-purple hover:brightness-110 py-2.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
              >
                Analyze ATS Match Score
              </button>
            </form>
          </div>

          {analyzedScore !== null && (
            <div className="mt-5 p-4 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Estimated ATS score</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Recommended score is 80+ to bypass HR screening filters.</p>
              </div>
              <div className="text-center">
                <span className={`text-2xl font-black ${analyzedScore >= 80 ? "text-emerald-400" : analyzedScore >= 60 ? "text-amber-400" : "text-rose-400"}`}>
                  {analyzedScore}%
                </span>
                <span className="block text-[8px] text-slate-500 font-semibold uppercase mt-0.5">Rating</span>
              </div>
            </div>
          )}
        </div>

        {/* Coding Challenge Preview */}
        <div className="bg-glass rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-brand-cyan" />
              <span>Algorithmic Sandbox Editor</span>
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Practice solving critical data structures algorithms (DSA) and frontend tasks inside our browser IDE with real-time test runs.
            </p>
            
            {/* Editor visual mockup */}
            <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-300">
              <p className="text-slate-500">{"// Challenge: Reverse a Linked List"}</p>
              <p className="text-slate-400"><span className="text-brand-purple">function</span> <span className="text-brand-cyan">reverseList</span>(head) &#123;</p>
              <p className="pl-4 text-slate-400"><span className="text-brand-purple">let</span> prev = <span className="text-brand-pink">null</span>;</p>
              <p className="pl-4 text-slate-400"><span className="text-brand-purple">let</span> curr = head;</p>
              <p className="pl-4 text-slate-400"><span className="text-brand-purple">while</span> (curr) &#123;</p>
              <p className="pl-8 text-slate-500">{"// Traverse and reverse pointers..."}</p>
              <p className="pl-4">&#125;</p>
              <p className="pl-4 text-brand-purple">return <span className="text-slate-300">prev;</span></p>
              <p>&#125;</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-medium">Test suite includes React testing & JS benchmarks.</span>
            <Link
              href="/coding"
              className="rounded bg-slate-900 border border-slate-800 px-4.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all inline-flex items-center space-x-1"
            >
              <span>Explore Code Runner</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </section>

      {/* 8. Blog Section */}
      <section className="py-16 bg-slate-950/30 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Insights & Interview Blueprints</h2>
              <p className="text-slate-400 text-xs mt-1">Read technical articles and career strategy updates compiled by recruiters.</p>
            </div>
            <Link
              href="/blog"
              className="mt-4 md:mt-0 text-xs font-semibold text-brand-cyan hover:underline inline-flex items-center space-x-1"
            >
              <span>Read all articles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initialBlogs.map((blog, idx) => (
              <article
                key={idx}
                className="bg-glass rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col h-full"
              >
                <div className="h-44 w-full bg-slate-900 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
                  <span className="absolute top-3 left-3 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                    {blog.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-brand-cyan transition-colors">
                        {blog.title}
                      </Link>
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 mb-4">{blog.summary}</p>
                  </div>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs text-brand-purple hover:text-brand-cyan font-bold inline-flex items-center space-x-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Pricing Section */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10" id="pricing">
        <div className="bg-gradient-to-tr from-brand-purple/20 via-slate-900/80 to-brand-cyan/20 rounded-2xl p-8 md:p-12 border border-brand-purple/40 text-center max-w-3xl mx-auto shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-[10px] px-3.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
            Free Trial Access
          </span>
          <Crown className="h-10 w-10 text-brand-cyan mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">3-Month Free Trial</h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed mb-6">
            Enjoy unlimited AI Mock Interviews, full ATS Resume checks, and complete access to all 200+ interview prep cards. No credit card required to get started.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <div className="flex items-center space-x-2 text-xs text-slate-350">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>No Paywalls</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-350">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Unlimited AI Audits</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-350">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Monaco Code Runner</span>
            </div>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan px-8 py-3.5 text-sm font-bold text-white shadow-xl hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Create Your Free Account Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="py-16 bg-slate-950/20 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Success Stories</h2>
            <p className="text-slate-400 text-xs mt-2">Hear from candidates who cleared interview bars using our AI platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The voice mock interview simulator is incredibly realistic. It felt like talking to a real engineering manager, and the scores helped me pace myself. Cleared my meta loop!",
                name: "Devon Lane",
                role: "React Engineer at Vercel",
                stars: 5
              },
              {
                quote: "Loved the ATS resume keyword matcher. I was sending resumes for 2 months with zero callbacks. Added the missing keywords recommended by the analyzer and got 3 calls in one week.",
                name: "Kristin Watson",
                role: "Frontend Developer at Stripe",
                stars: 5
              },
              {
                quote: "The Next.js and System Design question cards are top tier. Answers are detailed, structured, and easy to memorize. This was my core prep playbook.",
                name: "Amir Al-Otaibi",
                role: "Senior Software Engineer at AWS",
                stars: 5
              }
            ].map((t, i) => (
              <div key={i} className="bg-glass rounded-xl p-6 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex space-x-1 text-amber-400 mb-4">
                    {[...Array(t.stars)].map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="mt-6 flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                    {t.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ Accordion */}
      <section className="py-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl flex items-center justify-center space-x-2">
            <HelpCircle className="h-6 w-6 text-brand-purple" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-slate-400 text-xs mt-2">Get answers to quick questions about our AI platform features.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-glass rounded-lg border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4.5 text-left text-xs font-semibold text-white focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="p-4.5 pt-0 text-xs text-slate-400 border-t border-slate-800/40 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 12. CTA Section */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-tr from-brand-purple/20 via-brand-cyan/10 to-slate-900/60 rounded-3xl p-8 md:p-12 border border-brand-purple/35 text-center relative overflow-hidden shadow-[0_0_35px_rgba(139,92,246,0.1)]">
          <div className="absolute inset-0 grid-mesh opacity-20 pointer-events-none" />
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to clear your technical rounds?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300 text-sm">
            Sign up now and join thousands of engineers scaling their careers using AI-guided training loops.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan px-6 py-3 text-sm font-semibold text-white shadow-xl hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* AD PLACEMENT: FOOTER ADS */}
      <div className="py-6">
        <AdPlaceholder position="footer" />
      </div>

    </div>
  );
}
