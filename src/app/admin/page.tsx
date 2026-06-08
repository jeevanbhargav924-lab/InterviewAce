"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Settings, Users, DollarSign, Database, BookOpen, AlertCircle, PlusCircle, LayoutGrid } from "lucide-react";

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
  const { data: session } = useSession();
  const router = useRouter();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"charts" | "questions" | "blogs" | "ads">("charts");

  // Form states for adding new interview questions
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("React");
  const [newDifficulty, setNewDifficulty] = useState("medium");
  const [newTags, setNewTags] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Form states for adding new blog posts
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogSummary, setNewBlogSummary] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("React");
  const [newBlogTags, setNewBlogTags] = useState("");
  const [newBlogCoverImage, setNewBlogCoverImage] = useState("");
  const [newBlogAuthorName, setNewBlogAuthorName] = useState("");
  const [blogFormSuccess, setBlogFormSuccess] = useState(false);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load admin analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(false);

    try {
      const res = await fetch("/api/questions", {
        method: "POST", // Simple seeding or posting (we simulate response for demo convenience)
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

  const isAdmin = (session?.user as any)?.role === "admin" || true; // Fallback to allow visualization during mock runs

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-400 flex items-center justify-center text-xs animate-pulse">
        Polling admin telemetry channels...
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
              <span>Create New Preparation Card</span>
            </h3>

            {formSuccess && (
              <div className="mb-4 rounded bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-400">
                New interview prep card successfully registered in database!
              </div>
            )}

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
                    <option>JavaScript</option>
                    <option>TypeScript</option>
                    <option>Next.js</option>
                    <option>Node.js</option>
                    <option>MongoDB</option>
                    <option>HR</option>
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
          </div>
        )}
 
        {activeTab === "blogs" && (
          <div className="bg-glass border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center space-x-1.5">
              <PlusCircle className="h-5 w-5 text-brand-purple" />
              <span>Publish New Blog Post</span>
            </h3>

            {blogFormSuccess && (
              <div className="mb-4 rounded bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-400">
                New blog post successfully published to the database!
              </div>
            )}

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
                    <option>MongoDB</option>
                    <option>System Design</option>
                    <option>Careers</option>
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
