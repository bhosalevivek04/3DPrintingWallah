import React from "react";
import Image from "next/image";

const concepts = [
  {
    image: "/images/concept-texture.webp",
    alt: "Sample 3D print concept: Play with texture ribbed form",
    title: "Play with texture",
    description: "Ribbed forms · Home objects",
  },
  {
    image: "/images/concept-modular.webp",
    alt: "Sample 3D print concept: Make room for the useful modular shapes",
    title: "Make room for the useful",
    description: "Modular shapes · Desk objects",
  },
  {
    image: "/images/concept-lettering.webp",
    alt: "Sample 3D print concept: Add a personal detail raised lettering",
    title: "Add a personal detail",
    description: "Raised lettering · Personalisation",
  },
];

export function SampleCreationsSection() {
  return (
    <section className="w-full bg-white py-20 border-y border-[var(--border)]" aria-labelledby="creations-heading">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex flex-col gap-10">
        {/* Section Introduction (Figma 0:1869) */}
        <div className="max-w-2xl flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-[var(--primary)]">
            The shape of possibility
          </p>
          <h2 id="creations-heading" className="text-[32px] font-semibold text-[var(--foreground)] tracking-tight">
            Sample maker creations
          </h2>
          <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
            A concept gallery of everyday possibilities. Illustrative renders, not completed customer projects.
          </p>
        </div>

        {/* Concept Gallery Grid (Figma 0:1873) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {concepts.map((c, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-2xl border border-[var(--border)] bg-[#F7F6F2] overflow-hidden shadow-xs hover:border-[var(--primary)] transition-all"
            >
              <div className="relative aspect-[4/3] w-full bg-[#EDECE8] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col gap-1">
                <h3 className="text-[20px] font-semibold text-[var(--foreground)] tracking-tight">
                  {c.title}
                </h3>
                <p className="text-[14px] text-[var(--muted-foreground)]">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
