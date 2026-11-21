"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Can I start with just an idea?",
    a: "Yes. Share a sketch, a reference or a short description. Tell us what the object should do, its approximate size and any personal details you have in mind. We can discuss a possible approach together.",
  },
  {
    q: "Can you print a 3D model I provide?",
    a: "Yes. You can supply an STL, OBJ, 3MF or STEP file. We'll check the geometry, confirm printability and suggest materials.",
  },
  {
    q: "What can I personalise?",
    a: "Names, initials, custom dimensions, mounting features, colors and surface finish preferences. We can adapt existing concept designs or build from scratch.",
  },
  {
    q: "How do we choose materials and finishes?",
    a: "We consider how your object will be handled and where it will live. We offer durable PLA, functional PETG, flexible TPU and high-detail resin.",
  },
  {
    q: "Are the sample products available to order?",
    a: "The sample products show what our workshop can produce. While they are concept prototypes rather than stocked goods, we can produce them to order or adapt them for your needs.",
  },
  {
    q: "What should I include in my print request?",
    a: "Helpful details include: approximate dimensions, intended use or environment, a 3D model or sketch reference, and any material or finish preferences.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full bg-[var(--background)] py-20" aria-labelledby="faq-heading">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: FAQ Introduction (Figma 0:1890) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-semibold text-[var(--primary)]">
                A few useful answers
              </p>
              <h2 id="faq-heading" className="text-[32px] font-semibold text-[var(--foreground)] tracking-tight leading-tight">
                Curious about making something?
              </h2>
              <p className="mt-1 text-[16px] text-[var(--muted-foreground)] leading-relaxed">
                Here’s a starting point. For the details of your own project, let’s talk.
              </p>
            </div>

            <div>
              <Link
                href="/custom/3d-printing"
                className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-white px-5 py-3 text-[14px] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors min-h-[44px]"
              >
                Contact {siteConfig.name}
              </Link>
            </div>
          </div>

          {/* Right Column: Questions and Answers (Figma 0:1895) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-white divide-y divide-[var(--border)] overflow-hidden">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex items-center justify-between p-6 text-left transition-colors hover:bg-[#FAF9F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    >
                      <span className="text-[16px] font-medium text-[var(--foreground)] pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-[var(--muted-foreground)] transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-[16px] text-[var(--muted-foreground)] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Project Guidance Note (Figma 0:1897) */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-4">
              <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed">
                <strong className="font-semibold text-[var(--foreground)]">Helpful to include:</strong> dimensions, intended use, a model or reference, and material or finish preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
