import React from "react";
import Link from "next/link";
import Image from "next/image";

const personalisedProducts = [
  {
    id: "your-name-desk-plate",
    image: "/images/personalised-desk-plate.webp",
    alt: "Personalised your-name desk plate in custom 3D typography",
    categoryLabel: "Make it yours",
    badge: "Sample product",
    title: "Your-name desk plate",
    description: "A name, a word, a little personality for your space.",
    href: "/shop?category=personalised",
  },
  {
    id: "initial-keyring",
    image: "/images/personalised-keyring.webp",
    alt: "Personalised initial keyring custom 3D printed",
    categoryLabel: "A personal touch",
    badge: "Sample product",
    title: "Initial keyring",
    description: "A simple everyday object with your own initial.",
    href: "/shop?category=personalised",
  },
];

export function PersonalisedSection() {
  return (
    <section className="w-full bg-[var(--background)] py-20" aria-labelledby="personalised-heading">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex flex-col gap-10">
        {/* Section Introduction (Figma 0:1810) */}
        <div className="max-w-2xl flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-[var(--primary)]">
            A little more you
          </p>
          <h2 id="personalised-heading" className="text-[32px] font-semibold text-[var(--foreground)] tracking-tight">
            Personalised products
          </h2>
          <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
            Start with a sample concept, then talk to us about names, initials, dimensions and finish preferences. Small details can make something feel your own.
          </p>
        </div>

        {/* Collection Cards (Figma 0:1814) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[840px]">
          {personalisedProducts.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-xs hover:border-[var(--primary)] transition-all"
            >
              {/* Product Image */}
              <div className="relative aspect-[16/10] w-full bg-[#EDECE8] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-5 flex flex-col gap-3.5 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[var(--muted-foreground)]">
                      {p.categoryLabel}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[#F7F6F2] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-semibold text-[var(--foreground)] tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <Link
                  href={p.href}
                  className="mt-1 inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-white py-2 px-4 text-[13px] font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors min-h-[40px]"
                >
                  Explore concept
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Catalogue Note (Figma 0:1819) */}
        <p className="text-[14px] text-[var(--muted-foreground)]">
          Sample catalogue preview. Personalisation options are discussed for each project.
        </p>
      </div>
    </section>
  );
}
