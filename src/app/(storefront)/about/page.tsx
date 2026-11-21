import React from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — 3D Printing Wallah",
  description: "Our story, our workshop, and why we started 3D Printing Wallah.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Our story"
          title="A small workshop with big ambitions."
          className="mb-10"
        />

        <div className="prose prose-sm max-w-none text-[var(--muted-foreground)] space-y-5">
          <p className="text-base leading-relaxed text-[var(--foreground)]">
            3D Printing Wallah started in a living room with one printer, a lot of
            filament, and an overflowing ideas notebook. We were tired of seeing cool
            designs online that took weeks and thousands of rupees to manufacture. FDM
            printing changed that — suddenly, anyone could make anything.
          </p>

          <p className="text-base leading-relaxed">
            We built this workshop to be the bridge between your idea and the finished
            object. Whether you need one prototype or fifty units, we treat every print
            with the same care. We inspect every piece before it ships. If it&apos;s not
            right, we reprint it.
          </p>

          <p className="text-base leading-relaxed">
            Our materials are sourced from trusted suppliers. Our equipment is
            calibrated weekly. And our team responds to every message the same day.
          </p>

          <div className="rounded-2xl bg-[var(--accent)] border border-[var(--border)] p-6 mt-8">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Want to work with us?
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 mb-4">
              We&apos;re always open to partnerships, bulk orders, and interesting projects.
              Drop us a line.
            </p>
            <a
              href="mailto:support@newtronlabs.in"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
            >
              support@newtronlabs.in
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
