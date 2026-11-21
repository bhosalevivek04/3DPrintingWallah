import React from "react";
import { ProcessCards } from "@/components/home/process-cards";

interface HowItWorksSectionProps {
  className?: string;
  hideHeader?: boolean;
}

export function HowItWorksSection({ className = "", hideHeader = false }: HowItWorksSectionProps) {
  return (
    <section
      className={`w-full bg-white py-16 sm:py-20 border-b border-[var(--border)] ${className}`}
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col gap-10">
        {/* Section Introduction */}
        {!hideHeader && (
          <div className="max-w-2xl flex flex-col gap-2">
            <p className="text-[14px] font-semibold text-[var(--primary)] uppercase tracking-wider">
              How it works
            </p>
            <h2
              id="how-it-works-heading"
              className="text-[28px] sm:text-[32px] font-bold text-[var(--foreground)] tracking-tight"
            >
              From a first thought to a physical thing.
            </h2>
          </div>
        )}

        {/* Premium Connected Process Cards */}
        <ProcessCards />
      </div>
    </section>
  );
}
