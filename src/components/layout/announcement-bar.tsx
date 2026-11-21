import React from "react";
import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  return (
    <div
      className="w-full bg-[var(--brand-inverse)] h-9 flex items-center justify-center px-4"
      role="banner"
      aria-label="Site announcement"
    >
      <p className="text-[14px] text-white font-normal leading-5 text-center">
        {siteConfig.announcement}
      </p>
    </div>
  );
}
