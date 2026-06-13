import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Question from "@/models/Question";

const SEED_QUESTIONS = [
  {
    question: "What is the Virtual DOM and how does React use it to render pages?",
    slug: "what-is-virtual-dom",
    answer: "The Virtual DOM is a lightweight, in-memory representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation), and batches modifications to update only the changed nodes in the real DOM, optimizing rendering speed.",
    example: "```jsx\n// React updates changes on state change\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}\n```",
    category: "React",
    difficulty: "easy",
    tags: ["React", "DOM", "Rendering"],
    faqs: [
      { question: "What is reconciliation in React?", answer: "Reconciliation is the process through which React updates the DOM by comparing the Virtual DOM with the real DOM." }
    ]
  },
  {
    question: "Explain the difference between useEffect hooks and useLayoutEffect hooks.",
    slug: "useeffect-vs-uselayouteffect",
    answer: "useEffect executes asynchronously after the DOM paint is rendered on screen, making it safe for non-blocking side effects like data fetching. useLayoutEffect runs synchronously BEFORE the browser paints the screen, useful for measuring layout or forcing styling adjustments before the user sees them.",
    example: "```javascript\n// useEffect runs after print\nuseEffect(() => {\n  fetchData();\n}, []);\n\n// useLayoutEffect runs before print\nuseLayoutEffect(() => {\n  const width = ref.current.clientWidth;\n}, []);\n```",
    category: "React",
    difficulty: "medium",
    tags: ["React Hooks", "Lifecycles"],
    faqs: [
      { question: "When should I use useLayoutEffect?", answer: "Use it only when you need to calculate layout size or position before the DOM paints on the browser." }
    ]
  },
  {
    question: "What are JavaScript Closures and how are they useful in practice?",
    slug: "what-is-closure",
    answer: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In simple terms, closures allow an inner function to access variables from its outer function even after the outer function has finished executing. Common use cases include data encapsulation/privacy, event handler state maintenance, and currying.",
    example: "```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\nconst counter = createCounter();\nconsole.log(counter()); // 1\n```",
    category: "JavaScript",
    difficulty: "medium",
    tags: ["JS Core", "Scope"],
    faqs: [
      { question: "What is lexical scoping?", answer: "Lexical scoping defines how variable names are resolved in nested functions based on their physical location in code." }
    ]
  },
  {
    question: "Explain event delegation in JavaScript and why we should use it.",
    slug: "event-delegation",
    answer: "Event delegation is a technique where instead of adding event listeners directly to multiple child elements, we attach a single event listener to their parent element. It works due to 'event bubbling' (events propagate upwards through the DOM tree). It saves memory, improves performance, and automatically handles dynamic elements added to the parent later.",
    example: "```javascript\ndocument.getElementById('parent').addEventListener('click', (e) => {\n  if (e.target.tagName === 'LI') {\n    console.log('Clicked:', e.target.textContent);\n  }\n});\n```",
    category: "JavaScript",
    difficulty: "easy",
    tags: ["DOM Events", "Performance"],
    faqs: [
      { question: "What is event bubbling?", answer: "Event bubbling is the phase of event propagation where the event bubbles up from the target element through its ancestors." }
    ]
  },
  {
    question: "What is the difference between interfaces and type aliases in TypeScript?",
    slug: "interface-vs-type",
    answer: "Interfaces are extendable via declaration merging (defining the same interface name multiple times stacks fields) and are typically preferred for object structures. Type aliases can define primitives, unions, intersections, and tuples, making them more versatile, but they cannot be merged through duplicate declarations.",
    example: "```typescript\ninterface User { name: string; }\ninterface User { age: number; } // Merged\n\ntype Point = { x: number } | { y: number }; // Union type supported\n```",
    category: "TypeScript",
    difficulty: "easy",
    tags: ["TS Types", "Interfaces"],
    faqs: [
      { question: "Can a class implement a type alias?", answer: "Yes, a class can implement a type alias as long as the type represents an object structure." }
    ]
  },
  {
    question: "How does server-side rendering (SSR) in Next.js App Router differ from Static Site Generation (SSG)?",
    slug: "ssr-vs-ssg",
    answer: "SSR (Dynamic Rendering) fetches data and generates the HTML on every incoming request, ensuring information is always up-to-date. SSG (Static Rendering) pre-renders the page at build-time, serving static files directly from a CDN for lightning-fast speeds. Next.js controls this using dynamic cache configurations, generateStaticParams, or page routing variables.",
    example: "```typescript\n// Server component page default dynamically rendered (SSR)\nexport default async function Page() {\n  const res = await fetch('https://api...', { cache: 'no-store' });\n  const data = await res.json();\n  return <div>{data.title}</div>;\n}\n```",
    category: "Next.js",
    difficulty: "medium",
    tags: ["Next.js Router", "Rendering"],
    faqs: [
      { question: "What is static generation in Next.js?", answer: "Static Site Generation (SSG) pre-renders HTML pages during the build process, serving them statically for fast execution." }
    ]
  },
  {
    question: "How would you handle global error boundaries in Express or Node.js backend apps?",
    slug: "express-error-handling",
    answer: "Implement a centralized error-handling middleware as the last middleware registered on the Express app. This middleware takes 4 arguments: (err, req, res, next). Inside, you log the error trace, determine status codes, and return structured JSON responses to prevent server crashes and client-side information exposure.",
    example: "```javascript\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Something broke!' });\n});\n```",
    category: "Node.js",
    difficulty: "medium",
    tags: ["Express", "Error Handling"],
    faqs: [
      { question: "What is Express middleware?", answer: "Middleware functions are functions that have access to the request object, response object, and next middleware function." }
    ]
  },
  {
    question: "How do you optimize FlatList rendering performance in React Native?",
    slug: "what-is-flatlist",
    answer: "FlatList optimization centers on reducing memory layout footprint and avoiding extra re-renders. Use keyExtractor to uniquely identify rows, implement getItemLayout to bypass dynamic layout measurement offsets, set initialNumToRender to a small value, and memoize renderItem components.",
    example: "```javascript\n<FlatList\n  data={items}\n  keyExtractor={(item) => item.id}\n  getItemLayout={(data, index) => (\n    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }\n  )}\n  renderItem={memoizedRenderItem}\n/>\n```",
    category: "React Native",
    difficulty: "hard",
    tags: ["Mobile", "FlatList", "Performance"],
    faqs: [
      { question: "What is getItemLayout used for?", answer: "getItemLayout allows React Native to skip dynamic calculation of row heights, speeding up scroll rendering." }
    ]
  },
  {
    question: "Explain the Event Loop in Node.js and its phases.",
    slug: "what-is-event-loop",
    answer: "The Event Loop allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It delegates operations to the system kernel whenever possible. Its phases include: timers, pending callbacks, idle/prepare, poll (fetches new I/O events), check (runs setImmediate), and close callbacks.",
    example: "```javascript\nsetTimeout(() => console.log('Timer 1'), 0);\nsetImmediate(() => console.log('Immediate 1'));\nprocess.nextTick(() => console.log('NextTick 1'));\n// Prints: NextTick 1, Timer 1, Immediate 1\n```",
    category: "Node.js",
    difficulty: "hard",
    tags: ["Node Core", "Event Loop"],
    faqs: [
      { question: "What is process.nextTick?", answer: "process.nextTick schedules a callback to run immediately after the current phase of the event loop finishes." }
    ]
  },
  {
    question: "Tell me about a time you had a technical disagreement with a colleague. How did you resolve it?",
    slug: "technical-disagreement",
    answer: "Explain a specific scenario using the STAR framework. Highlight that you listened to their rationale, backed up your arguments with objective criteria (like bundle benchmarks, memory load, documentation), did a small proof-of-concept sandbox comparison, and aligned on the choice that was best for project scalability and maintenance.",
    example: "STAR reply format example: Situation: Team had a split on choosing REST or GraphQL. Task: Resolve the conflict. Action: Built small prototypes of both and benchmarked payload size. Result: Aligned on GraphQL because it reduced mobile payload size by 40%.",
    category: "HR Interview",
    difficulty: "easy",
    tags: ["Soft Skills", "Collaboration"],
    faqs: [
      { question: "What is the STAR method?", answer: "STAR stands for Situation, Task, Action, and Result. It is a structured technique for behavioral interview answers." }
    ]
  }
];

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const slug = searchParams.get("slug");

    // Clean migration check for development: ensure seeds include slugs
    const count = await Question.countDocuments();
    if (count < 8) {
      await Question.deleteMany({});
      await Question.insertMany(SEED_QUESTIONS);
    }

    if (slug) {
      // Return single question and increment views
      const question = await Question.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true });
      if (!question) {
        return NextResponse.json({ message: "Question not found" }, { status: 404 });
      }
      return NextResponse.json(question);
    }

    const filter: any = {};
    if (category) {
      // Category parameter matches slug categories (e.g. react-native -> React Native)
      const mappedCategory = category.toLowerCase() === "react-native" ? "React Native" :
                             category.toLowerCase() === "hr-interview" ? "HR Interview" :
                             category.toLowerCase() === "nextjs" ? "Next.js" :
                             category.toLowerCase() === "nodejs" ? "Node.js" :
                             category.charAt(0).toUpperCase() + category.slice(1);
                             
      filter.category = { $regex: new RegExp(`^${mappedCategory}$`, "i") };
    }
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
    const body = await req.json();

    const formatQuestion = (data: any) => {
      const { question, answer, category, difficulty, tags, example, faqs } = data;
      if (!question || !answer || !category || !difficulty) {
        throw new Error(`Missing required fields (question, answer, category, or difficulty) for: "${question || 'Unknown'}"`);
      }

      const slug = question
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return {
        question,
        slug,
        answer,
        category,
        difficulty: difficulty.toLowerCase(),
        tags: tags || [],
        example: example || "",
        faqs: faqs || [],
        views: 0
      };
    };

    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ message: "Empty questions array provided" }, { status: 400 });
      }
      const preparedQuestions = body.map((item: any) => formatQuestion(item));
      const newQuestions = await Question.insertMany(preparedQuestions);
      return NextResponse.json({
        message: `Successfully inserted ${newQuestions.length} questions`,
        insertedCount: newQuestions.length,
        data: newQuestions
      }, { status: 201 });
    } else {
      const prepared = formatQuestion(body);
      const newQuestion = await Question.create(prepared);
      return NextResponse.json(newQuestion, { status: 201 });
    }
  } catch (error: any) {
    console.error("Questions POST API error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
