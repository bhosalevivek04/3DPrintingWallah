import React from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrackOrderForm } from "@/components/forms/track-order-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order — 3D Printing Wallah",
  description: "Track your 3D print order status.",
};

export default function TrackOrderPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-xl">
        <SectionHeading
          eyebrow="Order tracking"
          title="Track your order."
          description="Enter your order ID or the email you used at checkout."
          className="mb-10"
        />

        <TrackOrderForm />

        <p className="mt-6 text-sm text-[var(--muted-foreground)]">
          Need help?{" "}
          <a
            href="mailto:support@newtronlabs.in"
            className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            Email us
          </a>{" "}
          or reach us on WhatsApp.
        </p>
      </Container>
    </div>
  );
}
