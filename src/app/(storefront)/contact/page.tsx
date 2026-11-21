import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/config/site";
import { Mail, MessageSquare, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — 3D Printing Wallah",
  description: "Get in touch with 3D Printing Wallah for inquiries, partnerships, and custom print projects.",
};

export default function ContactPage() {
  return (
    <div className="pt-4 pb-12 sm:pb-16 bg-[var(--background)]">
      <Container className="max-w-3xl">
        {/* Global Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Contact" }]} className="mb-6" />

        <SectionHeading
          eyebrow="Get in touch"
          title="Contact 3D Printing Wallah"
          description="Have questions about a model, bulk pricing, or material suitability? Reach out directly to our workshop team."
          className="mb-10"
        />

        {/* Interactive Contact Form */}
        <div className="mb-10">
          <ContactForm />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* Card 1: Custom Print Inquiry */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-white p-6 gap-5 shadow-xs">
            <div className="flex flex-col gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]">
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                Start a custom print
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Upload your STL, OBJ, or STEP file, or describe your concept for an estimate.
              </p>
            </div>
            <Link
              href="/custom/3d-printing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white hover:bg-[var(--primary-hover)] transition-colors"
            >
              Custom print form
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Card 2: Direct Email */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-white p-6 gap-5 shadow-xs">
            <div className="flex flex-col gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--primary)]">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                General inquiries
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                For workshops, maker collaborations, or business inquiries, email us directly.
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        {/* Workshop note */}
        <div className="rounded-2xl border border-[var(--border)] bg-stone-50/70 p-5 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
          <Clock className="h-4 w-4 text-[var(--primary)] shrink-0" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-[var(--foreground)]">Workshop response time:</strong> We respond to inquiries Monday to Saturday, typically within 24 hours.
          </p>
        </div>
      </Container>
    </div>
  );
}
