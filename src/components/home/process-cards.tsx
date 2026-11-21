"use client";

import React from "react";
import { Lightbulb, Ruler, Printer, ArrowRight } from "lucide-react";

export interface ProcessStep {
  number: string;
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    lightBg: string;
  };
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    label: "Imagine",
    title: "Start with a possibility",
    description:
      "Share an idea or model, or pick a sample concept as your starting point.",
    icon: Lightbulb,
    accentColor: {
      bg: "bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-200",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      lightBg: "from-blue-50/60 via-white to-stone-50/40",
    },
  },
  {
    number: "02",
    label: "Shape",
    title: "Work through the details",
    description:
      "Discuss dimensions, intended use, material preferences and personal touches.",
    icon: Ruler,
    accentColor: {
      bg: "bg-indigo-600",
      text: "text-indigo-600",
      border: "border-indigo-200",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      lightBg: "from-indigo-50/60 via-white to-stone-50/40",
    },
  },
  {
    number: "03",
    label: "Make",
    title: "Review, then make",
    description:
      "Review the proposed details together before moving into production.",
    icon: Printer,
    accentColor: {
      bg: "bg-emerald-600",
      text: "text-emerald-600",
      border: "border-emerald-200",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      lightBg: "from-emerald-50/60 via-white to-stone-50/40",
    },
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
        className="hidden md:block absolute top-[68px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-blue-300 via-indigo-300 to-emerald-300 -z-0 pointer-events-none opacity-60"
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
              className={`group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-gradient-to-b ${step.accentColor.lightBg} p-7 sm:p-8 shadow-xs hover:border-[var(--primary)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]`}
            >
              {/* Subtle decorative background watermark in top-right */}
              <div
                className="absolute top-4 right-4 text-stone-200/60 group-hover:text-stone-300/70 font-mono font-black text-6xl select-none pointer-events-none transition-colors duration-300"
                aria-hidden="true"
              >
                {step.number}
              </div>

              {/* Connecting arrow indicator between cards on desktop */}
              {!isLast && (
                <div
                  className="hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[var(--border)] shadow-xs text-stone-400 z-20 pointer-events-none group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] transition-colors duration-300"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}

              {/* Top Header: Step Indicator & Category Badge */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                {/* Icon in branded rounded box */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white border ${step.accentColor.border} ${step.accentColor.text} shadow-xs group-hover:scale-105 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300`}
                >
                  <Icon className="h-6 w-6 transition-transform duration-300" />
                </div>

                {/* Category Label Pill */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${step.accentColor.badgeBg} shadow-2xs`}
                >
                  {step.label}
                </span>
              </div>

              {/* Card Body: Heading & Description */}
              <div className="flex flex-col gap-2.5 relative z-10 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono tracking-wider text-[var(--primary)]">
                    STEP {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight group-hover:text-[var(--primary)] transition-colors duration-200">
                  {step.title}
                </h3>

                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-1">
                  {step.description}
                </p>
              </div>

              {/* Subtle bottom border accent line */}
              <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center justify-between text-xs font-medium text-[var(--muted-foreground)]">
                <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500">
                  Stage {step.number} of 03
                </span>
                <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-semibold text-xs flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
