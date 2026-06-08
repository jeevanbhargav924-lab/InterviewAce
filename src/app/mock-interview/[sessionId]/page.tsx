"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import { Cpu, Mic, MicOff, Send, HelpCircle, CheckCircle, TrendingUp, Sparkles, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";

interface Message {
  role: "interviewer" | "user";
  content: string;
  timestamp?: Date;
}

interface Scorecard {
  scores: {
    technical: number;
    communication: number;
    confidence: number;
    overall: number;
  };
  feedback: string;
  suggestions: string[];
}

export default function InterviewConsolePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const sessionId = params.sessionId as string;

  const [topic, setTopic] = useState("React Developer");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Speech Recognition ref
  const recognitionRef = useRef<any>(null);
  
  // Visualizer canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Scorecard state
  const [grading, setGrading] = useState(false);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);

  // 1. Load Session on Mount
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/mock-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "chat", topic: "React Developer", messages: [], sessionId })
        });
        const data = await res.json();
        
        // Initial question
        setMessages([data.message]);
        speakText(data.message.content);
      } catch (e) {
        console.error("Failed to load interview session:", e);
      }
    }
    loadSession();

    // Setup Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setInputText(prev => prev + " " + transcript);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.speechSynthesis.cancel();
    };
  }, [sessionId]);

  // 2. Waveform Canvas draw loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#8b5cf6"); // Purple
      gradient.addColorStop(1, "#06b6d4"); // Cyan
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;

      const amplitude = isRecording ? 25 : 5;
      const frequency = isRecording ? 0.05 : 0.015;

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * frequency + angle) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      angle += isRecording ? 0.15 : 0.04;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording]);

  // 3. Text to Speech TTS handler
  function speakText(text: string) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose high quality english voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google"));
    if (englishVoice) utterance.voice = englishVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // 4. Microphone recordings toggle
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not fully supported in your browser. Please type your responses.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  // 5. Submit candidate's message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg: Message = { role: "user", content: inputText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setLoading(true);
    setIsRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();

    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", topic, messages: newMessages, sessionId })
      });
      const data = await res.json();
      
      const interviewerMsg = data.message;
      setMessages(prev => [...prev, interviewerMsg]);
      speakText(interviewerMsg.content);
    } catch (err) {
      console.error("Error sending response:", err);
    } finally {
      setLoading(false);
    }
  };

  // 6. Finish and grade interview
  const handleFinishInterview = async () => {
    setGrading(true);
    window.speechSynthesis.cancel();

    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "grade", topic, messages, sessionId })
      });
      const data = await res.json();
      
      setScorecard(data);
      
      // Spray confetti on success scorecard
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error("Failed to grade interview:", e);
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      <CustomCursor />
      <Navbar />

      <main className="flex-grow mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 relative z-10">
        
        {scorecard ? (
          /* SCORECARD VIEW */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header banner */}
            <div className="bg-glass border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.06)_0%,_transparent_60%)]" />
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-brand-cyan/15 px-3 py-1 text-xs font-semibold text-brand-cyan border border-brand-cyan/20 mb-4">
                <Sparkles className="h-3 w-3" />
                <span>Grading report completed</span>
              </span>
              <h2 className="text-3xl font-extrabold text-white">Interview Performance scorecard</h2>
              <p className="text-xs text-slate-400 mt-2">Comprehensive critique covering technical answers, communication structure, and delivery pacing.</p>
            </div>

            {/* Main stats layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Overall Score", val: scorecard.scores.overall, desc: "Weighted target average" },
                { name: "Technical Depth", val: scorecard.scores.technical, desc: "API accuracy & engineering context" },
                { name: "Communication", val: scorecard.scores.communication, desc: "STAR format & articulation structure" },
                { name: "Confidence", val: scorecard.scores.confidence, desc: "Pacing cadence & delivery flows" }
              ].map((stat, i) => (
                <div key={i} className="bg-glass border border-slate-800 rounded-xl p-5 text-center flex flex-col justify-between">
                  <p className="text-xs font-semibold text-slate-400">{stat.name}</p>
                  <div className="my-4">
                    <span className="text-4xl font-black bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
                      {stat.val}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-normal">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Critique Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* General Feedback critique */}
              <div className="md:col-span-2 bg-glass border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-4.5 w-4.5 text-brand-cyan" />
                  <span>General Interview Critique</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {scorecard.feedback}
                </p>
              </div>

              {/* Actionable items */}
              <div className="bg-glass border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-4.5 w-4.5 text-brand-purple" />
                  <span>Recommended upgrades</span>
                </h3>
                <ul className="space-y-3.5 text-[11px] text-slate-400">
                  {scorecard.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan px-6 py-3 text-xs font-semibold text-white shadow-xl"
              >
                Return to Dashboard
              </button>
            </div>

          </div>
        ) : (
          /* ACTIVE DIALOGUE VIEW */
          <div className="grid grid-cols-1 gap-6">
            
            {/* Header info */}
            <div className="bg-glass border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">{topic} AI Session</h2>
                <p className="text-[10px] text-slate-500 mt-0.5">Use the microphone to speak your replies, or click the finish action to submit.</p>
              </div>
              <button
                onClick={handleFinishInterview}
                disabled={grading || messages.length < 2}
                className="rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-40 px-3.5 py-1.5 text-[10px] font-semibold text-white"
              >
                {grading ? "Generating grade..." : "Complete Interview"}
              </button>
            </div>

            {/* Visualizer screen */}
            <div className="bg-glass border border-slate-800 rounded-xl p-4 flex flex-col items-center">
              <canvas ref={canvasRef} width={800} height={100} className="w-full max-h-[100px]" />
              <div className="flex items-center space-x-2.5 mt-3 text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                {isRecording ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-red-400">Microphone active. Transcribing speech...</span>
                  </>
                ) : (
                  <span>Microphone stands idle. Click the icon to speak.</span>
                )}
              </div>
            </div>

            {/* Chat Transcript log */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl min-h-[250px] max-h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "interviewer" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3.5 text-xs leading-relaxed font-normal ${
                      m.role === "interviewer"
                        ? "bg-slate-900 border border-slate-800 text-slate-200"
                        : "bg-brand-purple text-white shadow-md"
                    }`}
                  >
                    <p className="font-bold text-[9px] mb-1 opacity-60 uppercase tracking-wide">
                      {m.role === "interviewer" ? "AI Interviewer (Interviewer)" : "You (Candidate)"}
                    </p>
                    <p>{m.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-500 animate-pulse">
                    AI Interviewer is processing your answer...
                  </div>
                </div>
              )}
            </div>

            {/* Form Console Input */}
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              {/* Mic Icon toggle */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`rounded-lg p-3 shrink-0 flex items-center justify-center transition-all ${
                  isRecording 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Type your answer here..."}
                disabled={loading}
                className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-cyan focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="rounded-lg bg-brand-cyan hover:brightness-110 px-5.5 py-2.5 text-xs font-semibold text-white shrink-0 active:scale-95 transition-all disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
