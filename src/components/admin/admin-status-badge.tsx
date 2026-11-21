import React from "react";
import { OrderRequestStatus, PaymentStatus } from "@/types/order";
import { QuotationStatus, ReviewStatus, EnquiryStatus, TrackingFulfillmentStatus } from "@/types/admin";
import { ProductAvailability } from "@/types/product";

interface StatusBadgeProps {
  status:
    | OrderRequestStatus
    | PaymentStatus
    | QuotationStatus
    | ReviewStatus
    | EnquiryStatus
    | TrackingFulfillmentStatus
    | ProductAvailability
    | string;
  className?: string;
  size?: "sm" | "md";
}

export function AdminStatusBadge({ status, className = "", size = "md" }: StatusBadgeProps) {
  const s = String(status || "").trim();
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  let colorClasses = "bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] border-[var(--color-border)]";

  // Success: Green
  if (
    s === "Payment Confirmed" ||
    s === "Confirmed & Payment Arranged" ||
    s === "Accepted" ||
    s === "Approved" ||
    s === "in_stock" ||
    s === "In Stock" ||
    s === "Delivered" ||
    s === "Completed" ||
    s === "Resolved"
  ) {
    colorClasses = "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]";
  }
  // Warning / Attention: Amber
  else if (
    s === "Under Review" ||
    s === "Under Workshop Review" ||
    s === "under_review" ||
    s === "In Progress" ||
    s === "Ready for Review" ||
    s === "Awaiting Customer Confirmation" ||
    s === "Quotation Sent" ||
    s === "quotation_sent" ||
    s === "Sent" ||
    s === "Awaiting Payment" ||
    s === "low_stock" ||
    s === "Low Stock" ||
    s === "made_to_order" ||
    s === "Made to Order" ||
    s === "requires_info" ||
    s === "Partially Paid" ||
    s === "Delayed"
  ) {
    colorClasses = "bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]";
  }
  // Danger / Terminated: Red
  else if (
    s === "out_of_stock" ||
    s === "Out of Stock" ||
    s === "Cancelled" ||
    s === "cancelled" ||
    s === "Rejected" ||
    s === "Expired" ||
    s === "Unpaid" ||
    s === "Refunded"
  ) {
    colorClasses = "bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger-border)]";
  }
  // Info / Active Lifecycle: Brand Blue
  else if (
    s === "Request Submitted" ||
    s === "submitted" ||
    s === "New" ||
    s === "Order Placed" ||
    s === "Processing / In Production" ||
    s === "In Production" ||
    s === "in_production" ||
    s === "Quality Check" ||
    s === "Ready for Dispatch" ||
    s === "Packed" ||
    s === "Dispatched" ||
    s === "In Transit" ||
    s === "Out for Delivery"
  ) {
    colorClasses = "bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info-border)]";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      <span>{s}</span>
    </span>
  );
}
