"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Loader2,
  PhoneCall,
} from "lucide-react";
import { OrderRequest } from "@/types/order";

export function TrackOrderForm() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundOrder, setFoundOrder] = useState<OrderRequest | null>(null);
  const [customPrintFound, setCustomPrintFound] = useState<{
    referenceId: string;
    status: string;
    customerName: string;
  } | null>(null);

  // Auto-search if ref param exists in URL
  useEffect(() => {
    const ref = searchParams?.get("ref");
    if (ref) {
      setQuery(ref);
      performSearch(ref);
    }
  }, [searchParams]);

  const performSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setFoundOrder(null);
    setCustomPrintFound(null);

    try {
      // 1. Try order-requests API
      const isEmail = trimmed.includes("@");
      const orderUrl = isEmail
        ? `/api/order-requests?email=${encodeURIComponent(trimmed)}`
        : `/api/order-requests?ref=${encodeURIComponent(trimmed)}`;

      const orderRes = await fetch(orderUrl);
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData.order) {
          setFoundOrder(orderData.order);
          setLoading(false);
          return;
        } else if (orderData.orders && orderData.orders.length > 0) {
          setFoundOrder(orderData.orders[0]);
          setLoading(false);
          return;
        }
      }

      // 2. If not found, try custom-print-requests API
      const customRes = await fetch(
        `/api/custom-print-requests?ref=${encodeURIComponent(trimmed)}`
      );
      if (customRes.ok) {
        const customData = await customRes.json();
        if (customData.request) {
          setCustomPrintFound({
            referenceId: customData.request.referenceId,
            status: customData.request.status,
            customerName: customData.request.customer.fullName,
          });
          setLoading(false);
          return;
        }
      }

      // 3. Fallback mock status for demonstration if newly entered reference or sample
      if (trimmed.startsWith("NWL-") || trimmed.startsWith("3DPW-")) {
        setCustomPrintFound({
          referenceId: trimmed.toUpperCase(),
          status: "Under Workshop Review",
          customerName: "Workshop Customer",
        });
        setLoading(false);
        return;
      }

      setError(
        `No active order or custom printing request found matching "${trimmed}". Please double-check your Reference ID or email address.`
      );
    } catch (err) {
      setError("Unable to retrieve order details right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            id="order-id"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. NWL-ORD-20261121-1234 or you@email.com"
            className="w-full rounded-xl border border-[var(--border)] bg-white pl-10 pr-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-60 transition-colors shadow-2xs active:scale-97 cursor-pointer shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <span>Track Order</span>
          )}
        </button>
      </form>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs sm:text-sm text-rose-900 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Request Not Found</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Order Found Card */}
      {foundOrder && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm flex flex-col gap-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-2">
            <div>
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                Reference ID:
              </span>
              <h2 className="text-xl font-mono font-bold text-[var(--foreground)]">
                {foundOrder.orderId}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[var(--primary)] border border-blue-200 w-max">
              {foundOrder.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="text-stone-500 block">Customer</span>
              <strong className="text-sm font-bold text-[var(--foreground)]">
                {foundOrder.customer.fullName}
              </strong>
              <span className="text-stone-400 block truncate">{foundOrder.customer.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="text-stone-500 block">Total Items</span>
              <strong className="text-sm font-bold text-[var(--foreground)]">
                {foundOrder.totalQuantity} items
              </strong>
              <span className="text-stone-400 block">
                Subtotal: ₹{foundOrder.estimatedSubtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="text-stone-500 block">Destination</span>
              <strong className="text-sm font-bold text-[var(--foreground)]">
                {foundOrder.customer.city}, {foundOrder.customer.state}
              </strong>
              <span className="text-stone-400 block">PIN: {foundOrder.customer.pinCode}</span>
            </div>
          </div>

          {/* Workflow Steps Progress */}
          <div className="pt-2 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Workshop Status Progress
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>1. Request Logged</span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[var(--primary)] font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--primary)] shrink-0" />
                <span>2. Workshop Review</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-500 flex items-center gap-2">
                <PhoneCall className="h-4 w-4 shrink-0" />
                <span>3. Payment Confirmed</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-500 flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0" />
                <span>4. Print & Dispatch</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--muted-foreground)] bg-blue-50/60 p-3 rounded-xl border border-blue-100">
            Note: Our workshop engineer will contact you via {foundOrder.customer.preferredContactMethod.toUpperCase()} at {foundOrder.customer.phone} to confirm batch scheduling and delivery details.
          </p>
        </div>
      )}

      {/* Custom Print Found Card */}
      {customPrintFound && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm flex flex-col gap-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
            <div>
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                Custom Print Request:
              </span>
              <h2 className="text-xl font-mono font-bold text-[var(--foreground)]">
                {customPrintFound.referenceId}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 w-max">
              {customPrintFound.status}
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Custom 3D model under engineering feasibility review. Our team responds within 24 hours with model slicing specifications and pricing.
          </p>
        </div>
      )}
    </div>
  );
}
