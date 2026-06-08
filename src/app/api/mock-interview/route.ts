import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import MockInterview from "@/models/MockInterview";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Smart local responses fallback
const INTERVIEW_QUESTIONS: Record<string, string[]> = {
  "React Developer": [
    "Could you explain the difference between functional components with hooks and class components?",
    "How does React's virtual DOM reconciliation work, and what is the key prop used for?",
    "What is the difference between useMemo and useCallback? When would you use them?",
    "How do you manage global state in a large-scale React application?",
    "What is the purpose of React Suspense, and how does it integrate with data fetching?"
  ],
  "JavaScript Developer": [
    "Explain closure in JavaScript and give a practical use case.",
    "What is the event loop, and how does JS handle asynchronous operations?",
    "What is the difference between prototype-based inheritance and classical class inheritance?",
    "Explain the 'this' keyword binding rules in different execution contexts.",
    "What are promises, and how do they differ from callbacks? What are async/await advantages?"
  ],
  "MERN Stack Developer": [
    "How do you manage schemas, indices, and relationships in MongoDB with Mongoose?",
    "Explain how Express middleware works and write a simple request logger middleware.",
    "How do you secure REST APIs against common vulnerabilities like CSRF or XSS?",
    "How would you optimize database queries in MongoDB to support high traffic?",
    "Explain the typical deployment pipeline and scaling strategies for a node/express backend."
  ],
  "default": [
    "Tell me about a challenging technical project you worked on and how you resolved issues.",
    "How do you stay up-to-date with new technologies and frameworks?",
    "What is your approach to code reviews and collaborative development?",
    "How do you handle disagreements on technical choices within a team?",
    "Describe how you identify, isolate, and debug complex production bugs."
  ]
};

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { action, topic, messages, sessionId } = body;

    // 1. GRADE ACTION
    if (action === "grade") {
      // Calculate realistic scores based on response length and message counts
      const userMsgs = messages.filter((m: any) => m.role === "user");
      const totalWords = userMsgs.reduce((sum: number, m: any) => sum + m.content.split(/\s+/).length, 0);
      const avgWordCount = userMsgs.length > 0 ? totalWords / userMsgs.length : 0;

      // Base scores around response metrics
      const communication = Math.min(95, Math.max(65, 75 + Math.floor(avgWordCount / 2)));
      const confidence = Math.min(98, Math.max(60, 70 + Math.floor(userMsgs.length * 3)));
      const technical = Math.min(92, Math.max(55, 60 + Math.floor(totalWords / 15)));
      const overall = Math.round((communication + confidence + technical) / 3);

      const feedback = `Excellent effort. Your answers demonstrate a solid grasp of ${topic}. You communicate technical topics effectively. However, you can refine your answers to be more concise and highlight specific design patterns you have implemented in past projects.`;
      const suggestions = [
        "Incorporate architectural terms like Separation of Concerns and Single Responsibility.",
        "When explaining React features, talk about rendering optimization and hook rules.",
        "Practice using the STAR method (Situation, Task, Action, Result) for behavioral answers."
      ];

      let interviewRecord;
      if (sessionId) {
        interviewRecord = await MockInterview.findByIdAndUpdate(
          sessionId,
          { scores: { technical, communication, confidence, overall }, feedback, suggestions, messages },
          { new: true }
        );
      } else {
        interviewRecord = await MockInterview.create({
          userId,
          topic,
          messages,
          scores: { technical, communication, confidence, overall },
          feedback,
          suggestions
        });
      }

      return NextResponse.json({
        id: interviewRecord._id.toString(),
        scores: interviewRecord.scores,
        feedback: interviewRecord.feedback,
        suggestions: interviewRecord.suggestions
      });
    }

    // 2. CHAT ACTION (NEXT INTERVIEW QUESTION)
    const topicKey = INTERVIEW_QUESTIONS[topic] ? topic : "default";
    const questions = INTERVIEW_QUESTIONS[topicKey];

    const currentMsgCount = messages.filter((m: any) => m.role === "interviewer").length;
    let nextQuestion = "";

    if (currentMsgCount < questions.length) {
      nextQuestion = questions[currentMsgCount];
    } else {
      nextQuestion = "Thank you! We have covered all the structured questions for this session. Please click 'Complete Interview' to receive your grading report.";
    }

    // Save/update session in DB
    let activeSessionId = sessionId;
    const updatedMessages = [...messages, { role: "interviewer", content: nextQuestion, timestamp: new Date() }];

    if (!activeSessionId) {
      const newSession = await MockInterview.create({
        userId,
        topic,
        messages: updatedMessages,
      });
      activeSessionId = newSession._id.toString();
    } else {
      await MockInterview.findByIdAndUpdate(activeSessionId, { messages: updatedMessages });
    }

    return NextResponse.json({
      sessionId: activeSessionId,
      message: { role: "interviewer", content: nextQuestion }
    });

  } catch (error: any) {
    console.error("Mock Interview API error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
