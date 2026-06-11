"use client";

import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { Mail, Globe, CheckCircle, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message || sending) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-4xl w-full px-4 py-16 sm:px-6 lg:px-8 relative z-10 text-left">
        {/* Glow overlay */}
        <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-brand-cyan/10 to-transparent pointer-events-none" />

        <div className="space-y-12">
          {/* Header */}
          <div className="border-b border-slate-800 pb-8">
            <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
              <MessageSquare className="h-8 w-8 text-brand-cyan" />
              <span>Contact Support & Feedback</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Have questions about our AI simulators or want to suggest improvements? Reach out directly through the form below or find our professional profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2 bg-glass border border-slate-800/80 rounded-xl p-6 relative overflow-hidden">
              {success ? (
                <div className="text-center py-10 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Message Sent Successfully</h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                    Thank you for reaching out. We will review your feedback and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-xs text-brand-cyan hover:underline mt-4 font-semibold focus:outline-none"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-650 focus:border-brand-purple focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane.doe@example.com"
                      className="w-full rounded bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-650 focus:border-brand-purple focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi, I noticed a typo on..."
                      className="w-full rounded bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-650 focus:border-brand-purple focus:outline-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending || !name || !email || !message}
                    className="rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan hover:brightness-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] px-5 py-2.5 text-xs font-semibold text-white shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-40 flex items-center space-x-1.5"
                  >
                    <span>{sending ? "Sending..." : "Submit Message"}</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
              <div className="bg-glass border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Direct Channels</h3>
                
                <div className="space-y-3.5 text-xs text-slate-400">
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Email Address</p>
                      <a href="mailto:jeeevanbhargav286@gmail.com" className="text-slate-350 hover:text-white transition-colors block break-all font-medium mt-0.5">
                        jeeevanbhargav286@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <svg className="h-4 w-4 fill-current text-brand-cyan shrink-0 mt-0.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">LinkedIn Profile</p>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-350 hover:text-white transition-colors block font-medium mt-0.5">
                        Jeevan Bhargav
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Globe className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">GitHub Profile</p>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-350 hover:text-white transition-colors block font-medium mt-0.5">
                        GitHub Org
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
