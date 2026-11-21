import React from "react";
import { Container } from "@/components/ui/container";

const trustItems = [
  "🇮🇳  Made in India",
  "⚡  2–5 day turnaround",
  "📦  Ships pan-India",
  "🔁  Reprint guarantee",
];

export function TrustStrip() {
  return (
    <div
      className="border-b border-[var(--border)] bg-[var(--muted)] py-3"
      aria-label="Trust highlights"
    >
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {trustItems.map((item) => (
            <li
              key={item}
              className="text-xs font-medium text-[var(--muted-foreground)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
