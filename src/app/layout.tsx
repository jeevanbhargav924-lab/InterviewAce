import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterviewAce AI | AI Interview Prep Platform",
  description: "Accelerate your prep with AI Mock Interviews, ATS Resume Screening, and live interactive Frontend & DSA Coding Challenges.",
  keywords: ["Next.js 15", "AI Mock Interviews", "ATS Resume Scorer", "DSA Coding Challenges", "React developer prep", "HR interview answers"],
  openGraph: {
    title: "InterviewAce AI",
    description: "Prepare for your dream technical and HR interviews with real-time AI simulations, instant grading feedback, and personalized dashboards.",
    url: "https://interviewace-ai.com",
    siteName: "InterviewAce AI",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-9246300055713570"}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#030014] text-slate-100 dark:bg-[#030014] dark:text-slate-100 transition-colors duration-300">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
