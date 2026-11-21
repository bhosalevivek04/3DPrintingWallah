import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, Sparkles, Sliders, CheckCircle2 } from "lucide-react";

const principles = [
  {
    category: "Personal by design",
    badge: "Craft standard",
    icon: Sparkles,
    title: "Made around your idea",
    description: "Start with what you want to make, not a one-size-fits-all answer.",
    action: "Share your model",
    href: "/custom/3d-printing",
  },
  {
    category: "Details that matter",
    badge: "Craft standard",
    icon: Sliders,
    title: "Purpose before printing",
    description: "We discuss how your object will be used, so the brief has a clear direction.",
    action: "Discuss requirements",
    href: "/custom/3d-printing",
  },
  {
    category: "A clearer process",
    badge: "Craft standard",
    icon: CheckCircle2,
    title: "A shared starting point",
    description: "Dimensions, preferences and proposed details are reviewed before production.",
    action: "Learn how it works",
    href: "/how-it-works",
  },
];

export function WhyChooseSection() {
  return (
    <section className="w-full bg-[var(--background)] py-20 border-b border-[var(--border)]/70" aria-labelledby="why-heading">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col gap-10">
        {/* Section Introduction */}
        <div className="max-w-2xl flex flex-col gap-2">
          <p className="text-[13px] font-bold uppercase tracking-wider text-[var(--primary)]">
            Why choose {siteConfig.name}
          </p>
          <h2 id="why-heading" className="text-[32px] sm:text-[36px] font-bold text-[var(--foreground)] tracking-tight">
            Thoughtful making starts with listening.
          </h2>
        </div>

        {/* 3 Workshop Principle Cards with Apple-style micro-elevation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--border)]/80 bg-white p-7 sm:p-8 gap-6 apple-card"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--primary)] border border-blue-100 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[#F7F6F2] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--primary)]">
                    {item.category}
                  </span>

                  <h3 className="text-[20px] font-bold text-[var(--foreground)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-[15px] text-[var(--muted-foreground)] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--primary)] hover:underline pt-2 border-t border-stone-100"
                >
                  <span>{item.action}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
