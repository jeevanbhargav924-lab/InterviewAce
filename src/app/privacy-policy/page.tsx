"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-16 text-slate-350 relative z-10 leading-relaxed text-left">
        {/* Glow overlay */}
        <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-brand-purple/10 to-transparent pointer-events-none" />

        <h1 className="text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mb-8 font-mono">Last Updated: June 11, 2026</p>

        <section className="space-y-6 text-sm">
          <p>
            At <strong>InterviewAceAI.online</strong> (accessible from <a href="https://interviewaceai.online" className="text-brand-cyan hover:underline">https://interviewaceai.online</a>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by InterviewAceAI.online and how we use it.
          </p>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. Information We Collect</h2>
            <p>
              The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Account Info:</strong> When you register for an Account, we may ask for your contact information, including items such as name, email address, and login credentials.</li>
              <li><strong>Logs & Analytics:</strong> Standard website access metrics, such as IP addresses, browser details, and time stamps, are collected automatically to track page performance.</li>
              <li><strong>User Content:</strong> Text inputs in interview simulators or uploaded resumes are used solely to run real-time evaluation scripts and score calculations.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">3. How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, operate, and maintain our website.</li>
              <li>Improve, personalize, and expand our website features.</li>
              <li>Understand and analyze how you use our website.</li>
              <li>Develop new products, services, features, and functionality.</li>
              <li>Communicate with you, either directly or through one of our partners, for customer service, updates, and marketing.</li>
              <li>Find and prevent fraud.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. Log Files and Web Analytics</h2>
            <p>
              InterviewAceAI.online follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. Google DoubleClick DART Cookie (AdSense Disclosure)</h2>
            <p>
              Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline">https://policies.google.com/technologies/ads</a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">6. Privacy Policies of Advertising Partners</h2>
            <p>
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on InterviewAceAI.online, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p className="mt-2 text-slate-400 text-xs">
              Note that InterviewAceAI.online has no access to or control over these cookies that are used by third-party advertisers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">7. CCPA Privacy Rights & GDPR Data Protection</h2>
            <p>
              We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the right to access, rectification, erasure, restrict processing, object to processing, and data portability. If you make a request, we have one month to respond to you.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">8. Contact Us</h2>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at: <span className="text-brand-cyan">jeeevanbhargav286@gmail.com</span>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
