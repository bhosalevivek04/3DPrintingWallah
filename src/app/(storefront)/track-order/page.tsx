import React, { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrackOrderForm } from "@/components/forms/track-order-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order — 3D Printing Wallah",
  description: "Track your 3D print order status.",
};

export default function TrackOrderPage() {
  return (
    <div className="pt-4 pb-12 sm:pb-16">
      <Container className="max-w-xl">
        {/* Global Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Track Order" }]} className="mb-6" />

        <SectionHeading
          eyebrow="Order tracking"
          title="Track your order."
          description="Enter your order ID or the email you used at checkout."
          className="mb-10"
        />

        <Suspense
          fallback={
            <div className="h-32 w-full rounded-2xl bg-stone-100 animate-pulse border border-stone-200" />
          }
        >
          <TrackOrderForm />
        </Suspense>

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
