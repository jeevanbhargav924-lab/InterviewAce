import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";

const SEED_BLOGS = [
  {
    title: "React Interview Questions & Answers (2026 Edition)",
    slug: "react-interview-questions-2026",
    summary: "Master the most critical React 19 questions, compiler components, lifetime Hooks, and reconciliation metrics.",
    content: `Preparing for a React technical round in 2026 requires understanding the React 19 ecosystem. The introduction of the **React Compiler** removes the manual optimization overhead, automatically memoizing components and hooks.

### The React Compiler
Traditionally, developers relied on \`useMemo\` and \`useCallback\` to prevent unnecessary re-renders. The React Compiler shifts this burden to build time. It parses code and optimizes rendering paths automatically!

### New Hook Features in React 19
1. **useActionState**: Simplifies async form handling and transitions.
2. **useFormStatus**: Provides active form submission status.
3. **useOptimistic**: Delivers responsive UI updates during server updates.

\`\`\`javascript
const [state, formAction] = useActionState(async (prevState, query) => {
  const result = await searchDatabase(query);
  return result;
}, null);
\`\`\`

By embracing React 19 conventions, developers write cleaner code with fewer manual lifecycle dependencies.`,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
    category: "React",
    tags: ["React", "JavaScript", "Web Dev"],
    author: {
      name: "Jeevan Bhargav",
      image: "",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer.",
    },
    isFeatured: true,
  },
  {
    title: "React Native Architect Roadmap (2026)",
    slug: "react-native-roadmap-2026",
    summary: "A professional step-by-step roadmap showing how to scale mobile application bridge structures, JSI, and layouts.",
    content: `React Native has evolved significantly with the New Architecture. Native modules are now linked dynamically using JSI.

### Phase 1: Understanding JSI
The JavaScript Interface (JSI) replaces the old JSON bridge, enabling direct synchronous communication between JS and C++ thread pools.

### Phase 2: Fabric & TurboModules
Fabric represents the new UI rendering engine that runs synchronous layout operations in layout trees. TurboModules allows lazy-loading of native modules for fast app starts.

### Phase 3: Optimizing FlatList render passes
Reduce re-renders by using \`getItemLayout\` and memoizing component layouts.`,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    category: "React Native",
    tags: ["Mobile", "Architecture", "Scaling"],
    author: {
      name: "Jeevan Bhargav",
      image: "",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer.",
    },
    isFeatured: false,
  },
  {
    title: "The Complete Node.js Event Loop Master Guide",
    slug: "nodejs-event-loop-guide",
    summary: "Struggling to describe Node's event execution phases? Review these 6 phases to pass your next backend architectural screening.",
    content: `The Node.js Event Loop lies at the heart of server concurrency execution.

1. **Timers**: Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
3. **Idle/Prepare**: Internal engine execution.
4. **Poll**: Retrieves new I/O events.
5. **Check**: Executes callbacks for \`setImmediate\`.
6. **Close Callbacks**: Executes close sockets connections.

Understanding how to leverage Express, cluster nodes, and avoid blocking the Event Loop is critical for high-throughput backends.`,
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800",
    category: "Node.js",
    tags: ["Node.js", "Backend", "Event Loop"],
    author: {
      name: "Jeevan Bhargav",
      image: "",
      bio: "Creator of InterviewsAce.AI and Frontend Engineer.",
    },
    isFeatured: false,
  }
];

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");
    const search = searchParams.get("search");

    // Seed fallback details only if the database is completely empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany(SEED_BLOGS);
    }

    if (slug) {
      // Find single blog and increment views
      const blog = await Blog.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true });
      if (!blog) {
        return NextResponse.json({ message: "Blog article not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    const filter: any = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("Blogs API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const formatBlog = (data: any) => {
      const { title, content, category, summary, tags, coverImage, author } = data;
      if (!title || !content || !category) {
        throw new Error(`Missing required fields (title, content, or category) for: "${title || 'Unknown'}"`);
      }
      
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return {
        title,
        slug,
        summary: summary || title.substring(0, 150) + "...",
        content,
        category,
        tags: tags || [],
        coverImage: coverImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
        author: author || {
          name: "Admin",
          image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
          bio: "Platform Administrator"
        },
        isFeatured: false,
        views: 0,
        comments: []
      };
    };

    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ message: "Empty blogs array provided" }, { status: 400 });
      }
      const preparedBlogs = body.map((item: any) => formatBlog(item));
      const newBlogs = await Blog.insertMany(preparedBlogs);
      return NextResponse.json({
        message: `Successfully inserted ${newBlogs.length} blog posts`,
        insertedCount: newBlogs.length,
        data: newBlogs
      }, { status: 201 });
    }

    // Check if we are creating a new blog post
    if (body.title && body.content && body.category) {
      const prepared = formatBlog(body);
      const newBlog = await Blog.create(prepared);
      return NextResponse.json(newBlog, { status: 201 });
    }

    // Otherwise, handle adding comment
    const { blogId, comment } = body;

    if (!blogId || !comment || !comment.userName || !comment.content) {
      return NextResponse.json({ message: "Invalid payload parameters" }, { status: 400 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: comment } },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    console.error("Blogs POST API error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
