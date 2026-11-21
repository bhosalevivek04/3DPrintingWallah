import React from "react";

const steps = [
  {
    number: "01",
    label: "Imagine",
    title: "Start with a possibility",
    description: "Share an idea or model, or pick a sample concept as your starting point.",
  },
  {
    number: "02",
    label: "Shape",
    title: "Work through the details",
    description: "Discuss dimensions, intended use, material preferences and personal touches.",
  },
  {
    number: "03",
    label: "Make",
    title: "Review, then make",
    description: "Review the proposed details together before moving into production.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full bg-white py-20 border-b border-[var(--border)]" aria-labelledby="how-it-works-heading">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex flex-col gap-10">
        {/* Section Introduction (Figma 0:1838) */}
        <div className="max-w-2xl flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-[var(--primary)]">
            How it works
          </p>
          <h2 id="how-it-works-heading" className="text-[32px] font-semibold text-[var(--foreground)] tracking-tight">
            From a first thought to a physical thing.
          </h2>
        </div>

        {/* Project Steps Grid (Figma 0:1841) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.number}
              className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[#F7F6F2] p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[var(--primary)]">
                  {s.number}
                </span>
                <span className="text-[14px] text-[var(--muted-foreground)]">
                  {s.label}
                </span>
              </div>
              <h3 className="text-[20px] font-semibold text-[var(--foreground)] tracking-tight">
                {s.title}
              </h3>
              <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
