import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center py-24">
      <Container className="max-w-md">
        <p className="text-6xl font-bold text-[var(--primary)] mb-4">404</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-3">
          Page not found
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-8 leading-relaxed">
          Looks like this page doesn&apos;t exist — or the print job got cancelled halfway through.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 min-h-[44px] transition-colors shadow-sm"
        >
          Back to home
        </Link>
      </Container>
    </div>
  );
}
