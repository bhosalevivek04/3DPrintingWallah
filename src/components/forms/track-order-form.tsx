"use client";

import React, { useState } from "react";

export function TrackOrderForm() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setStatus("Searching for order " + orderId.trim() + "...");
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="order-id"
          className="text-sm font-medium text-[var(--foreground)]"
        >
          Order ID or Email
        </label>
        <input
          id="order-id"
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. 3DPW-12345 or you@email.com"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] transition-shadow"
          required
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 min-h-[44px] transition-colors shadow-sm"
      >
        Track order
      </button>

      {status && (
        <div className="rounded-md bg-[var(--accent)] p-3 text-xs text-[var(--primary)]">
          {status} (Mock system: Orders usually ship within 24–48 hours)
        </div>
      )}
    </form>
  );
}
