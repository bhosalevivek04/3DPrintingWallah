"use client";

import React from "react";
import { Lightbulb, Ruler, Printer, ArrowRight } from "lucide-react";

export interface ProcessStep {
  number: string;
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    label: "Imagine",
    title: "Start with a possibility",
    description:
      "Share an idea or model, or pick a sample concept as your starting point.",
    icon: Lightbulb,
  },
  {
    number: "02",
    label: "Shape",
    title: "Work through the details",
    description:
      "Discuss dimensions, intended use, material preferences and personal touches.",
    icon: Ruler,
  },
  {
    number: "03",
    label: "Make",
    title: "Review, then make",
    description:
      "Review the proposed details together before moving into production.",
    icon: Printer,
  },
];

interface ProcessCardsProps {
  className?: string;
}

export function ProcessCards({ className = "" }: ProcessCardsProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Desktop Connecting Line behind cards */}
      <div
        className="hidden md:block absolute top-[64px] left-[16%] right-[16%] h-px border-t border-dashed border-[var(--color-border)] -z-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 relative z-10">
        {PROCESS_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === PROCESS_STEPS.length - 1;

          return (
            <article
              key={step.number}
              tabIndex={0}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-white p-7 sm:p-8 apple-card outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:border-[var(--color-brand)]"
            >
              {/* Desktop Arrow Indicator Between Cards */}
              {!isLast && (
                <div
                  className="hidden lg:flex items-center justify-center absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-[var(--color-border)] shadow-2xs text-[var(--color-text-secondary)] z-20 pointer-events-none group-hover:border-[var(--color-brand)] group-hover:text-[var(--color-brand)] transition-colors duration-200"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              )}

              {/* Top Header: Step Indicator & Category Badge */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                {/* Icon in branded restrained box */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-brand-subtle)] text-[var(--color-brand)] border border-[var(--color-brand-light)]/30 group-hover:bg-[var(--color-brand)] group-hover:text-white transition-colors duration-200">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Category Label Pill */}
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
                  {step.label}
                </span>
              </div>

              {/* Card Body: Heading & Description */}
              <div className="flex flex-col gap-2 relative z-10 flex-1">
                <span className="text-[11px] font-bold font-mono tracking-wider text-[var(--color-brand)] uppercase">
                  Step {step.number}
                </span>

                <h3 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight group-hover:text-[var(--color-brand)] transition-colors duration-200">
                  {step.title}
                </h3>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-1">
                  {step.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-6 pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                <span className="text-[11px] font-mono tracking-wider uppercase text-[var(--color-text-muted)]">
                  Stage {step.number} of 03
                </span>
                <span className="text-[var(--color-brand)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-semibold text-xs flex items-center gap-1">
                  Explore step <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
