"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-16 text-slate-300 relative z-10 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Service</h1>
        <p className="text-xs text-slate-500 mb-8 font-mono">Last Updated: June 9, 2026</p>

        <section className="space-y-6 text-sm">
          <p>
            Welcome to <strong>InterviewAce.AI</strong>. These terms and conditions outline the rules and regulations for the use of InterviewAce.AI's Website, located at <a href="https://interviewaceai.online" className="text-brand-cyan hover:underline">https://interviewaceai.online</a>.
          </p>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Terms</h2>
            <p>
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use InterviewAce.AI if you do not agree to take all of the terms and conditions stated on this page.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. Cookies</h2>
            <p>
              We employ the use of cookies. By accessing InterviewAce.AI, you agreed to use cookies in agreement with the InterviewAce.AI's Privacy Policy. Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">3. License & Intellectual Property</h2>
            <p>
              Unless otherwise stated, InterviewAce.AI and/or its licensors own the intellectual property rights for all material on InterviewAce.AI. All intellectual property rights are reserved. You may access this from InterviewAce.AI for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p className="mt-2">You must not:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Republish material from InterviewAce.AI.</li>
              <li>Sell, rent, or sub-license material from InterviewAce.AI.</li>
              <li>Reproduce, duplicate, or copy material from InterviewAce.AI.</li>
              <li>Redistribute content from InterviewAce.AI.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. User Comments & Simulators</h2>
            <p>
              Parts of this website offer an opportunity for users to post and exchange opinions and data in certain areas of the website (e.g. blog comments, interview responses). Comments do not reflect the views and opinions of InterviewAce.AI, its agents and/or affiliates. To the extent permitted by applicable laws, InterviewAce.AI shall not be liable for the Comments or for any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. Disclaimer</h2>
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Limit or exclude our or your liability for death or personal injury.</li>
              <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation.</li>
              <li>Limit any of our or your liabilities in any way that is not permitted under applicable law.</li>
            </ul>
            <p className="mt-2 text-slate-400">
              The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">6. Contact Information</h2>
            <p>
              If you have any questions regarding these terms, please contact us at <span className="text-brand-cyan">support@interviewaceai.online</span>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
