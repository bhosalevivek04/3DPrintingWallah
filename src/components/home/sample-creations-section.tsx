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
    <section className="w-full bg-white py-20 border-y border-[var(--border)]/70" aria-labelledby="creations-heading">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex flex-col gap-10">
        {/* Section Introduction */}
        <div className="max-w-2xl flex flex-col gap-2">
          <p className="text-[13px] font-bold uppercase tracking-wider text-[var(--primary)]">
            The shape of possibility
          </p>
          <h2 id="creations-heading" className="text-[32px] sm:text-[36px] font-bold text-[var(--foreground)] tracking-tight">
            Sample maker creations
          </h2>
          <p className="text-[16px] text-[var(--muted-foreground)] leading-relaxed">
            A concept gallery of everyday possibilities. Illustrative renders showcasing layer resolution, texturing, and geometry.
          </p>
        </div>

        {/* Concept Gallery Grid with Apple Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {concepts.map((c, idx) => (
            <div
              key={idx}
              className="group flex flex-col rounded-2xl border border-[var(--border)]/80 bg-[#F7F6F2] overflow-hidden apple-card"
            >
              <div className="relative aspect-[4/3] w-full bg-[#EDECE8] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-6 flex flex-col gap-1.5 bg-white">
                <h3 className="text-[20px] font-bold text-[var(--foreground)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
                  {c.title}
                </h3>
                <p className="text-[14px] text-[var(--muted-foreground)]">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[13px] text-[var(--muted-foreground)]">
          Concepts illustrate fabrication capabilities. Final designs, materials and colors are tailored to your order.
        </p>
      </div>
    </section>
  );
}
