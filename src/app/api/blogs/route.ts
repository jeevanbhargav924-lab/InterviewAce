import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";
import { SEED_BLOGS } from "@/lib/seeder";

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
