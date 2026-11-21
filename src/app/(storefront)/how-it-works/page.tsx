import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProcessCards } from "@/components/home/process-cards";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArrowRight, UploadCloud, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — 3D Printing Wallah",
  description:
    "Three simple steps from idea to delivery: Imagine, Shape, and Make. See how 3D Printing Wallah brings your ideas into objects.",
};

export default function HowItWorksPage() {
  return (
    <div className="pt-4 pb-16 sm:pb-20">
      <Container className="max-w-6xl">
        {/* 1. Global Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: "How It Works" }]} className="mb-5 sm:mb-6" />

        {/* 2. Page Header with Compact, Balanced Top Spacing */}
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          description="Getting a custom 3D print has never been simpler. Here's exactly how it works, from your first message to your doorstep."
          className="mb-10 sm:mb-12"
        />

        {/* 3. Three Redesigned Connected Process Cards */}
        <section aria-label="Step-by-step process" className="mb-14">
          <ProcessCards />
        </section>

        {/* 4. Action & Next Steps Callout */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex flex-col gap-1.5 max-w-xl">
            <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
              Ready to turn your idea into a physical object?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              Upload your 3D model for an engineering review and quotation, or share your initial sketch with our workshop team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              href="/custom/3d-printing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[var(--primary-hover)] transition-colors shadow-2xs cursor-pointer flex-1 sm:flex-initial"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Start Custom Print</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-stone-50 px-5 py-3 text-xs sm:text-sm font-semibold text-[var(--foreground)] hover:bg-stone-100 transition-colors cursor-pointer flex-1 sm:flex-initial"
            >
              <MessageSquare className="h-4 w-4 text-stone-500" />
              <span>Ask a Question</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
