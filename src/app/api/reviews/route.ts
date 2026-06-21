import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Review from "@/models/Review";

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Reviews GET API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, role, stars, quote } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ message: "Name is required and must be a string." }, { status: 400 });
    }
    if (!role || typeof role !== "string" || !role.trim()) {
      return NextResponse.json({ message: "Role is required and must be a string." }, { status: 400 });
    }
    if (typeof stars !== "number" || stars < 1 || stars > 5) {
      return NextResponse.json({ message: "Rating must be a number between 1 and 5." }, { status: 400 });
    }
    if (!quote || typeof quote !== "string" || !quote.trim()) {
      return NextResponse.json({ message: "Review quote/content is required." }, { status: 400 });
    }

    const newReview = await Review.create({
      name: name.trim(),
      role: role.trim(),
      stars,
      quote: quote.trim(),
      approved: true // Auto-approved for immediate display
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error("Reviews POST API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
