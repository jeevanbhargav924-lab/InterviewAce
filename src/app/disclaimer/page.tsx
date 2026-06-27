import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";

export const metadata: Metadata = {
  title: "Disclaimer | InterviewAce AI",
  description: "Read our Disclaimer to understand the educational scope of InterviewAce AI, content accuracy, external links, and interview outcome policies.",
  alternates: {
    canonical: "https://www.interviewaceai.online/disclaimer"
  }
};

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-16 text-slate-350 relative z-10 leading-relaxed text-left">
        {/* Glow overlay */}
        <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-brand-purple/10 to-transparent pointer-events-none" />

        <h1 className="text-3xl font-extrabold text-white mb-2">Disclaimer</h1>
        <p className="text-xs text-slate-500 mb-8 font-mono">Last Updated: June 11, 2026</p>

        <section className="space-y-6 text-sm">
          <p>
            The information contained on the <strong>InterviewAceAI.online</strong> website (the "Service") is for general informational and educational purposes only.
          </p>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Educational Scope</h2>
            <p>
              InterviewAceAI.online provides questions, sample answers, code blocks, and blog guidelines as a study reference. While we make every effort to keep our databases updated and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on the Service for any purpose.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. Interview and Career Outcomes</h2>
            <p>
              Simulating interviews, using our ATS resume scorecard checks, or reviewing question cards does not guarantee job placement, recruiter contact, passing technical screening rounds, or successful employment outcomes. Your preparation results and interview success depend on your own background, skills, and the specific hiring process of companies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">3. External Links Disclaimer</h2>
            <p>
              The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with InterviewAceAI.online. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. Errors and Omissions</h2>
            <p>
              The Service may include technical inaccuracies or typographical errors. InterviewAceAI.online reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. Contact Info</h2>
            <p>
              If you have any questions regarding this disclaimer, please contact us at: <span className="text-brand-cyan">jeeevanbhargav286@gmail.com</span>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
