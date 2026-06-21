import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import ResumeReport from "@/models/ResumeReport";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const CRITICAL_KEYWORDS = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Next.js",
  "MongoDB",
  "Node.js",
  "REST API",
  "Git",
  "CI/CD",
  "Docker",
  "Redux",
  "Express",
  "Testing",
  "Agile"
];

const OPTIMIZATION_TEMPLATES = [
  {
    original: "Helped write some frontend code in React.",
    optimized: "Developed responsive React interfaces using hooks and context, accelerating page load speeds by 24%."
  },
  {
    original: "Managed database using MongoDB.",
    optimized: "Designed and optimized MongoDB database schemas and indexing strategies, decreasing query latency by 35%."
  },
  {
    original: "Created backends and API systems.",
    optimized: "Architected RESTful Express.js microservices with JWT-based authentications and request validations."
  },
  {
    original: "Did manual and automated testing.",
    optimized: "Implemented comprehensive unit tests and integration tests, expanding overall codebase test coverage to 85%."
  }
];

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { text, fileName } = body;

    if (!text) {
      return NextResponse.json({ message: "Resume text is empty" }, { status: 400 });
    }

    const lowerText = text.toLowerCase();
    
    // Check keyword matches
    const matchedKeywords = CRITICAL_KEYWORDS.filter(kw => 
      lowerText.includes(kw.toLowerCase())
    );
    
    const missingKeywords = CRITICAL_KEYWORDS.filter(kw => 
      !lowerText.includes(kw.toLowerCase())
    );

    // Calculate ATS Score
    const matchRatio = matchedKeywords.length / CRITICAL_KEYWORDS.length;
    const baseScore = Math.floor(matchRatio * 50); // Up to 50 pts for keywords
    const structureScore = Math.floor(Math.min(50, Math.max(20, text.split(/\s+/).length / 8))); // Up to 50 pts for description density
    const atsScore = Math.min(100, Math.max(35, baseScore + structureScore));

    // Generate suggestions based on score and missing keywords
    const suggestions: string[] = [];
    if (atsScore < 70) {
      suggestions.push("Increase keyword richness by weaving in missing skills relevant to your target role.");
    }
    if (missingKeywords.length > 3) {
      suggestions.push(`Consider adding a designated Skills section containing missing keywords: ${missingKeywords.slice(0, 4).join(", ")}.`);
    }
    suggestions.push("Quantify achievements (e.g., mention metrics like percentages, dollar numbers, hours saved).");
    suggestions.push("Ensure your email and LinkedIn profile links are clearly presented in the header.");

    // Match optimization suggestions
    const optimizedBullets = OPTIMIZATION_TEMPLATES.map(item => ({
      original: item.original,
      optimized: item.optimized
    }));

    // Create report in MongoDB
    const report = await ResumeReport.create({
      userId,
      fileName: fileName || "uploaded_resume.txt",
      atsScore,
      missingKeywords,
      suggestions,
      optimizedBullets
    });

    return NextResponse.json({
      id: report._id.toString(),
      atsScore: report.atsScore,
      missingKeywords: report.missingKeywords,
      suggestions: report.suggestions,
      optimizedBullets: report.optimizedBullets
    });

  } catch (error: any) {
    console.error("Resume Scorer API error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const resumes = await ResumeReport.find({ userId })
      .sort({ createdAt: -1 })
      .select("fileName atsScore createdAt")
      .lean();

    return NextResponse.json(resumes);
  } catch (error: any) {
    console.error("Resume GET API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
