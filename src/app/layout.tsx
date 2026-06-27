import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";
import ScrollFeatures from "@/components/shared/ScrollFeatures";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterviewAce AI | AI Interview Prep & ATS Resume Review",
  description: "Accelerate your prep with AI Mock Interviews, ATS Resume Screening, and live interactive Frontend & DSA Coding Challenges.",
  keywords: ["Next.js 16", "React 19", "AI Mock Interviews", "ATS Resume Scorer", "DSA Coding Challenges", "React developer prep", "HR interview answers"],
  openGraph: {
    title: "InterviewAce AI | AI Interview Prep & ATS Resume Review",
    description: "Prepare for your dream technical and HR interviews with real-time AI simulations, instant grading feedback, and personalized dashboards.",
    url: "https://www.interviewaceai.online",
    siteName: "InterviewAce AI",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "InterviewAce AI Platform Preview",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InterviewAce AI | AI Interview Prep & ATS Resume Review",
    description: "Prepare for your dream technical and HR interviews with real-time AI simulations, instant grading feedback, and personalized dashboards.",
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200"],
  },
  alternates: {
    canonical: "https://www.interviewaceai.online",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "InterviewAce AI",
    "url": "https://www.interviewaceai.online",
    "logo": "https://www.interviewaceai.online/favicon.ico",
    "sameAs": [
      "https://github.com",
      "https://linkedin.com"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InterviewAce AI",
    "url": "https://www.interviewaceai.online",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.interviewaceai.online/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#030014] text-slate-100 dark:bg-[#030014] dark:text-slate-100 transition-colors duration-300">
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
            id="google-adsense"
          />
        )}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x9m92hhts6");
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MK2DJXE7F0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MK2DJXE7F0');
          `}
        </Script>
        <Providers>
          <ScrollFeatures />
          {children}
        </Providers>
      </body>
    </html>
  );
}
