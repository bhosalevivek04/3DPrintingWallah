"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-[var(--border)]">
      <div className="max-w-[1280px] h-full mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Wordmark with Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[20px] sm:text-[22px] font-bold tracking-tight text-[var(--brand-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded py-1"
        >
          <Image
            src="/images/Logo.png"
            alt="NewtronLabs Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-contain"
            priority
          />
          <span>{siteConfig.name}</span>
        </Link>

        {/* Main Navigation (Figma: 14px Semi Bold, #1D2B39, 28px gap) */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          <Link
            href="/shop"
            className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded py-1"
          >
            Shop
          </Link>
          <Link
            href="/custom/3d-printing"
            className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded py-1"
          >
            Custom 3D Printing
          </Link>
          <Link
            href="/how-it-works"
            className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded py-1"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded py-1"
          >
            About
          </Link>
        </nav>

        {/* Utility Navigation (Figma: Track Order + Cart) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/track-order"
            className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded py-1"
          >
            Track Order
          </Link>
          <Link
            href="/shop"
            className="text-[14px] font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded py-1"
          >
            Cart (0)
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[var(--foreground)] hover:bg-[var(--background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[var(--border)] px-6 py-5 flex flex-col gap-4">
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[16px] font-semibold text-[var(--foreground)] py-1"
          >
            Shop
          </Link>
          <Link
            href="/custom/3d-printing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[16px] font-semibold text-[var(--foreground)] py-1"
          >
            Custom 3D Printing
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[16px] font-semibold text-[var(--foreground)] py-1"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[16px] font-semibold text-[var(--foreground)] py-1"
          >
            About
          </Link>
          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] font-semibold text-[var(--muted-foreground)]"
            >
              Track Order
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] font-semibold text-[var(--foreground)]"
            >
              Cart (0)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
