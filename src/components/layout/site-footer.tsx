import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="w-full bg-[var(--brand-inverse)] text-white pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Contact Invitation Row (Figma 0:1899) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-[var(--brand-inverse-border)]">
          <div>
            <h3 className="text-[24px] font-semibold text-white tracking-tight">
              Have something in mind?
            </h3>
            <p className="mt-1 text-[16px] text-[#D7DDE2] leading-relaxed">
              Let’s find a starting point for your next creation.
            </p>
          </div>
          <Link
            href="/custom/3d-printing"
            className="shrink-0 inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-6 py-3.5 text-[14px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[44px]"
          >
            Start a conversation
          </Link>
        </div>

        {/* Footer Navigation (Figma 0:1903) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-[22px] sm:text-[24px] font-bold text-white tracking-tight"
            >
              <Image
                src="/images/Logo.png"
                alt="NewtronLabs Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md object-contain bg-white/10 p-0.5"
              />
              <span>{siteConfig.name}</span>
            </Link>
            <p className="text-[16px] text-[#8B99A8] leading-relaxed max-w-sm">
              Custom 3D printing, personal touches and everyday possibilities.
            </p>
            <Link
              href="/contact"
              className="mt-2 text-[16px] font-medium text-[#53B1FD] hover:underline"
            >
              {siteConfig.contact.contactText}
            </Link>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[14px] font-semibold text-white">Explore</h4>
            <ul className="flex flex-col gap-2.5 text-[14px] text-[#8B99A8]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=personalised"
                  className="hover:text-white transition-colors"
                >
                  Personalised products
                </Link>
              </li>
              <li>
                <Link
                  href="/custom/3d-printing"
                  className="hover:text-white transition-colors"
                >
                  Custom 3D Printing
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[14px] font-semibold text-white">Useful links</h4>
            <ul className="flex flex-col gap-2.5 text-[14px] text-[#8B99A8]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About {siteConfig.name}
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow along */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[14px] font-semibold text-white">Follow along</h4>
            <ul className="flex flex-col gap-2.5 text-[14px] text-[#8B99A8]">
              <li>
                <a
                  href={siteConfig.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <svg
                    className="h-4 w-4 fill-none stroke-current stroke-2 text-[#8B99A8] group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                  <span className="text-xs text-[#526170] group-hover:text-white transition-colors">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[var(--brand-inverse-border)] text-[14px] text-[#8B99A8]">
          <p>{siteConfig.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
