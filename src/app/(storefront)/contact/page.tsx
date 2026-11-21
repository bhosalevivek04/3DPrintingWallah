import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { Mail, MessageSquare, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — 3D Printing Wallah",
  description: "Get in touch with 3D Printing Wallah for inquiries, partnerships, and custom print projects.",
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20 bg-[var(--background)]">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact 3D Printing Wallah"
          description="Have questions about a model, bulk pricing, or material suitability? Reach out directly to our workshop team."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Card 1: Custom Print Inquiry */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-white p-8 gap-6 shadow-xs">
            <div className="flex flex-col gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]">
                <MessageSquare className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-[20px] font-semibold text-[var(--foreground)] tracking-tight">
                Start a custom print
              </h3>
              <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
                Upload your STL, OBJ, or STEP file, or describe your concept for an estimate.
              </p>
            </div>
            <Link
              href="/custom/3d-printing"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-5 py-3 text-[14px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors min-h-[44px]"
            >
              Custom print form
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Card 2: Direct Email */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-white p-8 gap-6 shadow-xs">
            <div className="flex flex-col gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-[20px] font-semibold text-[var(--foreground)] tracking-tight">
                General inquiries
              </h3>
              <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
                For workshops, maker collaborations, or business inquiries, email us directly.
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-white px-5 py-3 text-[14px] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        {/* Workshop note */}
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed">
            <strong className="font-semibold text-[var(--foreground)]">Workshop response time:</strong> We respond to requests Monday to Saturday, typically within 24 hours.
          </p>
        </div>
      </Container>
    </div>
  );
}
