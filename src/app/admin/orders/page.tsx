"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { orderService } from "@/services/order-service";
import { OrderRequest, OrderRequestStatus, PaymentStatus } from "@/types/order";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import {
  FileBox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PhoneCall,
  Truck,
  Package,
  X,
  MessageSquare,
  AlertCircle,
  IndianRupee,
  Calendar,
  User,
  MapPin,
  ExternalLink,
  Plus,
  Send,
  History,
  ShieldAlert,
} from "lucide-react";

const ALL_12_STATUSES: OrderRequestStatus[] = [
  "Request Submitted",
  "Under Review",
  "Awaiting Customer Confirmation",
  "Quotation Sent",
  "Awaiting Payment",
  "Payment Confirmed",
  "Processing / In Production",
  "Quality Check",
  "Ready for Dispatch",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const ALL_PAYMENT_STATUSES: PaymentStatus[] = [
  "Unpaid",
  "Awaiting Payment",
  "Partially Paid",
  "Payment Confirmed",
  "Refunded",
];

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref");

  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);

  // Status Change State
  const [newStatus, setNewStatus] = useState<OrderRequestStatus>("Under Review");
  const [statusChangeNote, setStatusChangeNote] = useState("");

  // Payment Status State
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>("Payment Confirmed");
  const [paymentNote, setPaymentNote] = useState("");

  // Internal Note State
  const [newInternalNote, setNewInternalNote] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Workshop Tech");

  // Feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    orderService.getAllOrders().then((all) => {
      setOrders(all);
      if (refParam) {
        const found = all.find((o) => o.orderId.toLowerCase() === refParam.toLowerCase());
        if (found) setSelectedOrder(found);
      }
    });
  }, [refParam]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered orders list
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      o.orderId.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q);

    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchPayment = paymentFilter === "All" || (o.paymentStatus || "Unpaid") === paymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    const updated = await orderService.updateOrderStatus(
      selectedOrder.orderId,
      newStatus,
      statusChangeNote || undefined,
      noteAuthor
    );
    if (updated) {
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      setStatusChangeNote("");
      showToast(`Order status updated to "${newStatus}" and recorded in history.`);
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedOrder) return;
    const updated = await orderService.updatePaymentStatus(
      selectedOrder.orderId,
      newPaymentStatus,
      paymentNote || undefined
    );
    if (updated) {
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      setPaymentNote("");
      showToast(`Payment status updated to "${newPaymentStatus}".`);
    }
  };

  const handleAddNote = async () => {
    if (!selectedOrder || !newInternalNote.trim()) return;
    const updated = await orderService.addInternalNote(
      selectedOrder.orderId,
      newInternalNote.trim(),
      noteAuthor
    );
    if (updated) {
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      setNewInternalNote("");
      showToast("Internal note appended to order record.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Order Requests Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Review customer order enquiries, calculate custom logistics, update fabrication stages, and confirm payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
            Total Requests: {orders.length}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID (NWL-ORD-...), Customer Name, Email, or Phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Order Statuses ({orders.length})</option>
            {ALL_12_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Filter */}
        <div className="md:col-span-3">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Payment Statuses</option>
            {ALL_PAYMENT_STATUSES.map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table & Detail Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Orders Table (Full or 7 cols if drawer open) */}
        <div className={selectedOrder ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Items / Qty</th>
                    <th className="py-3 px-4">Est. Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                        No order requests found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((ord) => {
                      const isSelected = selectedOrder?.orderId === ord.orderId;
                      return (
                        <tr
                          key={ord.orderId}
                          onClick={() => setSelectedOrder(ord)}
                          className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-50/70" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[var(--foreground)]">
                            <div>{ord.orderId}</div>
                            <span className="text-[10px] text-stone-400 font-sans block">
                              {new Date(ord.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <strong className="block text-[var(--foreground)]">{ord.customer.fullName}</strong>
                            <span className="text-[11px] text-[var(--muted-foreground)] block truncate max-w-[140px]">
                              {ord.customer.email}
                            </span>
                            <span className="text-[10px] text-stone-400">{ord.customer.phone}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-[var(--foreground)]">
                              {ord.totalQuantity} unit(s)
                            </span>
                            <span className="text-[10px] text-stone-400 block truncate max-w-[120px]">
                              {ord.items[0]?.name || "Custom Items"}
                              {ord.items.length > 1 ? ` +${ord.items.length - 1} more` : ""}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-[var(--foreground)]">
                              ₹{(ord.grandTotal || ord.estimatedSubtotal).toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-stone-400 block">Excl. Shipping</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <AdminStatusBadge status={ord.status} size="sm" />
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ord.paymentStatus === "Payment Confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : ord.paymentStatus === "Awaiting Payment"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-stone-100 text-stone-600"
                              }`}
                            >
                              {ord.paymentStatus || "Unpaid"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(ord);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-stone-100"
                            >
                              Details &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-500">
              <span>Showing {filtered.length} of {orders.length} requests</span>
              <span className="text-[11px] text-stone-400">Click any row to open management drawer</span>
            </div>
          </div>
        </div>

        {/* Order Details Drawer / Panel (5 cols) */}
        {selectedOrder && (
          <div className="lg:col-span-5 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-lg flex flex-col gap-6 sticky top-20 animate-in fade-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Order Management Inspector
                </span>
                <h2 className="text-xl font-extrabold font-mono text-[var(--foreground)] mt-0.5">
                  {selectedOrder.orderId}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <AdminStatusBadge status={selectedOrder.status} size="sm" />
                  <span className="text-[11px] text-stone-400">
                    Logged {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href={`/track-order?ref=${selectedOrder.orderId}`}
                  target="_blank"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[var(--primary)] hover:bg-stone-100"
                  title="Preview customer tracking view"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 1. Customer Information */}
            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-[var(--border)] flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between font-bold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-stone-400" />
                  <span>Customer Contact</span>
                </span>
                <span className="text-[10px] bg-stone-200/80 px-2 py-0.5 rounded-sm uppercase">
                  Via {selectedOrder.customer.preferredContactMethod}
                </span>
              </div>
              <div className="space-y-0.5 pt-1">
                <strong className="block text-sm text-[var(--foreground)]">
                  {selectedOrder.customer.fullName}
                  {selectedOrder.customer.company && ` (${selectedOrder.customer.company})`}
                </strong>
                <div className="text-stone-600">
                  <a href={`mailto:${selectedOrder.customer.email}`} className="text-blue-600 hover:underline">
                    {selectedOrder.customer.email}
                  </a>{" "}
                  •{" "}
                  <a href={`tel:${selectedOrder.customer.phone}`} className="text-stone-700 font-mono">
                    {selectedOrder.customer.phone}
                  </a>
                </div>
                <div className="text-stone-500 flex items-start gap-1 pt-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-stone-400" />
                  <span>
                    {selectedOrder.customer.deliveryAddress}, {selectedOrder.customer.city},{" "}
                    {selectedOrder.customer.state} - {selectedOrder.customer.pinCode}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Ordered Products Snapshot */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Products Snapshot
              </h3>
              <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <strong className="block text-[var(--foreground)]">{item.name}</strong>
                        <span className="text-[11px] text-stone-500">
                          {item.selectedColor || "Standard"} • Qty: {item.quantity} × ₹{item.unitPrice}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-[var(--foreground)]">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                <div className="p-3 bg-stone-50/70 flex items-center justify-between text-xs font-bold">
                  <span>Estimated Total (excl. courier)</span>
                  <span className="text-sm">₹{selectedOrder.estimatedSubtotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* 3. Status Progression Selector (All 12 Statuses) */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Update Fabrication Status
                </span>
                <span className="text-[10px] text-blue-800 font-semibold">12-Step Lifecycle</span>
              </div>

              <div className="flex flex-col gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderRequestStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-300 bg-white text-xs font-bold text-stone-800 focus:outline-hidden"
                >
                  {ALL_12_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={statusChangeNote}
                  onChange={(e) => setStatusChangeNote(e.target.value)}
                  placeholder="Optional status update note for audit history..."
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs placeholder:text-stone-400 focus:outline-hidden"
                />

                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="w-full py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Update Order Status</span>
                </button>
              </div>
            </div>

            {/* 4. Payment Status (Strictly Separate from Order Status) */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Payment Status Verification
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold">Separate Ledger</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-bold text-stone-800 focus:outline-hidden"
                >
                  {ALL_PAYMENT_STATUSES.map((ps) => (
                    <option key={ps} value={ps}>
                      {ps}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleUpdatePayment}
                  className="w-full sm:w-1/2 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </div>

            {/* 5. Status History Timeline */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <History className="h-3.5 w-3.5 text-stone-400" />
                <span>Status History & Audit Log</span>
              </div>

              <div className="max-h-44 overflow-y-auto rounded-xl border border-[var(--border)] p-3 space-y-2.5 bg-stone-50/50">
                {(!selectedOrder.statusHistory || selectedOrder.statusHistory.length === 0) ? (
                  <div className="text-[11px] text-stone-400">Initial submission record.</div>
                ) : (
                  selectedOrder.statusHistory.map((item, idx) => (
                    <div key={idx} className="text-xs flex flex-col gap-0.5 border-l-2 border-blue-400 pl-2.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[var(--foreground)]">{item.status}</strong>
                        <span className="text-[10px] text-stone-400">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {item.note && <p className="text-[11px] text-stone-600">{item.note}</p>}
                      <span className="text-[10px] text-stone-400">By: {item.updatedBy || "Staff"}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 6. Internal Admin Notes */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
                <span>Internal Workshop Notes</span>
              </div>

              {selectedOrder.internalNotes && selectedOrder.internalNotes.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {selectedOrder.internalNotes.map((note) => (
                    <div key={note.id} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-900 text-[11px]">
                        <span>{note.author}</span>
                        <span className="font-normal text-[10px] text-stone-400">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-stone-700 mt-1">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newInternalNote}
                  onChange={(e) => setNewInternalNote(e.target.value)}
                  placeholder="Add internal technician note..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-white text-xs placeholder:text-stone-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Loading order management...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
