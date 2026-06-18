import React from "react";
import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch | InterviewAce AI",
  description: "Have questions or feedback about InterviewAce AI? Reach out to our support team and let us know how we can help you prepare for your next interview.",
};

export default function ContactPage() {
  return <ContactClient />;
}
