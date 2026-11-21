import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";

const capabilities = [
  "Print a model you provide",
  "Develop a product from your idea",
  "Discuss size, materials and finish preferences",
];

export function CustomPrintingSection() {
  return (
    <section className="w-full bg-[var(--brand-inverse)] text-white py-20 lg:py-24" aria-labelledby="custom-heading">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Print in progress with subtle ambient depth */}
          <div className="flex flex-col gap-3 max-w-[608px] w-full">
            <div className="relative aspect-[608/456] w-full overflow-hidden rounded-2xl bg-[#0B1521] border border-[var(--brand-inverse-border)] shadow-xl group">
              <Image
                src="/images/custom-print-progress.webp"
                alt="3D print in progress showing high-precision FDM layers"
                fill
                sizes="(max-width: 1024px) 100vw, 608px"
                className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />
            </div>
            <p className="text-[13px] text-[#8B99A8] px-1">
              From digital detail to something you can hold.
            </p>
          </div>

          {/* Right Column: Service details */}
          <div className="flex flex-col gap-6 max-w-[608px]">
            <p className="text-[13px] font-bold uppercase tracking-wider text-[#53B1FD]">
              Custom 3D printing
            </p>
            <h2 id="custom-heading" className="text-[32px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.2]">
              Your idea. Your model. Your next project.
            </h2>
            <p className="text-[16px] text-[#D7DDE2] leading-relaxed">
              Have a 3D file ready to go? Or a useful idea that needs a starting point? We help turn both into a conversation about making.
            </p>

            {/* Capabilities list */}
            <ul className="flex flex-col gap-3 py-2">
              {capabilities.map((cap) => (
                <li key={cap} className="flex items-center gap-3 text-[15px] text-white">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A314A] text-[#53B1FD]">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>

            {/* CTA with Tactile Press State */}
            <div className="pt-2">
              <Link
                href="/custom/3d-printing"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-7 py-3.5 text-[14px] font-bold text-white hover:bg-[var(--primary-hover)] transition-all min-h-[46px] shadow-sm active:scale-97 cursor-pointer"
              >
                <span>Start a Custom Print</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Service note */}
            <p className="text-[13px] text-[#8B99A8]">
              We’ll discuss feasibility and proposed details before production.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
