import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Question from "@/models/Question";

const SEED_QUESTIONS = [
  {
    question: "What is the Virtual DOM and how does React use it to render pages?",
    answer: "The Virtual DOM is a lightweight, in-memory representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation), and batches modifications to update only the changed nodes in the real DOM, optimizing rendering speed.",
    category: "React",
    difficulty: "easy",
    tags: ["React", "DOM", "Rendering"]
  },
  {
    question: "Explain the difference between useEffect hooks and useLayoutEffect hooks.",
    answer: "useEffect executes asynchronously after the DOM paint is rendered on screen, making it safe for non-blocking side effects like data fetching. useLayoutEffect runs synchronously BEFORE the browser paints the screen, useful for measuring layout or forcing styling adjustments before the user sees them.",
    category: "React",
    difficulty: "medium",
    tags: ["React Hooks", "Lifecycles"]
  },
  {
    question: "What are JavaScript Closures and how are they useful in practice?",
    answer: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In simple terms, closures allow an inner function to access variables from its outer function even after the outer function has finished executing. Common use cases include data encapsulation/privacy, event handler state maintenance, and currying.",
    category: "JavaScript",
    difficulty: "medium",
    tags: ["JS Core", "Scope"]
  },
  {
    question: "Explain event delegation in JavaScript and why we should use it.",
    answer: "Event delegation is a technique where instead of adding event listeners directly to multiple child elements, we attach a single event listener to their parent element. It works due to 'event bubbling' (events propagate upwards through the DOM tree). It saves memory, improves performance, and automatically handles dynamic elements added to the parent later.",
    category: "JavaScript",
    difficulty: "easy",
    tags: ["DOM Events", "Performance"]
  },
  {
    question: "What is the difference between interfaces and type aliases in TypeScript?",
    answer: "Interfaces are extendable via declaration merging (defining the same interface name multiple times stacks fields) and are typically preferred for object structures. Type aliases can define primitives, unions, intersections, and tuples, making them more versatile, but they cannot be merged through duplicate declarations.",
    category: "TypeScript",
    difficulty: "easy",
    tags: ["TS Types", "Interfaces"]
  },
  {
    question: "How does server-side rendering (SSR) in Next.js App Router differ from Static Site Generation (SSG)?",
    answer: "SSR (Dynamic Rendering) fetches data and generates the HTML on every incoming request, ensuring information is always up-to-date. SSG (Static Rendering) pre-renders the page at build-time, serving static files directly from a CDN for lightning-fast speeds. Next.js 15 controls this using dynamic cache configurations, generateStaticParams, or page routing variables.",
    category: "Next.js",
    difficulty: "medium",
    tags: ["Next.js Router", "Rendering"]
  },
  {
    question: "How would you handle global error boundaries in Express or Node.js backend apps?",
    answer: "Implement a centralized error-handling middleware as the last middleware registered on the Express app. This middleware takes 4 arguments: (err, req, res, next). Inside, you log the error trace, determine status codes, and return structured JSON responses to prevent server crashes and client-side information exposure.",
    category: "Node.js",
    difficulty: "medium",
    tags: ["Express", "Error Handling"]
  },
  {
    question: "Tell me about a time you had a technical disagreement with a colleague. How did you resolve it?",
    answer: "Explain a specific scenario using the STAR framework. Highlight that you listened to their rationale, backed up your arguments with objective criteria (like bundle benchmarks, memory load, documentation), did a small proof-of-concept sandbox comparison, and aligned on the choice that was best for project scalability and maintenance.",
    category: "HR",
    difficulty: "easy",
    tags: ["Soft Skills", "Collaboration"]
  }
];

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    const count = await Question.countDocuments();
    if (count === 0) {
      await Question.insertMany(SEED_QUESTIONS);
    }

    const filter: any = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter);
    return NextResponse.json(questions);
  } catch (error: any) {
    console.error("Questions API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Optional: add session security checks here if you want to restrict this in production
    const body = await req.json();
    const { question, answer, category, difficulty, tags } = body;

    if (!question || !answer || !category || !difficulty) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newQuestion = await Question.create({
      question,
      answer,
      category,
      difficulty: difficulty.toLowerCase(),
      tags: tags || []
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error: any) {
    console.error("Questions POST API error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
