import React from "react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="w-full bg-[var(--background)] py-16" aria-label="Hero">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Introduction (Figma 0:1784) */}
          <div className="flex flex-col gap-6 max-w-[608px]">
            {/* Eyebrow */}
            <p className="text-[14px] font-semibold text-[var(--primary)]">
              Small workshop. Big possibilities.
            </p>

            {/* Headline */}
            <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] font-semibold tracking-tight text-[var(--foreground)] leading-[1.12]">
              Turn your ideas into something real.
            </h1>

            {/* Description */}
            <p className="text-[18px] text-[var(--muted-foreground)] leading-[1.6]">
              3D Printing Wallah creates custom 3D-printed products and brings your ideas to life. Find an everyday object, make it personal, or start something of your own.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-6 py-3.5 text-[14px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors min-h-[44px] shadow-sm"
              >
                Explore Products
              </Link>
              <Link
                href="/custom/3d-printing"
                className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-white px-6 py-3.5 text-[14px] font-semibold text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-colors min-h-[44px]"
              >
                Start a Custom Print
              </Link>
            </div>

            {/* Supporting note */}
            <p className="text-[14px] text-[var(--muted-foreground)]">
              Your model, your sketch, or just the start of an idea.
            </p>
          </div>

          {/* Right Column: Workshop Still Life (Figma 0:1790) */}
          <div className="flex flex-col gap-3 max-w-[608px] w-full">
            <div className="relative aspect-[608/456] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm border border-[var(--border)]">
              <Image
                src="/images/hero-workshop.webp"
                alt="Workshop still life with 3D printed blue ribbed planter and desktop accessories"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 608px"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between text-[14px] text-[var(--muted-foreground)] px-1">
              <span>Everyday objects, made layer by layer.</span>
              <span>Concept render</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
