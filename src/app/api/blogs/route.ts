import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";

const SEED_BLOGS = [
  {
    title: "Mastering React 19: New Hooks and Compiler Features",
    slug: "mastering-react-19-hooks-compiler",
    summary: "Dive deep into React 19's brand new compiler (React Forget) and modern hooks like useActionState and useOptimistic.",
    content: `React 19 marks a major milestone in frontend development. The introduction of the **React Compiler** removes the manual optimization overhead, automatically memoizing components and hooks under the hood.

### The React Compiler
Traditionally, developers relied on \`useMemo\` and \`useCallback\` to prevent unnecessary re-renders. The React Compiler shifts this burden to build time. It parses code and optimizes rendering paths automatically!

### New Hook Features
1. **useActionState**: Simplifies async form handling.
2. **useFormStatus**: Provides active form submission state.
3. **useOptimistic**: Delivers responsive UI updates during server updates.

\`\`\`javascript
const [state, formAction] = useActionState(async (prevState, query) => {
  const result = await searchDatabase(query);
  return result;
}, null);
\`\`\`

By embracing React 19 conventions, developers write cleaner code with fewer manual dependencies.`,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
    category: "React",
    tags: ["React", "JavaScript", "Web Dev"],
    author: {
      name: "Alex Rivera",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
      bio: "Senior Frontend Engineer and React core advocate.",
    },
    isFeatured: true,
  },
  {
    title: "Demystifying System Design: How to Scale to 1M Users",
    slug: "demystifying-system-design-scale-1m",
    summary: "A practical step-by-step architectural breakdown showing how to scale a web app from local host to 1 million active users.",
    content: `Designing architectures capable of supporting millions of users requires modular decoupling, load balancers, caching layers, and database replica sets.

### Phase 1: The Monolith
Start simple. A unified server running your client and server alongside a single database instance. This handles up to 10k users.

### Phase 2: Decoupling and Load Balancing
As traffic grows, split your database from the app server. Introduce a **Load Balancer (e.g., Nginx or AWS ALB)** to distribute incoming connections across multiple stateless backend nodes.

### Phase 3: Caching
Integrate memory caches like **Redis** or **Memcached** to store frequent queries. Caching databases minimizes lookup latencies and reduces DB CPU usage.

### Phase 4: Database Sharding & Replicas
Utilize read-replicas for read-heavy operations, and distribute write operations using horizontal sharding to prevent database bottlenecks.`,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    category: "System Design",
    tags: ["System Design", "Backend", "Scaling"],
    author: {
      name: "Marcus Vance",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
      bio: "Principal Solutions Architect at TechScale Inc.",
    },
    isFeatured: false,
  },
  {
    title: "10 Resume Rules to Bypass Modern ATS Filters",
    slug: "10-resume-rules-bypass-ats-filters",
    summary: "Struggling to get interviews? Follow these 10 actionable resume formatting rules to guarantee you score high on ATS screenings.",
    content: `Applicant Tracking Systems (ATS) scan and filter thousands of resumes before recruiters ever lay eyes on them. To ensure your resume passes, follow these rules:

1. **Use Standard Sections**: Stick to headers like "Experience", "Skills", and "Education".
2. **Include Contextual Keywords**: Ensure the precise vocabulary used in the job description is present in your bullet points.
3. **Avoid Complex Layouts**: Do not use tables, text boxes, images, or progress bars; they confuse parser modules.
4. **Quantify Metrics**: Replace "Responsible for fixing bugs" with "Resolved over 150 critical tickets, increasing app stability by 12%."
5. **Stick to PDFs**: Unless specified otherwise, export as a clean, text-selectable PDF.`,
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800",
    category: "Resume Tips",
    tags: ["Resume", "Careers", "ATS"],
    author: {
      name: "Sarah Jenkins",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
      bio: "Tech Career Coach and former Lead Recruiter.",
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

    // Seed if empty
    const count = await Blog.countDocuments();
    if (count === 0) {
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
    
    // Check if we are creating a new blog post
    if (body.title && body.content && body.category) {
      const { title, content, category, summary, tags, coverImage, author } = body;
      
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const newBlog = await Blog.create({
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
      });

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
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
