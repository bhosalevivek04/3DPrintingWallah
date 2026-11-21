"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "Are 3D printed layer lines visible on this product?",
    answer:
      "Yes, fine horizontal layer lines (0.16mm - 0.20mm) are an inherent and celebrated hallmark of additive 3D manufacturing. Our printers use precision micro-stepping and calibrated extrusion to ensure clean, consistent tactile texture across every face.",
  },
  {
    question: "Can I request custom dimensions or different colours?",
    answer:
      "Absolutely. We run in-house slicing and can scale models or swap filament colors (we carry 18+ shades of PLA, PETG, TPU, and resin). You can reach out via our Custom 3D Printing page or email us at support@newtronlabs.in.",
  },
  {
    question: "Is this product safe for indoor plants and water?",
    answer:
      "Yes. Our planters and vases are printed with 100% flow calibration and solid perimeter walls to ensure water resistance. For live plants, we incorporate interior drainage ledges to prevent root rot.",
  },
  {
    question: "How long does fabrication and shipping take across India?",
    answer:
      "Ready-to-Order designs ship within 24 to 48 hours via express air courier (Bluedart/Delhivery). Made-to-Order and bespoke personalised prints take 2–3 business days for slicing, printing, and post-processing before dispatch.",
  },
];

export function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section aria-labelledby="product-faq-heading" className="pt-10 border-t border-[var(--border)]">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-5 w-5 text-[var(--primary)]" />
        <h2 id="product-faq-heading" className="text-xl font-bold text-[var(--foreground)] tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {DEFAULT_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-[var(--border)] bg-white overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[var(--foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[var(--muted-foreground)] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[var(--primary)]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--border)]/60 bg-stone-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
