import React from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — 3D Printing Wallah",
  description: "Three simple steps from idea to delivery. See how 3D Printing Wallah works.",
};

export default function HowItWorksPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-4xl mb-4">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          description="Getting a custom 3D print has never been simpler. Here's exactly how it works, from your first message to your doorstep."
        />
      </Container>
      <HowItWorksSection />
    </div>
  );
}
