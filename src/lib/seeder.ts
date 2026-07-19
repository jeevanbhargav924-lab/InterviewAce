import Blog from "@/models/Blog";
import Question from "@/models/Question";
import Challenge from "@/models/Challenge";

export const SEED_BLOGS = [
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

export const SEED_QUESTIONS = [
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
    question: "What are React Server Components (RSC) and how do they differ from Client Components?",
    slug: "react-server-components-rsc",
    answer: "React Server Components are rendered exclusively on the server, meaning their dependencies are not bundled into the client-side JavaScript bundle, making the site load faster. Client Components, marked with 'use client', are hydrated on the client and support user interactivity, state hooks, and browser APIs.",
    example: "```tsx\n// Server Component by default\nexport default async function ProfilePage() {\n  const user = await db.fetchUser();\n  return <UserProfile user={user} />;\n}\n```",
    category: "React",
    difficulty: "hard",
    tags: ["React Components", "RSC", "SSR"],
    faqs: [
      { question: "Do Server Components have state?", answer: "No, Server Components cannot use hooks like useState or useEffect because they execute only on the server." }
    ]
  },
  {
    question: "How does React 19's useActionState hook simplify form submissions?",
    slug: "react-19-useactionstate-hook",
    answer: "React 19's useActionState hook (previously useFormState) streamlines asynchronous form actions. It automatically tracks pending states, executes asynchronous operations safely, and exposes error/success responses without manual isPending and error trackers.",
    example: "```jsx\n// React 19 Action pattern\nconst [state, formAction, isPending] = useActionState(async (prevState, formData) => {\n  return await updateProfile(formData);\n}, null);\n\nreturn <form action={formAction}>{isPending ? 'Updating...' : 'Save'}</form>;\n```",
    category: "React",
    difficulty: "medium",
    tags: ["React 19", "React Hooks", "Forms"],
    faqs: [
      { question: "Can useActionState replace custom form handling states?", answer: "Yes, it manages async transition states natively, minimizing state variables." }
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
    question: "What is prototypal inheritance in JavaScript and how does it work?",
    slug: "prototypal-inheritance-javascript",
    answer: "In JavaScript, objects inherit properties and methods from other objects via a prototype link. Every object has an internal slot (exposed as __proto__ or via Object.getPrototypeOf) pointing to another object, forming the prototype chain. If a property isn't found on the object itself, JS traverses up the chain until it reaches null.",
    example: "```javascript\nconst animal = { eats: true };\nconst rabbit = Object.create(animal);\nconsole.log(rabbit.eats); // true (inherited)\n```",
    category: "JavaScript",
    difficulty: "medium",
    tags: ["JS Core", "Prototypes"],
    faqs: [
      { question: "What is the terminal object in the prototype chain?", answer: "Object.prototype is the final object in most chains, pointing to null." }
    ]
  },
  {
    question: "How does the JavaScript Event Loop handle asynchronous code execution?",
    slug: "javascript-event-loop-concurrency",
    answer: "JavaScript is single-threaded, executing tasks sequentially via a Call Stack. Asynchronous tasks (timers, API requests, events) are delegated to browser WebAPIs. Upon completion, their callbacks are sent to the Macro-task Queue (timers) or Micro-task Queue (Promises). The Event Loop checks the Call Stack; once empty, it processes all micro-tasks first, then processes one macro-task.",
    example: "```javascript\nconsole.log('Start');\nsetTimeout(() => console.log('Timeout'), 0);\nPromise.resolve().then(() => console.log('Promise'));\nconsole.log('End');\n// Prints: Start, End, Promise, Timeout\n```",
    category: "JavaScript",
    difficulty: "hard",
    tags: ["JS Engine", "Event Loop", "Asynchronous"],
    faqs: [
      { question: "What task queue has higher priority?", answer: "The Micro-task Queue is processed completely before any macro-task from the Callback Queue is executed." }
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
    question: "Explain TypeScript Generics and how to use constraints in them.",
    slug: "typescript-generics-constraints",
    answer: "Generics allow developers to create reusable components, functions, or types that work with a variety of types while retaining compile-time type safety. A generic constraint (using 'extends') restricts the types that can be passed into the generic parameter, ensuring the compiler knows certain properties are available.",
    example: "```typescript\n// Constraint: T must have a length property\nfunction logLength<T extends { length: number }>(arg: T): void {\n  console.log(arg.length);\n}\nlogLength('hello'); // OK\n// logLength(123); // Error: number has no length\n```",
    category: "TypeScript",
    difficulty: "medium",
    tags: ["TypeScript", "Generics", "Type Constraints"],
    faqs: [
      { question: "What is the purpose of extends in generics?", answer: "It acts as a constraint forcing the parameter to conform to a specific contract/structure." }
    ]
  },
  {
    question: "How do mapped types and utility types like Pick, Omit, and Partial work in TypeScript?",
    slug: "typescript-mapped-utility-types",
    answer: "Mapped types allow you to create new types based on an existing type by iterating over its keys. TypeScript uses mapped types under the hood for built-in utility types: Partial (makes all fields optional), Required (makes all fields mandatory), Readonly (makes all fields immutable), Pick (extracts selected keys), and Omit (filters out selected keys).",
    example: "```typescript\ninterface User { id: number; name: string; email: string; }\ntype PartialUser = Partial<User>; // All fields optional\ntype UserSummary = Pick<User, 'id' | 'name'>; // Only id and name\n```",
    category: "TypeScript",
    difficulty: "hard",
    tags: ["TypeScript", "Mapped Types", "Utility Types"],
    faqs: [
      { question: "What operator is used in mapped types?", answer: "The 'in keyof' syntax is used to iterate over property keys." }
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
    question: "What are Server Actions in Next.js and how do they replace traditional API routes?",
    slug: "nextjs-server-actions",
    answer: "Server Actions are asynchronous server-side functions called directly from client components. By decorating a function or a file with 'use server', Next.js creates an encrypted POST request under the hood, allowing client-side actions (like button clicks or form submissions) to directly invoke database transactions without writing manually configured REST endpoints.",
    example: "```tsx\n// Form component calling a Server Action\nimport { saveTodo } from './actions';\n\nexport default function TodoApp() {\n  return <form action={saveTodo}><button type='submit'>Add</button></form>;\n}\n```",
    category: "Next.js",
    difficulty: "medium",
    tags: ["Next.js", "Server Actions", "Forms"],
    faqs: [
      { question: "Can Server Actions be called outside of forms?", answer: "Yes, they are standard async functions and can be triggered programmatically in Event Listeners." }
    ]
  },
  {
    question: "Explain the routing layouts and middleware execution flow in Next.js App Router.",
    slug: "nextjs-routing-layouts-middleware",
    answer: "Next.js App Router uses folder-based routing where folders define routes and files (page.js, layout.js) define UI layout behavior. Middleware is executed BEFORE a request is completed, allowing developers to rewrite paths, redirect routes, modify request headers, or perform authentication checks before layout renders.",
    example: "```typescript\n// middleware.ts in root\nimport { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\n\nexport function middleware(request: NextRequest) {\n  return NextResponse.next();\n}\n```",
    category: "Next.js",
    difficulty: "hard",
    tags: ["Next.js", "Routing", "Middleware"],
    faqs: [
      { question: "What is the purpose of layout.tsx?", answer: "It wraps nested pages and components, preventing state resets and re-renders during route navigation." }
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
    question: "What are Node.js streams and buffers, and when should you use them?",
    slug: "nodejs-streams-buffers",
    answer: "A buffer represents a fixed-size chunk of memory allocated outside the V8 engine, used to handle raw binary data. A stream is a mechanism to read or write data incrementally in pieces, avoiding loading the entire file into memory at once. Streams are preferred for parsing large files, video rendering, or high-volume API responses to prevent heap allocation failures.",
    example: "```javascript\nconst fs = require('fs');\n// High memory efficiency\nconst readStream = fs.createReadStream('huge_log.txt');\nconst writeStream = fs.createWriteStream('copy.txt');\nreadStream.pipe(writeStream);\n```",
    category: "Node.js",
    difficulty: "medium",
    tags: ["Node.js Core", "Streams", "Buffers"],
    faqs: [
      { question: "What are the four types of streams in Node.js?", answer: "Readable, Writable, Duplex (both readable/writable), and Transform (duplex streams that modify data)." }
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
    question: "Explain the React Native JSI (JavaScript Interface) and the New Architecture.",
    slug: "react-native-jsi-architecture",
    answer: "The React Native New Architecture replaces the asynchronous JSON bridge with the JavaScript Interface (JSI). JSI allows JavaScript to hold references to C++ Host Objects and invoke their methods synchronously. This powers Fabric (new concurrent UI renderer) and TurboModules (lazy-loaded native modules) for highly fluid app performances.",
    example: "```cpp\n// C++ native module methods can be called directly in JS thread\nauto value = jsiRuntime.evaluateJavaScript(\"global.nativeCall()\");\n```",
    category: "React Native",
    difficulty: "hard",
    tags: ["React Native", "JSI", "Fabric", "TurboModules"],
    faqs: [
      { question: "Why is JSI faster than the old bridge?", answer: "JSI bypasses JSON serialization and thread communication overhead entirely." }
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
  },
  {
    question: "Describe a time you had to work under a very tight deadline. How did you manage it?",
    slug: "behavioral-tight-deadline",
    answer: "Using the STAR method, describe a situation where a deadline was compressed. Emphasize how you assessed the critical path, worked with the product manager to descop non-essential features, managed expectations of stakeholders, focused execution on core components, and delivered a high-quality product on time.",
    example: "Situation: A client release date was moved up by 2 weeks. Task: Deliver the core billing engine. Action: De-scoped secondary features, automated unit testing pipelines, and held daily quick syncs. Result: Shipped on time with zero high-severity bugs.",
    category: "HR Interview",
    difficulty: "medium",
    tags: ["Soft Skills", "Time Management"],
    faqs: [
      { question: "How do you handle scope-creep under tight deadlines?", answer: "Establish strict alignment with product managers on critical features and document secondary features in backlog." }
    ]
  },
  {
    question: "Why do you want to join our company and how do you handle feedback?",
    slug: "hr-company-alignment-feedback",
    answer: "Explain that you align with the company's culture and values (mention specific company aspects, e.g., scaling developer tools). For feedback, emphasize that you view constructive feedback as a growth opportunity, active listen, separate feedback from self-worth, and establish action plans to work on areas of improvement.",
    example: "Response Blueprint: 'I have followed your engineering team's blog post on scaling and find it inspiring... Regarding feedback, during code reviews I actively appreciate recommendations on code refactoring and treat it as a mentoring loop.'",
    category: "HR Interview",
    difficulty: "easy",
    tags: ["Soft Skills", "Company Culture"],
    faqs: [
      { question: "What is the key to receiving feedback?", answer: "Keeping an growth-mindset, avoiding defensiveness, and focusing on target metrics." }
    ]
  }
];

export const SEED_CHALLENGES = [
  {
    title: "Two Sum",
    slug: "two-sum",
    category: "DSA",
    difficulty: "easy",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    starterCode: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    functionName: "twoSum",
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isHidden: false },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]", isHidden: false },
      { input: "[3,3], 6", expectedOutput: "[0,1]", isHidden: true }
    ],
    companyTags: ["Google", "Amazon", "Microsoft"]
  },
  {
    title: "Reverse a Linked List",
    slug: "reverse-linked-list",
    category: "DSA",
    difficulty: "medium",
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    starterCode: `// class ListNode {
//   constructor(val, next = null) {
//     this.val = val;
//     this.next = next;
//   }
// }

function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
    functionName: "reverseList",
    testCases: [
      { input: "null", expectedOutput: "null", isHidden: false }
    ],
    companyTags: ["Facebook", "Stripe", "Netflix"]
  },
  {
    title: "Implement Debounce Function",
    slug: "js-debounce",
    category: "JavaScript",
    difficulty: "medium",
    description: "Given a function `fn` and a time in milliseconds `t`, return a debounced version of that function.",
    starterCode: `function debounce(fn, t) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, t);
  }
}`,
    functionName: "debounce",
    testCases: [
      { input: "((a) => a), 50", expectedOutput: "undefined", isHidden: false }
    ],
    companyTags: ["Uber", "Lyft", "Airbnb"]
  },
  {
    title: "Build a React Counter Hook",
    slug: "react-counter",
    category: "React",
    difficulty: "easy",
    description: "Develop a custom hook `useCounter` that supports increments, decrements, and optional reset bounds.",
    starterCode: `function useCounter(initialValue = 0) {
  return initialValue;
}`,
    functionName: "useCounter",
    testCases: [
      { input: "5", expectedOutput: "5", isHidden: false }
    ],
    companyTags: ["Stripe", "Meta", "Coinbase"]
  }
];

export async function ensureSeedData() {
  try {
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log("[Seeder] Database has 0 blogs. Seeding 17 blogs...");
      await Blog.insertMany(SEED_BLOGS);
      console.log("[Seeder] Successfully seeded blogs!");
    } else {
      console.log(`[Seeder] Blogs count in DB: ${blogCount}. Skip seeding.`);
    }

    const questionCount = await Question.countDocuments();
    if (questionCount < 15) {
      console.log(`[Seeder] Database has ${questionCount} questions (less than 15). Re-seeding 22 questions...`);
      await Question.deleteMany({});
      await Question.insertMany(SEED_QUESTIONS);
      console.log("[Seeder] Successfully seeded questions!");
    } else {
      console.log(`[Seeder] Questions count in DB: ${questionCount}. Skip seeding.`);
    }

    const challengeCount = await Challenge.countDocuments();
    if (challengeCount === 0) {
      console.log("[Seeder] Database has 0 challenges. Seeding 4 challenges...");
      await Challenge.insertMany(SEED_CHALLENGES);
      console.log("[Seeder] Successfully seeded challenges!");
    } else {
      console.log(`[Seeder] Challenges count in DB: ${challengeCount}. Skip seeding.`);
    }
  } catch (error) {
    console.error("[Seeder] Seeding execution failed:", error);
  }
}
