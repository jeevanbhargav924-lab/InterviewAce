"use client";

import React, { useState, useEffect } from "react";
import { Link2, Check, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title?: string;
  className?: string;
}

export default function ShareButtons({ title = "Check this out!", className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Client-side initialization to avoid hydration mismatch
    setShareUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Send analytics event if present
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "share_copy_link", {
          event_category: "Engagement",
          event_label: shareUrl,
        });
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShareClick = (platform: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    
    // Send analytics event if present
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", `share_${platform}`, {
        event_category: "Engagement",
        event_label: shareUrl,
      });
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 backdrop-blur-md text-left ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="h-7 w-7 rounded-lg bg-brand-purple/15 flex items-center justify-center border border-brand-purple/20 shrink-0">
          <Share2 className="h-3.5 w-3.5 text-brand-purple" />
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Share this Resource</h4>
          <p className="text-[8px] text-slate-500 mt-0.5">Spread the knowledge with other engineering candidates.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center space-x-1 px-3 py-1.5 rounded bg-slate-900 border text-[10px] font-semibold transition-all duration-200 cursor-pointer flex-1 sm:flex-none ${
            copied
              ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
              : "border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 animate-pulse" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="h-3 w-3" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* X / Twitter */}
        <button
          onClick={() => handleShareClick("twitter", twitterUrl)}
          className="flex items-center justify-center px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-[10px] font-semibold cursor-pointer transition-all flex-1 sm:flex-none"
          title="Share on X"
        >
          <svg className="h-3 w-3 mr-1 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShareClick("linkedin", linkedinUrl)}
          className="flex items-center justify-center px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-[10px] font-semibold cursor-pointer transition-all flex-1 sm:flex-none"
          title="Share on LinkedIn"
        >
          <svg className="h-3 w-3 mr-1 fill-current text-cyan-500" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <span>Post</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShareClick("whatsapp", whatsappUrl)}
          className="flex items-center justify-center px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-[10px] font-semibold cursor-pointer transition-all flex-1 sm:flex-none"
          title="Share on WhatsApp"
        >
          <svg className="h-3.5 w-3.5 mr-1 fill-current text-emerald-500" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.57 1.98 14.105.953 11.996.953c-5.447 0-9.873 4.372-9.878 9.805-.002 1.77.475 3.5 1.38 5.02L2.5 21.5l5.962-1.546zM17.65 14.73c-.307-.154-1.82-.9-2.1-.998-.28-.1-.483-.153-.687.154-.202.307-.785.998-.962 1.201-.177.202-.355.228-.662.074-1.08-.54-2.124-1.127-2.91-1.8-1.024-.877-1.493-1.488-1.745-1.922-.25-.436-.027-.671.189-.884.195-.192.436-.51.654-.766.217-.257.29-.44.436-.732.146-.29.073-.545-.037-.77-.109-.226-.85-2.062-1.168-2.83-.31-.749-.623-.647-.85-.659-.22-.012-.472-.014-.725-.014-.253 0-.665.096-.99.452-.327.356-1.248 1.222-1.248 2.98 0 1.758 1.278 3.457 1.457 3.693.178.236 2.514 3.84 6.092 5.39 3.578 1.55 3.578 1.03 4.238.97.66-.06 2.126-.87 2.424-1.71.298-.84.298-1.56.209-1.71-.089-.15-.327-.304-.633-.456z" />
          </svg>
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
