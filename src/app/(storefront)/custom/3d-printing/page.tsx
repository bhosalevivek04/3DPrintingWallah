import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MessageSquare } from "lucide-react";
import { CustomPrintWizard } from "@/components/custom/custom-print-wizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom 3D Printing — Bring Your 3D Model to Life | NewtronLabs",
  description:
    "Upload your 3D model, choose your printing preferences and let us help turn your design into a physical product with professional SLA and FDM printing.",
};

export default function CustomPrintingPage() {
  return (
    <div className="pt-4 pb-12 sm:pb-16">
      <Container className="max-w-5xl">
        {/* Global Breadcrumb */}
        <Breadcrumbs items={[{ label: "Custom 3D Printing" }]} className="mb-6" />

        {/* Main Heading & Intro */}
        <SectionHeading
          eyebrow="Custom 3D Printing"
          title="Bring Your 3D Model to Life"
          description="Upload your 3D model, choose your printing preferences and let us help turn your design into a physical product."
          className="mb-8"
        />

        {/* 3-Step Guided Process Indicator Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-10">
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-stone-50/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[var(--primary)] font-bold text-xs">
              1
            </div>
            <div>
              <strong className="block text-xs font-bold text-[var(--foreground)]">
                Upload 3D Model
              </strong>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                STL, OBJ, 3MF, GLB, GLTF (up to 50 MB)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-stone-50/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[var(--primary)] font-bold text-xs">
              2
            </div>
            <div>
              <strong className="block text-xs font-bold text-[var(--foreground)]">
                Configure Requirements
              </strong>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                Technology, material, finish & dimensions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-stone-50/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[var(--primary)] font-bold text-xs">
              3
            </div>
            <div>
              <strong className="block text-xs font-bold text-[var(--foreground)]">
                Receive Quotation
              </strong>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                Official review, pricing & timeline in 24h
              </span>
            </div>
          </div>
        </div>

        {/* Guided Wizard Flow */}
        <section aria-labelledby="custom-wizard-heading" className="mb-14">
          <h2 id="custom-wizard-heading" className="sr-only">
            Custom 3D Printing Submission Workflow
          </h2>
          <CustomPrintWizard />
        </section>

        {/* Alternative Option: Describe Your Idea */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]">
              <MessageSquare className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Don&apos;t have a 3D file yet? Describe your idea
              </h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)] leading-relaxed">
                Tell us what you want to build in plain words — dimensions, purpose, material — and our design team will help CAD model and print it.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] min-h-[44px] transition-colors shrink-0 shadow-2xs"
          >
            Start a conversation
          </Link>
        </div>

        {/* Materials Overview */}
        <section aria-labelledby="materials-heading" className="mb-12">
          <h2 id="materials-heading" className="text-lg font-bold text-[var(--foreground)] mb-4">
            Available materials & capabilities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "PLA / PLA+", note: "Best for general prototypes & decorative pieces" },
              { name: "PETG", note: "Durable, high impact & heat-resistant (up to 75°C)" },
              { name: "TPU (Flexible)", note: "Flexible, rubbery, shock absorbing parts" },
              { name: "Resin (SLA)", note: "Ultra-high detail & smooth miniature surface" },
            ].map((m) => (
              <div
                key={m.name}
                className="rounded-xl bg-white border border-[var(--color-border)] p-4 shadow-2xs hover:border-[var(--color-brand)] transition-colors"
              >
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{m.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* File guidelines */}
        <section id="file-guidelines" aria-labelledby="file-guidelines-heading">
          <h2 id="file-guidelines-heading" className="text-lg font-bold text-[var(--foreground)] mb-4">
            3D File Preparation Guidelines
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm text-[var(--muted-foreground)]">
            <li>✅ Accepted formats: <strong className="text-[var(--foreground)]">STL, OBJ, 3MF, GLB, GLTF</strong></li>
            <li>✅ Max file size: <strong className="text-[var(--foreground)]">50 MB per 3D model</strong></li>
            <li>✅ Stored locally in your browser session for preview, validation and instant reload</li>
            <li>✅ Ensure the model is watertight (manifold geometry with no inverted normals or holes in the mesh)</li>
            <li>✅ Specify units in your file (millimetres preferred)</li>
            <li>✅ For multi-part assemblies, upload each part or attach reference assembly sketches</li>
          </ul>
        </section>
      </Container>
    </div>
  );
}
