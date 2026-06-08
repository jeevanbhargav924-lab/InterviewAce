import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, { apiVersion: "2025-01-27-patched" as any }) 
  : null;

export async function createCheckoutSession(userId: string, userEmail: string) {
  if (!stripe) {
    // Return a mock checkout URL for development testing
    return {
      id: "mock_session_id_" + Math.random().toString(36).substring(7),
      url: `/dashboard?checkout=success&userId=${userId}`,
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "InterviewAce AI Premium Plan",
            description: "Unlimited AI Mock Interviews, ATS Resume Screening, and Priority Support.",
          },
          unit_amount: 2900, // $29.00
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing?checkout=cancelled`,
    metadata: {
      userId,
    },
    customer_email: userEmail,
  });

  return {
    id: session.id,
    url: session.url,
  };
}
