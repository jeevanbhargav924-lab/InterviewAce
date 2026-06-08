import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Stripe from "stripe";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ received: true, simulated: true });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Missing Stripe signature headers" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  await dbConnect();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (userId) {
          await User.findByIdAndUpdate(userId, {
            subscription: {
              plan: "premium",
              status: "active",
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              stripeCustomerId,
              stripeSubscriptionId,
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;
        const status = subscription.status === "active" ? "active" : "inactive";

        await User.findOneAndUpdate(
          { "subscription.stripeSubscriptionId": stripeSubscriptionId },
          {
            "subscription.status": status,
            "subscription.expiresAt": new Date((subscription as any).current_period_end * 1000),
          }
        );
        break;
      }
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error("Error updating user subscription via Stripe webhook:", err);
    return NextResponse.json({ message: "Database update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
