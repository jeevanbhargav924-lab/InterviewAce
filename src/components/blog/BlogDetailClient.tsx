"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, Eye, MessageSquare, Calendar, User, Send } from "lucide-react";
import AdPlaceholder from "../shared/AdPlaceholder";
import { formatDate } from "@/lib/utils";

interface Comment {
  _id: string;
  userName: string;
  userImage: string;
  content: string;
  createdAt: string;
}

interface BlogArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    image: string;
    bio: string;
  };
  views: number;
  comments: Comment[];
  createdAt: string;
}

interface BlogDetailClientProps {
  initialBlog: BlogArticle;
}

export default function BlogDetailClient({ initialBlog }: BlogDetailClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [blog, setBlog] = useState<BlogArticle>(initialBlog);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    const mockComment = {
      userName: session.user?.name || "Anonymous User",
      userImage: session.user?.image || "",
      content: commentText
    };

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: blog._id,
          comment: mockComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBlog(data);
        setCommentText("");
      }
    } catch (e) {
      console.error("Could not post comment:", e);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <>
      {/* Back navigation */}
      <button
        onClick={() => router.push("/blog")}
        className="text-xs text-slate-500 hover:text-white flex items-center space-x-1 mb-6 text-left"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to feeds</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main article content */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* Cover image banner */}
          <div className="h-64 w-full bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
            <span className="absolute bottom-4 left-4 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {blog.category}
            </span>
          </div>

          {/* Title / Meta */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">{blog.title}</h1>
            
            <div className="flex items-center space-x-4 text-[10px] text-slate-500 mt-3 pb-4 border-b border-slate-800/80">
              <span className="flex items-center space-x-1">
                <User className="h-3.5 w-3.5" />
                <span>By {blog.author.name}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(blog.createdAt)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{blog.views} Views</span>
              </span>
            </div>
          </div>

          {/* AD PLACEMENT: IN-ARTICLE ADS */}
          <AdPlaceholder position="in-article" />

          {/* MDX Content Markdown container */}
          <div className="prose prose-invert prose-xs text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Author Profile card */}
          <div className="bg-glass border border-slate-800 rounded-xl p-5 flex items-start space-x-4 mt-12">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs uppercase overflow-hidden shrink-0">
              {blog.author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={blog.author.image} alt={blog.author.name} className="h-full w-full object-cover" />
              ) : (
                blog.author.name.substring(0, 2)
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Written by {blog.author.name}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-normal">{blog.author.bio || "Staff writer and tech preparation analyst."}</p>
            </div>
          </div>

          {/* COMMENTS SECTION */}
          <div className="border-t border-slate-800 pt-8 mt-12 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <MessageSquare className="h-4.5 w-4.5 text-brand-cyan" />
              <span>Discussion ({blog.comments.length})</span>
            </h3>

            {session ? (
              <form onSubmit={handlePostComment} className="flex space-x-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a constructive comment..."
                  disabled={submittingComment}
                  className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-cyan focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="rounded-lg bg-brand-cyan hover:brightness-110 px-5.5 py-2.5 text-xs font-semibold text-white active:scale-95 transition-all disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="rounded-lg bg-slate-950 p-4.5 text-center text-xs text-slate-500">
                Please{" "}
                <Link href="/login" className="text-brand-cyan hover:underline">
                  log in
                </Link>{" "}
                to participate in technical discussions.
              </div>
            )}

            {/* Comments Feed list */}
            <div className="space-y-4 pt-2">
              {blog.comments.length === 0 ? (
                <p className="text-slate-600 text-xs italic">No comments yet. Start the discussion!</p>
              ) : (
                blog.comments.map((comm) => (
                  <div key={comm._id} className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs uppercase overflow-hidden shrink-0">
                      {comm.userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={comm.userImage} alt={comm.userName} className="h-full w-full object-cover" />
                      ) : (
                        comm.userName.substring(0, 2)
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-[10px]">
                        <span className="font-bold text-white">{comm.userName}</span>
                        <span className="text-slate-655">•</span>
                        <span className="text-slate-500">{formatDate(comm.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-normal leading-relaxed">{comm.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* AD PLACEMENT: SIDEBAR ADS */}
          <AdPlaceholder position="sidebar" />
        </div>
      </div>
    </>
  );
}
