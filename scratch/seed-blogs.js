const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://jeevanbhargav286_db_user:npxCDKlWToV0DFww@ac-f3fv1k4-shard-00-00.qqy53lu.mongodb.net:27017,ac-f3fv1k4-shard-00-01.qqy53lu.mongodb.net:27017,ac-f3fv1k4-shard-00-02.qqy53lu.mongodb.net:27017/interviewace?ssl=true&replicaSet=atlas-a723g7-shard-0&authSource=admin&retryWrites=true&w=majority";

const CommentSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userImage: { type: String, default: "" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    coverImage: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: {
      name: { type: String, required: true },
      image: { type: String, default: "" },
      bio: { type: String, default: "" },
    },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

const BLOGS = [
  {
    title: "React 19 New Features You Need to Know in 2026",
    slug: "react-19-new-features-2026",
    summary: "React 19 brings powerful new features like Actions, useOptimistic, and the new compiler. Learn how these changes can make your React apps faster and easier to build.",
    content: `# React 19 New Features You Need to Know in 2026\n\nReact 19 is a major release that changes how we think about data fetching, mutations, and rendering. Let's explore what's new.\n\n---\n\n## 1. React Actions\n\nActions replace the old pattern of manually managing \`isPending\`, \`error\`, and \`success\` states.\n\n\`\`\`jsx\nasync function submitForm(formData) {\n  await saveUser(formData);\n}\n\n<form action={submitForm}>\n  <input name="name" />\n  <button type="submit">Save</button>\n</form>\n\`\`\`\n\nReact now handles the pending state automatically.\n\n---\n\n## 2. useOptimistic Hook\n\nUpdate the UI optimistically before a server response arrives.\n\n\`\`\`jsx\nconst [optimisticLikes, addOptimisticLike] = useOptimistic(\n  likes,\n  (state, newLike) => [...state, newLike]\n);\n\`\`\`\n\nThis gives users instant feedback.\n\n---\n\n## 3. use() Hook\n\nThe new \`use()\` hook lets you read promises and context inside render.\n\n\`\`\`jsx\nconst data = use(fetchUserData());\n\`\`\`\n\nThis works with Suspense for clean async data loading.\n\n---\n\n## 4. React Compiler\n\nThe React compiler automatically memoizes your components and hooks — no need for manual \`useMemo\` or \`useCallback\` in most cases.\n\n---\n\n## 5. Document Metadata Support\n\nYou can now render \`<title>\` and \`<meta>\` tags directly inside components:\n\n\`\`\`jsx\nfunction BlogPost({ title }) {\n  return (\n    <>\n      <title>{title}</title>\n      <meta name="description" content="Blog post" />\n      <h1>{title}</h1>\n    </>\n  );\n}\n\`\`\`\n\n---\n\n## Final Thoughts\n\nReact 19 is the most impactful release in years. Start experimenting with Actions and the compiler today to stay ahead.\n\nHappy Coding!`,
    category: "React",
    tags: ["React", "React 19", "Frontend", "Web Development", "JavaScript"],
    coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    },
    isFeatured: true
  },
  {
    title: "Mastering React Context API for State Management",
    slug: "mastering-react-context-api",
    summary: "Context API is a powerful built-in tool for managing global state in React apps. Learn when to use it, how to structure it, and how to avoid common performance pitfalls.",
    content: `# Mastering React Context API for State Management\n\nMany developers jump to Redux or Zustand without exploring the built-in Context API. Used correctly, it can handle most small to medium app needs.\n\n---\n\n## Creating a Context\n\n\`\`\`jsx\nimport { createContext, useContext, useState } from 'react';\n\nconst AuthContext = createContext(null);\n\nexport function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  return (\n    <AuthContext.Provider value={{ user, setUser }}>\n      {children}\n    </AuthContext.Provider>\n  );\n}\n\nexport function useAuth() {\n  return useContext(AuthContext);\n}\n\`\`\`\n\n---\n\n## Using the Context\n\n\`\`\`jsx\nfunction Profile() {\n  const { user } = useAuth();\n  return <h1>Hello, {user?.name}</h1>;\n}\n\`\`\`\n\n---\n\n## Avoiding Performance Issues\n\nSplit contexts by concern. Avoid putting everything in one context:\n\n- \`AuthContext\` for user data\n- \`ThemeContext\` for UI preferences\n- \`CartContext\` for shopping cart\n\nThis ensures components only re-render when their specific context changes.\n\n---\n\n## When to Use Context vs Zustand\n\n| Use Case | Context API | Zustand |\n|---|---|---|\n| Simple global state | Yes | Yes |\n| Complex updates | No | Yes |\n| DevTools support | No | Yes |\n\n---\n\n## Final Thoughts\n\nContext API is great for auth, theme, and language. For complex state with frequent updates, consider Zustand or Jotai.\n\nHappy Coding!`,
    category: "React",
    tags: ["React", "Context API", "State Management", "Frontend", "Hooks"],
    coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "Building Custom React Hooks That Actually Save Time",
    slug: "building-custom-react-hooks",
    summary: "Custom hooks are the best way to share logic across components in React. Learn how to build reusable hooks for fetching data, form handling, debouncing, and more.",
    content: `# Building Custom React Hooks That Actually Save Time\n\nCustom hooks let you extract stateful logic into reusable functions. Here are the most useful ones you can build today.\n\n---\n\n## useFetch — Data Fetching Hook\n\n\`\`\`jsx\nfunction useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    fetch(url)\n      .then(res => res.json())\n      .then(setData)\n      .catch(setError)\n      .finally(() => setLoading(false));\n  }, [url]);\n\n  return { data, loading, error };\n}\n\`\`\`\n\n---\n\n## useDebounce — Delay Input Processing\n\n\`\`\`jsx\nfunction useDebounce(value, delay = 500) {\n  const [debounced, setDebounced] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debounced;\n}\n\`\`\`\n\n---\n\n## useLocalStorage — Persistent State\n\n\`\`\`jsx\nfunction useLocalStorage(key, initial) {\n  const [value, setValue] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initial;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}\n\`\`\`\n\n---\n\n## Final Thoughts\n\nCustom hooks are one of the most powerful patterns in React. Start extracting repeated logic today.\n\nHappy Coding!`,
    category: "React",
    tags: ["React", "Custom Hooks", "React Hooks", "Frontend", "Reusability"],
    coverImage: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "Next.js 15 App Router: The Complete Guide",
    slug: "nextjs-15-app-router-guide",
    summary: "Next.js 15 App Router introduces layouts, server components, streaming, and more. Learn how to build production-grade apps with the latest Next.js features.",
    content: `# Next.js 15 App Router: The Complete Guide\n\nThe App Router is now the default way to build Next.js applications. Here's everything you need to know.\n\n---\n\n## Folder Structure\n\n\`\`\`\napp/\n  layout.tsx\n  page.tsx\n  blog/\n    page.tsx\n    [id]/\n      page.tsx\n\`\`\`\n\nEvery folder with a \`page.tsx\` becomes a route automatically.\n\n---\n\n## Server Components by Default\n\nAll components in the App Router are server components by default.\n\n\`\`\`tsx\nexport default async function BlogPage() {\n  const posts = await fetchPosts(); // runs on server\n  return <PostList posts={posts} />;\n}\n\`\`\`\n\n---\n\n## Client Components\n\nAdd \`'use client'\` for interactivity:\n\n\`\`\`tsx\n'use client';\nimport { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n\`\`\`\n\n---\n\n## Layouts\n\nLayouts persist across routes:\n\n\`\`\`tsx\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <body>\n        <Navbar />\n        {children}\n        <Footer />\n      </body>\n    </html>\n  );\n}\n\`\`\`\n\n---\n\n## Final Thoughts\n\nNext.js 15 App Router is the future of React development. Invest time in learning server components — they'll change how you build apps.\n\nHappy Coding!`,
    category: "Next.js",
    tags: ["Next.js", "App Router", "Server Components", "React", "Full Stack"],
    coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "Server Actions in Next.js: Replace Your API Routes",
    slug: "server-actions-nextjs",
    summary: "Server Actions let you run server-side code directly from your React components without building API endpoints. Learn how to use them for forms, mutations, and database calls.",
    content: `# Server Actions in Next.js: Replace Your API Routes\n\nServer Actions are one of the most exciting features in modern Next.js. They let you call server-side functions directly from your UI.\n\n---\n\n## Defining a Server Action\n\n\`\`\`tsx\n// app/actions/user.ts\n'use server';\n\nexport async function createUser(formData: FormData) {\n  const name = formData.get('name') as string;\n  await db.user.create({ data: { name } });\n}\n\`\`\`\n\n---\n\n## Using it in a Form\n\n\`\`\`tsx\nimport { createUser } from '../actions/user';\n\nexport default function CreateUserForm() {\n  return (\n    <form action={createUser}>\n      <input name="name" placeholder="Your name" />\n      <button type="submit">Create</button>\n    </form>\n  );\n}\n\`\`\`\n\nNo API route needed!\n\n---\n\n## Revalidating Data\n\n\`\`\`tsx\n'use server';\nimport { revalidatePath } from 'next/cache';\n\nexport async function deletePost(id: string) {\n  await db.post.delete({ where: { id } });\n  revalidatePath('/blog');\n}\n\`\`\`\n\n---\n\n## Final Thoughts\n\nServer Actions simplify your codebase by removing the need for separate API routes for most CRUD operations.\n\nHappy Coding!`,
    category: "Next.js",
    tags: ["Next.js", "Server Actions", "Full Stack", "React", "Backend"],
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "Building REST APIs with Node.js and Express in 2026",
    slug: "building-rest-apis-nodejs",
    summary: "Node.js and Express remain the most popular backend stack for JavaScript developers. Learn how to build scalable, secure REST APIs from scratch with modern practices.",
    content: `# Building REST APIs with Node.js and Express in 2026\n\nExpress.js is still the most widely used backend framework in the Node.js ecosystem. Let's build a production-ready API.\n\n---\n\n## Project Setup\n\n\`\`\`bash\nnpm init -y\nnpm install express cors helmet morgan dotenv\nnpm install -D typescript ts-node @types/express nodemon\n\`\`\`\n\n---\n\n## Basic Server\n\n\`\`\`ts\nimport express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\n\nconst app = express();\napp.use(express.json());\napp.use(cors());\napp.use(helmet());\n\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));\n\`\`\`\n\n---\n\n## Error Handling Middleware\n\n\`\`\`ts\napp.use((err: Error, req, res, next) => {\n  console.error(err.message);\n  res.status(500).json({ error: err.message });\n});\n\`\`\`\n\n---\n\n## Final Thoughts\n\nExpress is simple, flexible, and battle-tested. Combined with TypeScript, it gives you a clean and maintainable backend.\n\nHappy Coding!`,
    category: "Node.js / Backend",
    tags: ["Node.js", "Express", "REST API", "Backend", "JavaScript"],
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "Node.js Authentication with JWT and Refresh Tokens",
    slug: "nodejs-auth-jwt",
    summary: "Learn how to implement secure authentication in Node.js using JSON Web Tokens and refresh tokens. Covers login, token storage, expiry, and refresh flow.",
    content: `# Node.js Authentication with JWT and Refresh Tokens\n\nJWT authentication is the industry standard for stateless APIs. Here's how to implement it properly with refresh tokens.\n\n---\n\n## Login and Token Generation\n\n\`\`\`ts\nimport jwt from 'jsonwebtoken';\n\nasync function login(email: string, password: string) {\n  const user = await db.user.findUnique({ where: { email } });\n  const valid = await bcrypt.compare(password, user.password);\n  if (!valid) throw new Error('Invalid credentials');\n\n  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '15m' });\n  const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET!, { expiresIn: '7d' });\n\n  return { accessToken, refreshToken };\n}\n\`\`\`\n\n---\n\n## Refresh Token Route\n\n\`\`\`ts\nrouter.post('/refresh', (req, res) => {\n  const { refreshToken } = req.body;\n  const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as any;\n  const accessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });\n  res.json({ accessToken });\n});\n\`\`\`\n\n---\n\n## Final Thoughts\n\nShort-lived access tokens + long-lived refresh tokens is the safest JWT pattern. Always store refresh tokens in httpOnly cookies.\n\nHappy Coding!`,
    category: "Node.js / Backend",
    tags: ["Node.js", "JWT", "Authentication", "Security", "Backend"],
    coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "TypeScript for React Developers: A Practical Guide",
    slug: "typescript-react-guide",
    summary: "TypeScript makes React apps safer and easier to refactor. Learn how to type props, state, hooks, events, and API responses with practical examples.",
    content: `# TypeScript for React Developers: A Practical Guide\n\nAdding TypeScript to your React project catches bugs before they happen. Here's everything you need to get started.\n\n---\n\n## Typing Props\n\n\`\`\`tsx\ntype ButtonProps = {\n  label: string;\n  onClick: () => void;\n  variant?: 'primary' | 'secondary';\n};\n\nfunction Button({ label, onClick, variant = 'primary' }: ButtonProps) {\n  return <button onClick={onClick} className={variant}>{label}</button>;\n}\n\`\`\`\n\n---\n\n## Typing useState\n\n\`\`\`tsx\nconst [count, setCount] = useState<number>(0);\nconst [user, setUser] = useState<User | null>(null);\n\`\`\`\n\n---\n\n## Typing Events\n\n\`\`\`tsx\nfunction handleChange(e: React.ChangeEvent<HTMLInputElement>) {\n  setValue(e.target.value);\n}\n\`\`\`\n\n---\n\n## Final Thoughts\n\nTypeScript pays dividends on large codebases. The initial learning curve is worth it. Start by typing props and work your way deeper.\n\nHappy Coding!`,
    category: "TypeScript",
    tags: ["TypeScript", "React", "Frontend", "Type Safety", "JavaScript"],
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "JavaScript Closures, Scope, and Hoisting Explained",
    slug: "javascript-closures-scope-hoisting",
    summary: "Closures and hoisting are fundamental JavaScript concepts that appear in almost every interview. This guide explains them clearly with visual examples and code.",
    content: `# JavaScript Closures, Scope, and Hoisting Explained\n\nThese three concepts are the foundation of JavaScript. Understanding them makes you a better developer and interview candidate.\n\n---\n\n## Closures\n\nA closure is when a function retains access to its outer scope even after the outer function has returned.\n\n\`\`\`js\nfunction makeCounter() {\n  let count = 0;\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n\`\`\`\n\n---\n\n## Hoisting\n\n\`\`\`js\nconsole.log(name); // undefined\nvar name = 'Jeevan';\n\`\`\`\n\n\`\`\`js\nconsole.log(age); // ReferenceError\nlet age = 25;\n\`\`\`\n\n---\n\n## Final Thoughts\n\nClosures power many patterns in JavaScript including callbacks, data privacy, and factory functions. Master them and interviews become much easier.\n\nHappy Coding!`,
    category: "JavaScript",
    tags: ["JavaScript", "Closures", "Hoisting", "Scope", "Interview"],
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "5 Crucial Interview Tips for Frontend Engineers",
    slug: "5-crucial-interview-tips-frontend",
    summary: "Ready to land your dream frontend role? Here are 5 battle-tested interview tips focusing on DOM internals, CSS layouts, system design, and coding performance.",
    content: `# 5 Crucial Interview Tips for Frontend Engineers\n\nGetting a frontend job in 2026 requires more than just knowing basic React. You need to demonstrate a deep understanding of browser mechanics and layout engines. Here are 5 tips to ace your interview.\n\n---\n\n## 1. Master Browser Rendering Pipeline\n\nUnderstand how the browser converts HTML, CSS, and JS into pixels. Be prepared to explain:\n- The DOM and CSSOM trees\n- Layout, Paint, and Composite phases\n- How to avoid layout shifts (CLS) and optimize First Contentful Paint (FCP)\n\n---\n\n## 2. Talk about Performance Metrics\n\nDon't just write working code; write fast code. Mention techniques like:\n- Debouncing and throttling scroll/resize events\n- Lazy loading routes and images\n- Virtualizing extremely long lists using windowing libraries\n\n---\n\n## 3. Practice Core JavaScript Without Frameworks\n\nMany interviewers will ask you to build things (like a custom Promise structure or custom array methods) in pure JavaScript. Ensure you are comfortable with closures, prototype chains, and event delegation.\n\n---\n\n## 4. Solve Frontend System Design Systematically\n\nWhen asked to design an app like Netflix or Twitter, use a structured framework:\n1. **Requirements Gathering**: Target audience, devices, key features.\n2. **Architecture**: Key components, data flow, state management.\n3. **Network API**: REST vs GraphQL, polling vs WebSockets.\n4. **Performance & Optimization**: Caching, CDN strategies, bundle splitting.\n\n---\n\n## 5. Prepare STAR Behavioral Answers\n\nWhen asked about difficult stakeholders or technical debt, structure your answers with **STAR**:\n- **Situation**: Context of what happened.\n- **Task**: The challenge you needed to resolve.\n- **Action**: What steps you took.\n- **Result**: What outcomes were achieved.\n\n---\n\n## Final Thoughts\n\nConfidence comes from preparation. Good luck with your interview!\n\nHappy Coding!`,
    category: "Interview Tips",
    tags: ["Interview Tips", "Frontend", "Career", "Web Dev"],
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "System Design Interview Cheat Sheet for Full Stack Engineers",
    slug: "system-design-interview-cheat-sheet",
    summary: "Scaling an application requires strong architectural foundations. Use this handy cheat sheet to master databases, load balancing, caching, and CDN architectures.",
    content: `# System Design Interview Cheat Sheet for Full Stack Engineers\n\nSystem design interviews check your ability to build scalable, resilient architectures. Here are the core building blocks.\n\n---\n\n## 1. Horizontal vs Vertical Scaling\n\n- **Vertical Scaling (Scaling Up)**: Adding more RAM and CPU to a single server. Limited by hardware capacity.\n- **Horizontal Scaling (Scaling Out)**: Adding more servers to a resource pool. Requires a load balancer.\n\n---\n\n## 2. Load Balancers\n\nDistribute network traffic across multiple servers. Algorithms include:\n- **Round Robin**: Sequential distribution.\n- **Least Connections**: Sends traffic to the server with fewest active sessions.\n- **IP Hash**: Distributes based on client IP addresses (good for sticky sessions).\n\n---\n\n## 3. Caching Strategies\n\nUse caching to reduce database loads. Popular strategies:\n- **Cache-Aside**: Application queries cache first, reads from DB on cache miss and updates cache.\n- **Write-Through**: Application writes to cache and DB simultaneously.\n- **Write-Behind (Write-Back)**: Application writes to cache first, DB updated asynchronously later.\n\n---\n\n## 4. SQL vs NoSQL Databases\n\n| Feature | Relational (SQL) | Non-Relational (NoSQL) |\n|---|---|---|\n| Schema | Structured / Rigid | Dynamic / Flexible |\n| Scaling | Vertically | Horizontally |\n| Transaction | ACID Compliant | BASE (Eventual Consistency) |\n| Examples | PostgreSQL, MySQL | MongoDB, Cassandra |\n\n---\n\n## Final Thoughts\n\nAlways start by asking clarifying questions about scale, budget, and system constraints before drawing any boxes.\n\nHappy Coding!`,
    category: "System Design",
    tags: ["System Design", "Scaling", "Database", "Architecture"],
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "How to Structure Your Resume to Pass ATS Screeners",
    slug: "structure-resume-pass-ats",
    summary: "Is your resume getting auto-rejected? Learn how Applicant Tracking Systems parse your PDF and how to optimize it for keywords, formatting, and sections.",
    content: `# How to Structure Your Resume to Pass ATS Screeners\n\nOver 90% of large companies use Applicant Tracking Systems (ATS) to filter resumes before human eyes see them. Here is how to format yours for success.\n\n---\n\n## 1. Use Simple Formatting\n\nATS parsers are easily confused by complex layouts. Avoid:\n- Multi-column tables\n- Embedded images or graphics\n- Text boxes or headers/footers\n- Non-standard fonts\n\nUse standard fonts like Arial, Calibri, or Times New Roman, and structure in a single, clear column.\n\n---\n\n## 2. Match Keywords in Job Descriptions\n\nParse the target job description for critical keywords (e.g. \"Next.js\", \"System Design\", \"CI/CD\"). Inject these exact phrases naturally into your Experience and Skills sections.\n\n---\n\n## 3. Use Standard Section Headings\n\nKeep it simple so the parser categorizes your background correctly:\n- **Contact Information**\n- **Professional Summary**\n- **Work Experience**\n- **Education**\n- **Skills**\n\n---\n\n## 4. Focus on Quantifiable Impact\n\nInstead of writing \"Wrote frontend components in React,\" write: \n> \"Developed React-based dashboard which improved page load speeds by 30% and boosted weekly active user retention by 12%.\"\n\n---\n\n## Final Thoughts\n\nAlways export your resume as a clean, text-based PDF or DOCX file. Good luck with your job hunt!\n\nHappy Coding!`,
    category: "Resume Tips",
    tags: ["Resume Tips", "ATS", "Career Advice", "Job Search"],
    coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "React Native New Architecture: Fabric & TurboModules",
    slug: "react-native-new-architecture-fabric-turbomodules",
    summary: "The React Native New Architecture is here. Understand Fabric, TurboModules, and the Javascript Interface (JSI) that makes mobile apps run at 60fps.",
    content: `# React Native New Architecture: Fabric & TurboModules\n\nReact Native has historically relied on an asynchronous JSON bridge for JS-to-Native communication. The New Architecture completely changes this by introducing the JavaScript Interface (JSI).\n\n---\n\n## 1. The JavaScript Interface (JSI)\n\nJSI allows JavaScript to hold reference to Native C++ host objects. This means you can call native methods directly and synchronously, removing the JSON serialization overhead.\n\n---\n\n## 2. Fabric Renderer\n\nFabric is the new concurrent layout rendering engine. It runs synchronously, enabling fluid user interactions, high-speed list scrolling, and instant UI responsiveness without thread bottlenecking.\n\n---\n\n## 3. TurboModules\n\nTurboModules allow native modules to be lazy-loaded on demand instead of being fully initialized at app startup. This drastically decreases cold launch times for complex apps.\n\n---\n\n## Final Thoughts\n\nEmbracing JSI and Fabric is crucial for future-proofing your mobile apps. Start configuring your NativeModules using C++ interfaces today.\n\nHappy Coding!`,
    category: "React Native",
    tags: ["React Native", "Mobile", "Architecture", "Fabric"],
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "MongoDB Aggregation Framework Masterclass",
    slug: "mongodb-aggregation-framework-masterclass",
    summary: "Learn how to build powerful data processing pipelines in MongoDB. Master $match, $group, $lookup, and $project stages for reporting and analytics.",
    content: `# MongoDB Aggregation Framework Masterclass\n\nMongoDB's Aggregation Framework is a powerful tool for running multi-stage analytical queries directly on your database. Let's explore the core pipeline stages.\n\n---\n\n## 1. What is an Aggregation Pipeline?\n\nAn aggregation pipeline consists of one or more stages that process documents sequentially. Each stage performs an operation (filtering, grouping, reshaping) and passes the result to the next stage.\n\n---\n\n## 2. Key Pipeline Stages\n\n- **$match**: Filters documents based on conditions (similar to query filters).\n- **$group**: Groups documents by a specified key and performs accumulative operations (like sums, averages).\n- **$project**: Reshapes documents by adding, renaming, or removing fields.\n- **$lookup**: Performs left-outer joins with other collections.\n\n\`\`\`javascript\ndb.orders.aggregate([\n  { $match: { status: "completed" } },\n  { $group: { _id: "$customerId", totalSpent: { $sum: "$amount" } } }\n]);\n\`\`\`\n\n---\n\n## Final Thoughts\n\nMinimize the amount of data processed by placing \`$match\` stages at the very beginning of your pipeline to leverage database indexes.\n\nHappy Coding!`,
    category: "MongoDB",
    tags: ["MongoDB", "Database", "Aggregation", "NoSQL"],
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "Staff Engineer Roadmap: Scaling Your Impact Beyond Code",
    slug: "staff-engineer-roadmap-scaling-impact",
    summary: "Transitioning to a Staff Engineer level requires shifts in scope, leadership, and influence. Learn how to design technical visions and mentor teams.",
    content: `# Staff Engineer Roadmap: Scaling Your Impact Beyond Code\n\nGetting promoted to Staff level is not just about writing more code. It represents a pivot from individual output to organizational leverage. Here is the roadmap to get there.\n\n---\n\n## 1. Shift from Code to Architectural Vision\n\nStaff Engineers focus on multi-quarter and multi-year technical strategies. You should:\n- Author Technical RFCs (Request for Comments)\n- Standardize API interfaces across team silos\n- Design systems that scale gracefully for 10x current volumes\n\n---\n\n## 2. Build Leverage Through Sponsorship\n\nRather than executing all tasks yourself, mentor and sponsor junior engineers. Help them lead projects, write designs, and present architectural proposals.\n\n---\n\n## 3. Bridge Engineering and Business Goals\n\nAlign technical upgrades with business deliverables. Translate refactoring efforts into metric impact, such as reduced server hosting costs or improved page load retention.\n\n---\n\n## Final Thoughts\n\nInfluence is built on trust, clear documentation, and empathy. True technical leadership is about elevating everyone around you.\n\nHappy Coding!`,
    category: "Career Growth",
    tags: ["Career Growth", "Leadership", "Staff Engineer", "Tech Career"],
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "Behavioral Interview Prep: The STAR Framework Master Guide",
    slug: "behavioral-interview-prep-star-framework",
    summary: "Ace behavioral interview questions using the STAR framework. Learn how to draft answers for conflict resolution, failure, and execution challenges.",
    content: `# Behavioral Interview Prep: The STAR Framework Master Guide\n\nMany candidates fail behavioral interviews because their answers are unstructured or too long. The STAR framework keeps your stories concise and impact-driven.\n\n---\n\n## 1. What is the STAR Framework?\n\n- **Situation**: Describe the context and background briefly.\n- **Task**: Explain the challenge or target that needed resolution.\n- **Action**: Outline the specific steps YOU took (use "I", not "we").\n- **Result**: Quantify the positive outcomes and key takeaways.\n\n---\n\n## 2. Core Themes to Prepare\n\nDraft 3 to 4 stories from your career covering these key pillars:\n- **Conflict**: How you resolved an architectural disagreement.\n- **Failure**: A bug or project delay you learned from.\n- **Leadership**: A time you spearheaded a technical initiative.\n\n---\n\n## Final Thoughts\n\nFocus 70% of your talking time on Actions and Results. Keep your Situation and Task under 90 seconds.\n\nHappy Coding!`,
    category: "Interview Preparation",
    tags: ["Interview Prep", "Behavioral", "STAR Method", "Soft Skills"],
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  },
  {
    title: "AI-Assisted Development: Prompting LLMs for Clean Code",
    slug: "ai-assisted-development-prompting-llms",
    summary: "Large Language Models (LLMs) can accelerate your development speed. Learn how to prompt models for complete React components, tests, and API routes.",
    content: `# AI-Assisted Development: Prompting LLMs for Clean Code\n\nUsing AI tools like Copilot, Gemini, or ChatGPT effectively requires prompting skills. Learn how to construct context-rich prompts that deliver production-grade code.\n\n---\n\n## 1. Provide System Roles and Constraints\n\nWhen asking for code, define the tech stack and coding guidelines explicitly:\n> "Act as a Senior React Engineer. Write a React 19 component using TypeScript. Do not use external CSS libraries, write vanilla inline styles."\n\n---\n\n## 2. Give One-Shot Examples\n\nIf you want the AI to write tests matching your style, paste an existing test file first as a pattern for it to mirror.\n\n---\n\n## 3. Request Iterative Refactoring\n\nDon't expect perfect code on prompt #1. Ask the model to optimize its first response for performance, accessibility, or security bounds.\n\n---\n\n## Final Thoughts\n\nAI is an excellent co-pilot, but you remain the pilot. Always review, test, and understand the code before pushing it to production.\n\nHappy Coding!`,
    category: "AI Tools",
    tags: ["AI Tools", "AI Coding", "Gemini", "Software Development"],
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop",
    author: {
      name: "Jeevan Bhargav",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer."
    }
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Clearing existing blogs collection...");
    await Blog.deleteMany({});
    console.log("Cleared existing blogs!");

    console.log(`Inserting ${BLOGS.length} high-quality blog posts...`);
    const inserted = await Blog.insertMany(BLOGS);
    console.log(`Successfully seeded ${inserted.length} blogs into database!`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
