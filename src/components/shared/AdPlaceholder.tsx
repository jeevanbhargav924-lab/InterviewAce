"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

interface AdPlaceholderProps {
  position: "header" | "sidebar" | "in-article" | "footer";
  className?: string;
  adSlot?: string; // Optional Google AdSense Slot ID
}

export default function AdPlaceholder({ position, className = "", adSlot }: AdPlaceholderProps) {
  const { data: session } = useSession();
  
  const isPremium = (session?.user as any)?.subscription?.plan === "premium" && 
                    (session?.user as any)?.subscription?.status === "active";

  useEffect(() => {
    // Dynamically push the ad once the Google AdSense script has loaded in client side
    if (!isPremium && adSlot && typeof window !== "undefined") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.warn("AdSense push warning (usually fails in local sandbox without ad blocker scripts):", err);
      }
    }
  }, [isPremium, adSlot]);

  if (isPremium) {
    // Hide ads completely for premium members
    return null;
  }

  // If a real ad slot ID is provided, render the real Google AdSense HTML unit
  if (adSlot) {
    const slotDimensions = {
      header: { width: "100%", height: "90px" },
      sidebar: { width: "300px", height: "250px" },
      "in-article": { width: "100%", height: "280px" },
      footer: { width: "100%", height: "90px" },
    };

    return (
      <div className={`mx-auto flex justify-center items-center my-4 overflow-hidden ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", ...slotDimensions[position] }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-9246300055713570"}
          data-ad-slot={adSlot}
          data-ad-format={position === "in-article" ? "fluid" : "auto"}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  const dimensions = {
    header: "w-full h-24 max-w-4xl",
    sidebar: "w-full h-80 max-w-[300px]",
    "in-article": "w-full h-32 max-w-2xl my-6",
    footer: "w-full h-20 max-w-5xl",
  };

  return (
    <div
      className={`mx-auto flex flex-col items-center justify-center border border-dashed border-brand-purple/20 bg-brand-purple/5 dark:bg-white/5 backdrop-blur-md rounded-lg overflow-hidden relative group transition-all duration-300 ${dimensions[position]} ${className}`}
    >
      {/* Decorative neon borders */}
      <span className="absolute inset-0 border border-brand-cyan/20 rounded-lg group-hover:border-brand-cyan/50 pointer-events-none transition-colors duration-300" />
      
      {/* Tiny badge */}
      <div className="absolute top-1 right-2 text-[9px] font-semibold tracking-wider text-brand-purple/60 dark:text-brand-cyan/60 uppercase">
        Sponsored Advertisement
      </div>

      <div className="flex flex-col items-center justify-center p-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Google AdSense Placement
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
          {position === "header" && "728 x 90 Leaderboard"}
          {position === "sidebar" && "300 x 250 Medium Rectangle"}
          {position === "in-article" && "Native Responsive Banner"}
          {position === "footer" && "970 x 90 Large Leaderboard"}
        </p>
        <button 
          onClick={() => {
            window.location.href = "/pricing";
          }}
          className="mt-2 text-[10px] text-brand-purple hover:text-brand-cyan font-semibold underline pointer-events-auto"
        >
          Remove Ads with Premium Upgrade →
        </button>
      </div>
    </div>
  );
}
