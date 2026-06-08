import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email!;
    const body = await req.json().catch(() => ({}));
    const { simulatedSuccess } = body;

    // Check if user is trying to simulate upgrade directly (e.g. mock checkouts)
    if (simulatedSuccess) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          subscription: {
            plan: "premium",
            status: "active",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            stripeCustomerId: "mock_cus_id",
            stripeSubscriptionId: "mock_sub_id",
          }
        },
        { new: true }
      );
      return NextResponse.json({ success: true, user: updatedUser });
    }

    // Call checkout session logic
    const { url } = await createCheckoutSession(userId, userEmail);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ message: error.message || "Failed to create checkout session." }, { status: 500 });
  }
}
