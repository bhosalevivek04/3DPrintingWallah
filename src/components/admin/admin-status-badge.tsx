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

  let colorClasses = "bg-stone-100 text-stone-700 border-stone-200";

  // Order & Process Statuses
  if (
    s === "Request Submitted" ||
    s === "submitted" ||
    s === "New" ||
    s === "Order Placed"
  ) {
    colorClasses = "bg-sky-50 text-sky-700 border-sky-200";
  } else if (
    s === "Under Review" ||
    s === "Under Workshop Review" ||
    s === "under_review" ||
    s === "In Progress" ||
    s === "Ready for Review"
  ) {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (
    s === "Awaiting Customer Confirmation" ||
    s === "Quotation Sent" ||
    s === "quotation_sent" ||
    s === "Sent" ||
    s === "Awaiting Payment"
  ) {
    colorClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
  } else if (
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
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (
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
    colorClasses = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (
    s === "low_stock" ||
    s === "Low Stock" ||
    s === "made_to_order" ||
    s === "Made to Order" ||
    s === "requires_info" ||
    s === "Partially Paid" ||
    s === "Delayed"
  ) {
    colorClasses = "bg-orange-50 text-orange-700 border-orange-200";
  } else if (
    s === "out_of_stock" ||
    s === "Out of Stock" ||
    s === "Cancelled" ||
    s === "cancelled" ||
    s === "Rejected" ||
    s === "Expired" ||
    s === "Unpaid" ||
    s === "Refunded"
  ) {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
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
