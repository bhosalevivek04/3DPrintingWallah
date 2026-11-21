import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const principles = [
  {
    category: "Personal by design",
    badge: "Current service",
    title: "Made around your idea",
    description: "Start with what you want to make, not a one-size-fits-all answer.",
    action: "Share your model",
    href: "/custom/3d-printing",
  },
  {
    category: "Details that matter",
    badge: "Current service",
    title: "Purpose before printing",
    description: "We discuss how your object will be used, so the brief has a clear direction.",
    action: "Share your model",
    href: "/custom/3d-printing",
  },
  {
    category: "A clearer process",
    badge: "Current service",
    title: "A shared starting point",
    description: "Dimensions, preferences and proposed details are reviewed before production.",
    action: "Share your model",
    href: "/custom/3d-printing",
  },
];

export function WhyChooseSection() {
  return (
    <section className="w-full bg-[var(--background)] py-20" aria-labelledby="why-heading">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex flex-col gap-10">
        {/* Section Introduction (Figma 0:1864) */}
        <div className="max-w-2xl flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-[var(--primary)]">
            Why choose {siteConfig.name}
          </p>
          <h2 id="why-heading" className="text-[32px] font-semibold text-[var(--foreground)] tracking-tight">
            Thoughtful making starts with listening.
          </h2>
        </div>

        {/* 3 Workshop Principle Cards (Figma 0:1867) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-white p-8 gap-6 shadow-xs hover:border-[var(--primary)] transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[var(--foreground)]">
                    {item.category}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[#F7F6F2] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--muted-foreground)]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-[20px] font-semibold text-[var(--foreground)] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <Link
                href={item.href}
                className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-white py-2.5 px-4 text-[14px] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {item.action}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
