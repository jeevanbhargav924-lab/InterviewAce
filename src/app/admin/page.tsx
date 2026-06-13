"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Settings, Users, DollarSign, Database, BookOpen, AlertCircle, PlusCircle, LayoutGrid, Trash2, ShieldAlert } from "lucide-react";

interface AnalyticsData {
  metrics: {
    totalUsers: number;
    premiumUsers: number;
    totalInterviews: number;
    totalResumes: number;
    estimatedRevenue: number;
  };
  monthlyRevenue: Array<{ name: string; revenue: number; users: number }>;
  recentSignups: Array<{ name: string; email: string; subscription: { plan: string }; createdAt: string }>;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Admin login states
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState("");
  const [adminLogging, setAdminLogging] = useState(false);

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"charts" | "questions" | "blogs" | "coding" | "ads">("charts");

  // Form states for adding new interview questions
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("React");
  const [newDifficulty, setNewDifficulty] = useState("medium");
  const [newTags, setNewTags] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [bulkJson, setBulkJson] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [blogUploadMode, setBlogUploadMode] = useState<"single" | "bulk">("single");
  const [blogBulkJson, setBlogBulkJson] = useState("");
  const [blogBulkError, setBlogBulkError] = useState("");
  const [codingUploadMode, setCodingUploadMode] = useState<"single" | "bulk">("single");
  const [codingBulkJson, setCodingBulkJson] = useState("");
  const [codingBulkError, setCodingBulkError] = useState("");

  // Form states for adding new blog posts
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogSummary, setNewBlogSummary] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("React");
  const [newBlogTags, setNewBlogTags] = useState("");
  const [newBlogCoverImage, setNewBlogCoverImage] = useState("");
  const [newBlogAuthorName, setNewBlogAuthorName] = useState("");
  const [blogFormSuccess, setBlogFormSuccess] = useState(false);

  // Form states for adding new coding challenges
  const [codingTitle, setCodingTitle] = useState("");
  const [codingDesc, setCodingDesc] = useState("");
  const [codingCategory, setCodingCategory] = useState("DSA");
  const [codingDifficulty, setCodingDifficulty] = useState("medium");
  const [codingStarter, setCodingStarter] = useState("");
  const [codingFuncName, setCodingFuncName] = useState("");
  const [codingTags, setCodingTags] = useState("");
  const [codingSuccess, setCodingSuccess] = useState(false);
  const [testCases, setTestCases] = useState<Array<{ input: string; expectedOutput: string; isHidden: boolean }>>([
    { input: "", expectedOutput: "", isHidden: false }
  ]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const data = await res.json();
          if (data && data.metrics && Array.isArray(data.recentSignups) && Array.isArray(data.monthlyRevenue)) {
            setAnalytics(data);
          } else {
            setAnalytics(null);
          }
        } else {
          setAnalytics(null);
        }
      } catch (err) {
        console.error("Failed to load admin analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErr("");
    setAdminLogging(true);
    try {
      const res = await signIn("credentials", {
        email: adminEmail,
        password: adminPass,
        redirect: false
      });
      if (res?.error) {
        setAdminErr(res.error || "Incorrect admin credentials.");
      } else {
        router.refresh();
      }
    } catch (err) {
      setAdminErr("Failed to connect to authentication endpoints.");
    } finally {
      setAdminLogging(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(false);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newQuestion,
          answer: newAnswer,
          category: newCategory,
          difficulty: newDifficulty,
          tags: newTags.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        setFormSuccess(true);
        setNewQuestion("");
        setNewAnswer("");
        setNewTags("");
      }
    } catch (e) {
      console.error("Failed to append question:", e);
    }
  };

  const handleAddBulkQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(false);
    setBulkError("");

    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) {
        setBulkError("Input must be a JSON array of question objects.");
        return;
      }

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess(true);
        setBulkJson("");
      } else {
        setBulkError(data.message || "Failed to upload bulk questions.");
      }
    } catch (err: any) {
      setBulkError("Invalid JSON format. Please double-check your syntax.");
      console.error("Failed to parse bulk JSON:", err);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogFormSuccess(false);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newBlogTitle,
          summary: newBlogSummary,
          content: newBlogContent,
          category: newBlogCategory,
          tags: newBlogTags.split(",").map(t => t.trim()).filter(Boolean),
          coverImage: newBlogCoverImage || undefined,
          author: newBlogAuthorName ? {
            name: newBlogAuthorName,
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
            bio: "Platform Author"
          } : undefined
        })
      });

      if (res.ok) {
        setBlogFormSuccess(true);
        setNewBlogTitle("");
        setNewBlogSummary("");
        setNewBlogContent("");
        setNewBlogTags("");
        setNewBlogCoverImage("");
        setNewBlogAuthorName("");
      }
    } catch (e) {
      console.error("Failed to post blog:", e);
    }
  };

  const handleAddBulkBlogs = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogFormSuccess(false);
    setBlogBulkError("");

    try {
      const parsed = JSON.parse(blogBulkJson);
      if (!Array.isArray(parsed)) {
        setBlogBulkError("Input must be a JSON array of blog post objects.");
        return;
      }

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });

      const data = await res.json();
      if (res.ok) {
        setBlogFormSuccess(true);
        setBlogBulkJson("");
      } else {
        setBlogBulkError(data.message || "Failed to upload bulk blogs.");
      }
    } catch (err: any) {
      setBlogBulkError("Invalid JSON format. Please double-check your syntax.");
      console.error("Failed to parse bulk JSON:", err);
    }
  };

  const handleAddCodingChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodingSuccess(false);

    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: codingTitle,
          description: codingDesc,
          category: codingCategory,
          difficulty: codingDifficulty,
          starterCode: codingStarter,
          functionName: codingFuncName,
          testCases: testCases.filter(tc => tc.input && tc.expectedOutput),
          companyTags: codingTags.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        setCodingSuccess(true);
        setCodingTitle("");
        setCodingDesc("");
        setCodingStarter("");
        setCodingFuncName("");
        setCodingTags("");
        setTestCases([{ input: "", expectedOutput: "", isHidden: false }]);
      }
    } catch (err) {
      console.error("Failed to post coding challenge:", err);
    }
  };

  const handleAddBulkCoding = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodingSuccess(false);
    setCodingBulkError("");

    try {
      const parsed = JSON.parse(codingBulkJson);
      if (!Array.isArray(parsed)) {
        setCodingBulkError("Input must be a JSON array of coding challenge objects.");
        return;
      }

      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });

      const data = await res.json();
      if (res.ok) {
        setCodingSuccess(true);
        setCodingBulkJson("");
      } else {
        setCodingBulkError(data.message || "Failed to upload bulk challenges.");
      }
    } catch (err: any) {
      setCodingBulkError("Invalid JSON format. Please double-check your syntax.");
      console.error("Failed to parse bulk JSON:", err);
    }
  };

  const handleTestCaseChange = (index: number, field: string, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "", isHidden: false }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, idx) => idx !== index));
    }
  };

  const isAdmin = session?.user && (session.user as any).role === "admin";

  if (status === "loading" || (loading && isAdmin)) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-400 flex items-center justify-center text-xs animate-pulse">
        Polling admin telemetry channels...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-300 flex flex-col items-center justify-center relative px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08)_0%,_transparent_60%)] pointer-events-none" />
        <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10 text-left">
          
          <div className="text-center mb-8">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-black text-sm mx-auto mb-3">
              A
            </span>
            <h2 className="text-xl font-bold text-white flex items-center justify-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-brand-purple" />
              <span>Admin Credentials Gate</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">This panel is locked. Please enter supervisor credentials to continue.</p>
          </div>

          {adminErr && (
            <div className="mb-4 rounded bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
              {adminErr}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-500 uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="supervisor@domain.com"
                className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:border-brand-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-500 uppercase mb-1.5">Secret Password</label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:border-brand-purple focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={adminLogging}
              className="w-full rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-3 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              {adminLogging ? "Unlocking Access..." : "Unlock Dashboard"}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link href="/" className="text-[10px] text-slate-500 hover:text-white transition-colors">
              Return to Website homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-805 mb-8">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center space-x-2">
              <Settings className="h-6 w-6 text-brand-purple" />
              <span>Admin Management Hub</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Review SaaS revenue streams, compile question decks, and track ad blocks placements.</p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            {[
              { id: "charts", label: "Analytics & Charts", icon: LayoutGrid },
              { id: "questions", label: "Manage Questions", icon: Database },
              { id: "blogs", label: "Manage Blogs", icon: BookOpen },
              { id: "coding", label: "DSA & Coding", icon: PlusCircle },
              { id: "ads", label: "Ad placements", icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-purple text-white shadow-lg"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Active Registrations", val: analytics.metrics.totalUsers, icon: Users, desc: "Candidates in database" },
              { title: "Monthly Active Subs", val: analytics.metrics.premiumUsers, icon: DollarSign, desc: "Upgrade conversion count" },
              { title: "Interviews Simulated", val: analytics.metrics.totalInterviews, icon: Database, desc: "Completed voice/text loops" },
              { title: "Estimated Earnings", val: `$${analytics.metrics.estimatedRevenue}`, icon: DollarSign, desc: "Aggregated billing volume" }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="bg-glass border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">{card.title}</span>
                    <Icon className="h-4.5 w-4.5 text-brand-cyan" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-none">{card.val}</h3>
                    <p className="text-[9px] text-slate-600 mt-1">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Sub-Screens */}
        {activeTab === "charts" && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sales Chart using Recharts */}
            <div className="lg:col-span-2 bg-glass border border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Estimated Income Trends (Stripe telemetry)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyRevenue}>
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", fontSize: "10px" }} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Signups list */}
            <div className="bg-glass border border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Recent User Signups</h3>
              <div className="space-y-3.5">
                {analytics.recentSignups.map((usr, idx) => (
                  <div key={idx} className="pb-3 border-b border-slate-800/40 last:border-b-0 last:pb-0 flex justify-between items-center text-[10px]">
                    <div>
                      <p className="font-bold text-white">{usr.name}</p>
                      <p className="text-slate-500">{usr.email}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 font-bold uppercase tracking-wider ${
                      usr.subscription.plan === "premium" ? "bg-amber-500/10 text-amber-400" : "bg-slate-850 text-slate-500"
                    }`}>
                      {usr.subscription.plan}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === "questions" && (
          <div className="bg-glass border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center space-x-1.5">
              <PlusCircle className="h-5 w-5 text-brand-cyan" />
              <span>Manage Preparation Cards</span>
            </h3>

            {formSuccess && (
              <div className="mb-4 rounded bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-400">
                {uploadMode === "single" 
                  ? "New interview prep card successfully registered in database!" 
                  : "Batch of prep cards successfully imported into database!"}
              </div>
            )}

            <div className="flex border-b border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setUploadMode("single"); setFormSuccess(false); setBulkError(""); }}
                className={`flex-1 pb-3 text-xs font-semibold text-center transition-all border-b-2 ${
                  uploadMode === "single"
                    ? "border-brand-cyan text-white font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Add Single Question
              </button>
              <button
                type="button"
                onClick={() => { setUploadMode("bulk"); setFormSuccess(false); setBulkError(""); }}
                className={`flex-1 pb-3 text-xs font-semibold text-center transition-all border-b-2 ${
                  uploadMode === "bulk"
                    ? "border-brand-cyan text-white font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Bulk Import (JSON)
              </button>
            </div>

            {uploadMode === "single" ? (
              <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 uppercase mb-1.5">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full rounded bg-slate-950 border border-slate-800 p-2.5 text-slate-300 focus:outline-none"
                    >
                      <option>React</option>
                      <option>React Native</option>
                      <option>JavaScript</option>
                      <option>TypeScript</option>
                      <option>Next.js</option>
                      <option>Node.js</option>
                      <option>HR Interview</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 uppercase mb-1.5">Difficulty</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value)}
                      className="w-full rounded bg-slate-950 border border-slate-800 p-2.5 text-slate-300 focus:outline-none"
                    >
                      <option>easy</option>
                      <option>medium</option>
                      <option>hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Question statement</label>
                  <input
                    type="text"
                    required
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. How does react rendering context bypass props trees?"
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Verified Best Answer</label>
                  <textarea
                    required
                    rows={4}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Detailed breakdown formulas..."
                    className="w-full rounded bg-slate-950 border border-slate-800 p-3.5 text-white placeholder-slate-650 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="React Hooks, Context, State"
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-brand-cyan hover:brightness-110 py-3 font-semibold text-white transition-all active:scale-95 shadow-lg"
                >
                  Publish Question Card
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddBulkQuestions} className="space-y-4 text-xs">
                {bulkError && (
                  <div className="mb-4 rounded bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
                    {bulkError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Pasted JSON Array</label>
                  <textarea
                    required
                    rows={12}
                    value={bulkJson}
                    onChange={(e) => setBulkJson(e.target.value)}
                    placeholder={`[\n  {\n    "question": "What is the difference between state and props?",\n    "answer": "State is managed within the component, whereas props are read-only values passed down...",\n    "category": "React",\n    "difficulty": "easy",\n    "tags": ["React", "State", "Props"]\n  }\n]`}
                    className="w-full rounded bg-slate-950 border border-slate-800 p-3.5 text-white placeholder-slate-650 focus:outline-none font-mono leading-relaxed"
                  />
                </div>

                <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-4 text-[11px] text-slate-450 leading-relaxed space-y-2">
                  <span className="font-bold text-slate-200 block uppercase tracking-wider text-[10px]">Import Guide & Schema</span>
                  <p>Each object in the pasted JSON array must include the following properties:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-slate-400 text-[10px]">
                    <li><strong className="text-white">question</strong> (string) — Title or description of the question.</li>
                    <li><strong className="text-white">answer</strong> (string) — Explanation, code blocks, or solution description.</li>
                    <li><strong className="text-white">category</strong> (string) — Exact matching category enum value (e.g. <code className="text-brand-cyan">React</code>, <code className="text-brand-cyan">JavaScript</code>, <code className="text-brand-cyan">TypeScript</code>, <code className="text-brand-cyan">Next.js</code>, <code className="text-brand-cyan">Node.js</code>, <code className="text-brand-cyan">HR Interview</code>).</li>
                    <li><strong className="text-white">difficulty</strong> (string) — <code className="text-brand-cyan">easy</code>, <code className="text-brand-cyan">medium</code>, or <code className="text-brand-cyan">hard</code>.</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 pt-1">Optional parameters: <code className="text-slate-400">tags</code> (array of strings), <code className="text-slate-400">example</code> (codeblock string), <code className="text-slate-400">faqs</code> (array of {`{ question, answer }`}).</p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-brand-cyan hover:brightness-110 py-3 font-semibold text-white transition-all active:scale-95 shadow-lg"
                >
                  Import Questions Batch
                </button>
              </form>
            )}
          </div>
        )}
 
        {activeTab === "blogs" && (
          <div className="bg-glass border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center space-x-1.5">
              <PlusCircle className="h-5 w-5 text-brand-purple" />
              <span>Manage Blog Posts</span>
            </h3>

            {blogFormSuccess && (
              <div className="mb-4 rounded bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-400">
                {blogUploadMode === "single"
                  ? "New blog post successfully published to the database!"
                  : "Batch of blog posts successfully imported into database!"}
              </div>
            )}

            <div className="flex border-b border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setBlogUploadMode("single"); setBlogFormSuccess(false); setBlogBulkError(""); }}
                className={`flex-1 pb-3 text-xs font-semibold text-center transition-all border-b-2 ${
                  blogUploadMode === "single"
                    ? "border-brand-purple text-white font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Publish Single Blog
              </button>
              <button
                type="button"
                onClick={() => { setBlogUploadMode("bulk"); setBlogFormSuccess(false); setBlogBulkError(""); }}
                className={`flex-1 pb-3 text-xs font-semibold text-center transition-all border-b-2 ${
                  blogUploadMode === "bulk"
                    ? "border-brand-purple text-white font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Bulk Import (JSON)
              </button>
            </div>

            {blogUploadMode === "single" ? (
              <form onSubmit={handleAddBlog} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 uppercase mb-1.5">Category</label>
                    <select
                      value={newBlogCategory}
                      onChange={(e) => setNewBlogCategory(e.target.value)}
                      className="w-full rounded bg-slate-950 border border-slate-800 p-2.5 text-slate-300 focus:outline-none"
                    >
                      <option>React</option>
                      <option>React Native</option>
                      <option>JavaScript</option>
                      <option>TypeScript</option>
                      <option>Next.js</option>
                      <option>Node.js</option>
                      <option>Node.js / Backend</option>
                      <option>MongoDB</option>
                      <option>Career Growth</option>
                      <option>Interview Preparation</option>
                      <option>Interview Tips</option>
                      <option>Resume Tips</option>
                      <option>System Design</option>
                      <option>AI Tools</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 uppercase mb-1.5">Author Name (Optional)</label>
                    <input
                      type="text"
                      value={newBlogAuthorName}
                      onChange={(e) => setNewBlogAuthorName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Blog Title</label>
                  <input
                    type="text"
                    required
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    placeholder="e.g. Mastering React 19: New Hooks & Compiler Features"
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Summary (Short excerpt)</label>
                  <input
                    type="text"
                    required
                    value={newBlogSummary}
                    onChange={(e) => setNewBlogSummary(e.target.value)}
                    placeholder="e.g. Dive deep into React 19's brand new compiler features..."
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Cover Image URL (Optional)</label>
                  <input
                    type="text"
                    value={newBlogCoverImage}
                    onChange={(e) => setNewBlogCoverImage(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/..."
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Content (Markdown format supported)</label>
                  <textarea
                    required
                    rows={8}
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                    placeholder="### Intro ... Write your body content in markdown ..."
                    className="w-full rounded bg-slate-950 border border-slate-800 p-3.5 text-white placeholder-slate-650 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newBlogTags}
                    onChange={(e) => setNewBlogTags(e.target.value)}
                    placeholder="React 19, Hooks, Web Dev"
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-brand-purple hover:brightness-110 py-3 font-semibold text-white transition-all active:scale-95 shadow-lg"
                >
                  Publish Blog Post
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddBulkBlogs} className="space-y-4 text-xs">
                {blogBulkError && (
                  <div className="mb-4 rounded bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
                    {blogBulkError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Pasted JSON Array</label>
                  <textarea
                    required
                    rows={12}
                    value={blogBulkJson}
                    onChange={(e) => setBlogBulkJson(e.target.value)}
                    placeholder={`[\n  {\n    "title": "Mastering Next.js 15 Server Components",\n    "summary": "Learn how next-gen React server models work...",\n    "content": "### Server Components Intro\\n\\nNext.js renders server components by default...",\n    "category": "Next.js",\n    "tags": ["Next.js", "React"]\n  }\n]`}
                    className="w-full rounded bg-slate-950 border border-slate-800 p-3.5 text-white placeholder-slate-650 focus:outline-none font-mono leading-relaxed"
                  />
                </div>

                <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-4 text-[11px] text-slate-450 leading-relaxed space-y-2">
                  <span className="font-bold text-slate-200 block uppercase tracking-wider text-[10px]">Import Guide & Schema</span>
                  <p>Each object in the pasted JSON array must include the following properties:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-slate-400 text-[10px]">
                    <li><strong className="text-white">title</strong> (string) — Title of the blog post.</li>
                    <li><strong className="text-white">content</strong> (string) — Markdown-formatted text content.</li>
                    <li><strong className="text-white">category</strong> (string) — Matching category (e.g. <code className="text-brand-purple">React</code>, <code className="text-brand-purple">JavaScript</code>, <code className="text-brand-purple">Next.js</code>, <code className="text-brand-purple">System Design</code>, <code className="text-brand-purple">Node.js / Backend</code>).</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 pt-1">Optional parameters: <code className="text-slate-400">summary</code> (string, defaults to first 150 chars), <code className="text-slate-400">coverImage</code> (string URL), <code className="text-slate-400">tags</code> (array of strings), <code className="text-slate-400">author</code> (object containing <code className="text-slate-400">name</code>, <code className="text-slate-400">image</code>, <code className="text-slate-400">bio</code>).</p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-brand-purple hover:brightness-110 py-3 font-semibold text-white transition-all active:scale-95 shadow-lg"
                >
                  Import Blogs Batch
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === "coding" && (
          <div className="bg-glass border border-slate-800 rounded-xl p-6 max-w-3xl mx-auto space-y-6 text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center space-x-1.5">
              <PlusCircle className="h-5 w-5 text-brand-cyan" />
              <span>Manage Coding Challenges</span>
            </h3>

            {codingSuccess && (
              <div className="mb-4 rounded bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-400">
                {codingUploadMode === "single"
                  ? "New coding challenge successfully registered in the database!"
                  : "Batch of coding challenges successfully imported into database!"}
              </div>
            )}

            <div className="flex border-b border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setCodingUploadMode("single"); setCodingSuccess(false); setCodingBulkError(""); }}
                className={`flex-1 pb-3 text-xs font-semibold text-center transition-all border-b-2 ${
                  codingUploadMode === "single"
                    ? "border-brand-cyan text-white font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Create Challenge Single
              </button>
              <button
                type="button"
                onClick={() => { setCodingUploadMode("bulk"); setCodingSuccess(false); setCodingBulkError(""); }}
                className={`flex-1 pb-3 text-xs font-semibold text-center transition-all border-b-2 ${
                  codingUploadMode === "bulk"
                    ? "border-brand-cyan text-white font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Bulk Import (JSON)
              </button>
            </div>

            {codingUploadMode === "single" ? (
              <form onSubmit={handleAddCodingChallenge} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 uppercase mb-1.5">Category</label>
                    <select
                      value={codingCategory}
                      onChange={(e) => setCodingCategory(e.target.value)}
                      className="w-full rounded bg-slate-950 border border-slate-800 p-2.5 text-slate-350 focus:outline-none"
                    >
                      <option>DSA</option>
                      <option>JavaScript</option>
                      <option>React</option>
                      <option>Frontend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 uppercase mb-1.5">Difficulty</label>
                    <select
                      value={codingDifficulty}
                      onChange={(e) => setCodingDifficulty(e.target.value)}
                      className="w-full rounded bg-slate-950 border border-slate-800 p-2.5 text-slate-350 focus:outline-none"
                    >
                      <option>easy</option>
                      <option>medium</option>
                      <option>hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-355 uppercase mb-1.5">Challenge Title</label>
                    <input
                      type="text"
                      required
                      value={codingTitle}
                      onChange={(e) => setCodingTitle(e.target.value)}
                      placeholder="e.g. Fizz Buzz"
                      className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-355 uppercase mb-1.5">Compiler Function Name</label>
                    <input
                      type="text"
                      required
                      value={codingFuncName}
                      onChange={(e) => setCodingFuncName(e.target.value)}
                      placeholder="e.g. fizzBuzz"
                      className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-355 uppercase mb-1.5">Problem Description (Markdown supported)</label>
                  <textarea
                    required
                    rows={5}
                    value={codingDesc}
                    onChange={(e) => setCodingDesc(e.target.value)}
                    placeholder="Describe constraints, inputs, expected output..."
                    className="w-full rounded bg-slate-950 border border-slate-800 p-3.5 text-white placeholder-slate-650 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-355 uppercase mb-1.5">Starter Boilerplate Code</label>
                  <textarea
                    required
                    rows={5}
                    value={codingStarter}
                    onChange={(e) => setCodingStarter(e.target.value)}
                    placeholder="function fizzBuzz(n) {\n  // write code\n}"
                    className="w-full rounded bg-slate-950 border border-slate-800 p-3.5 text-white placeholder-slate-650 focus:outline-none font-mono"
                  />
                </div>

                {/* Dynamic Test Cases section */}
                <div className="space-y-3 pt-3 border-t border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-300 uppercase tracking-wide">Test Cases</h4>
                    <button
                      type="button"
                      onClick={addTestCase}
                      className="rounded bg-brand-cyan/15 hover:bg-brand-cyan/20 border border-brand-cyan/30 px-3 py-1 text-[10px] font-bold text-brand-cyan transition-colors"
                    >
                      + Add Case
                    </button>
                  </div>

                  <div className="space-y-3">
                    {testCases.map((tc, idx) => (
                      <div key={idx} className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg flex flex-col md:flex-row gap-3 items-end">
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-semibold text-slate-500 uppercase">Input Params</label>
                          <input
                            type="text"
                            required
                            value={tc.input}
                            onChange={(e) => handleTestCaseChange(idx, "input", e.target.value)}
                            placeholder="e.g. [2, 7, 11], 9"
                            className="w-full rounded bg-slate-950 border border-slate-850 px-2.5 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none font-mono"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-semibold text-slate-500 uppercase">Expected Output (JS Format)</label>
                          <input
                            type="text"
                            required
                            value={tc.expectedOutput}
                            onChange={(e) => handleTestCaseChange(idx, "expectedOutput", e.target.value)}
                            placeholder="e.g. [0, 1]"
                            className="w-full rounded bg-slate-950 border border-slate-850 px-2.5 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none font-mono"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pb-2">
                          <input
                            type="checkbox"
                            id={`hide-${idx}`}
                            checked={tc.isHidden}
                            onChange={(e) => handleTestCaseChange(idx, "isHidden", e.target.checked)}
                            className="rounded border-slate-805 bg-slate-950 text-brand-cyan focus:ring-0 focus:outline-none h-4 w-4 cursor-pointer"
                          />
                          <label htmlFor={`hide-${idx}`} className="text-[10px] text-slate-400 font-semibold cursor-pointer">Hidden Case</label>
                        </div>
                        {testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(idx)}
                            className="rounded border border-red-500/20 bg-red-500/10 text-red-400 p-2 hover:bg-red-500/20 active:scale-95 transition-all mb-0.5"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-355 uppercase mb-1.5">Company Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={codingTags}
                    onChange={(e) => setCodingTags(e.target.value)}
                    placeholder="e.g. Google, Apple, Amazon"
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white placeholder-slate-650 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-brand-cyan hover:brightness-110 py-3 font-semibold text-white transition-all active:scale-95 shadow-lg text-xs"
                >
                  Publish Challenge Sheet
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddBulkCoding} className="space-y-4 text-xs">
                {codingBulkError && (
                  <div className="mb-4 rounded bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
                    {codingBulkError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1.5">Pasted JSON Array</label>
                  <textarea
                    required
                    rows={12}
                    value={codingBulkJson}
                    onChange={(e) => setCodingBulkJson(e.target.value)}
                    placeholder={`[\n  {\n    "title": "Reverse String",\n    "description": "Write a function that reverses a string...",\n    "difficulty": "easy",\n    "category": "DSA",\n    "starterCode": "function reverseString(s) {\\n  return s.split('').reverse().join('');\\n}",\n    "functionName": "reverseString",\n    "testCases": [\n      { "input": "'hello'", "expectedOutput": "'olleh'", "isHidden": false }\n    ],\n    "companyTags": ["Apple"]\n  }\n]`}
                    className="w-full rounded bg-slate-950 border border-slate-800 p-3.5 text-white placeholder-slate-650 focus:outline-none font-mono leading-relaxed"
                  />
                </div>

                <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-4 text-[11px] text-slate-450 leading-relaxed space-y-2">
                  <span className="font-bold text-slate-200 block uppercase tracking-wider text-[10px]">Import Guide & Schema</span>
                  <p>Each object in the pasted JSON array must include the following properties:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-slate-400 text-[10px]">
                    <li><strong className="text-white">title</strong> (string) — Challenge title.</li>
                    <li><strong className="text-white">description</strong> (string) — Detailed markdown description.</li>
                    <li><strong className="text-white">category</strong> (string) — Matching category (e.g. <code className="text-brand-cyan">DSA</code>, <code className="text-brand-cyan">JavaScript</code>, <code className="text-brand-cyan">React</code>).</li>
                    <li><strong className="text-white">starterCode</strong> (string) — Boilerplate JavaScript code.</li>
                    <li><strong className="text-white">functionName</strong> (string) — Name of the runner function inside boilerplate.</li>
                    <li><strong className="text-white">testCases</strong> (array) — List of case objects containing <code className="text-white">input</code> (string params), <code className="text-white">expectedOutput</code> (string JS value), and optional <code className="text-white">isHidden</code> (boolean).</li>
                  </ul>
                  <p className="text-[10px] text-slate-500 pt-1">Optional parameters: <code className="text-slate-400">difficulty</code> (string: easy/medium/hard), <code className="text-slate-400">companyTags</code> (array of strings).</p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-brand-cyan hover:brightness-110 py-3 font-semibold text-white transition-all active:scale-95 shadow-lg text-xs"
                >
                  Import Challenges Batch
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === "ads" && (
          <div className="bg-glass border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active AdSense Placement Monitors</h3>
            
            <div className="space-y-4">
              {[
                { slot: "Header Leaderboard", pos: "header", status: "Active (Mock placements visible for Free users)" },
                { slot: "Sidebar Rectangle", pos: "sidebar", status: "Active (Hides automatically for Premium plans)" },
                { slot: "In-Article Native Banner", pos: "in-article", status: "Active (Responsive size blocks)" },
                { slot: "Footer Long Banner", pos: "footer", status: "Active (Horizontal wrapper block)" }
              ].map((ad, idx) => (
                <div key={idx} className="p-4 bg-slate-950/40 border border-slate-850 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{ad.slot}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Code placement key: ad_slot_{ad.pos}</p>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[9px] font-semibold text-emerald-400">
                    {ad.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
