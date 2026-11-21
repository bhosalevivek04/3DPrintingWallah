import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MessageSquare } from "lucide-react";
import { LocalModelUploader } from "@/components/custom/local-model-uploader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom 3D Printing — Upload or Describe Your Idea",
  description:
    "Upload your 3D models locally or describe your idea. We handle materials, print, and delivery across India.",
};

export default function CustomPrintingPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Custom 3D Printing"
          title="Your model, your material, your deadline."
          description="Upload a 3D model, describe your idea, or start a conversation. We'll guide you from concept to finished object."
          className="mb-10"
        />

        {/* 1. Local 3D File Upload Prototype Section */}
        <section aria-labelledby="upload-heading" className="mb-10">
          <h2 id="upload-heading" className="sr-only">
            3D Model File Upload
          </h2>
          <LocalModelUploader />
        </section>

        {/* 2. Alternative Option: Describe Your Idea */}
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
                Tell us what you want to build in plain words — dimensions, purpose, material — and we&apos;ll help design and print it.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] min-h-[44px] transition-colors shrink-0"
          >
            Start a conversation
          </Link>
        </div>

        {/* 3. Materials */}
        <section aria-labelledby="materials-heading" className="mb-12">
          <h2 id="materials-heading" className="text-lg font-bold text-[var(--foreground)] mb-5">
            Available materials
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "PLA", note: "Best for general use", color: "bg-blue-50" },
              { name: "PETG", note: "Durable & heat-resistant", color: "bg-green-50" },
              { name: "TPU", note: "Flexible & rubbery", color: "bg-orange-50" },
              { name: "Resin", note: "High detail", color: "bg-purple-50" },
            ].map((m) => (
              <div
                key={m.name}
                className={`rounded-xl ${m.color} border border-[var(--border)] p-4`}
              >
                <p className="text-sm font-bold text-[var(--foreground)]">{m.name}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. File guidelines */}
        <section id="file-guidelines" aria-labelledby="file-guidelines-heading">
          <h2 id="file-guidelines-heading" className="text-lg font-bold text-[var(--foreground)] mb-4">
            File guidelines
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm text-[var(--muted-foreground)]">
            <li>✅ Accepted formats: <strong className="text-[var(--foreground)]">STL, OBJ, 3MF, GLB, GLTF</strong></li>
            <li>✅ Max file size: <strong className="text-[var(--foreground)]">50 MB per file</strong></li>
            <li>✅ Stored locally in your browser for testing and verification</li>
            <li>✅ Ensure the model is watertight (no holes in the mesh)</li>
            <li>✅ Specify units in your file (mm preferred)</li>
            <li>✅ For multi-part assemblies, upload each part as a separate file</li>
          </ul>
        </section>
      </Container>
    </div>
  );
}
