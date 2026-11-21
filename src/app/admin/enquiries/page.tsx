"use client";

import React, { useState, useEffect } from "react";
import { enquiryService } from "@/services/enquiry-service";
import { ContactEnquiry, EnquiryStatus } from "@/types/admin";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Send,
  X,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [replyNote, setReplyNote] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadEnquiries = () => {
    enquiryService.getAllEnquiries().then(setEnquiries);
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectEnquiry = (enq: ContactEnquiry) => {
    setSelectedEnquiry(enq);
    setReplyNote(enq.internalReplyNote || "");
  };

  const handleUpdateStatus = async (status: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    const updated = await enquiryService.updateEnquiryStatus(
      selectedEnquiry.id,
      status,
      replyNote || undefined
    );
    if (updated) {
      setSelectedEnquiry(updated);
      setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      showToast(`Enquiry marked as "${status}".`);
    }
  };

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      e.customerName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q);

    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
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
            Contact Enquiries Inbox
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Manage inquiries submitted via the storefront contact portal, track corporate bulk queries, and log technician replies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
            New Enquiries: {enquiries.filter((e) => e.status === "New").length}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Customer Name, Subject, Email or Message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Enquiry Statuses</option>
            <option value="New">New Inquiries</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Layout: Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table (7 or 12 cols) */}
        <div className={selectedEnquiry ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Date Received</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                        No contact enquiries found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((enq) => {
                      const isSelected = selectedEnquiry?.id === enq.id;
                      return (
                        <tr
                          key={enq.id}
                          onClick={() => handleSelectEnquiry(enq)}
                          className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-50/70" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <strong className="block text-[var(--foreground)]">{enq.customerName}</strong>
                            <span className="text-[11px] text-[var(--muted-foreground)] block">{enq.email}</span>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <strong className="block text-[var(--foreground)] truncate">{enq.subject}</strong>
                            <p className="text-[11px] text-stone-500 truncate">{enq.message}</p>
                          </td>

                          <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                            {new Date(enq.submittedAt).toLocaleDateString()}
                          </td>

                          <td className="py-3.5 px-4">
                            <AdminStatusBadge status={enq.status} size="sm" />
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectEnquiry(enq);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-stone-100"
                            >
                              Inspect &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-500">
              <span>Customer queries submitted through storefront /contact form.</span>
              <span className="text-[11px] text-stone-400">{filtered.length} messages</span>
            </div>
          </div>
        </div>

        {/* Selected Enquiry Drawer (5 cols) */}
        {selectedEnquiry && (
          <div className="lg:col-span-5 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-lg flex flex-col gap-5 sticky top-20 animate-in fade-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Message Inspector
                </span>
                <h2 className="text-base font-extrabold text-[var(--foreground)] mt-0.5">
                  {selectedEnquiry.subject}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <AdminStatusBadge status={selectedEnquiry.status} size="sm" />
                  <span className="text-[10px] text-stone-400">
                    Received {new Date(selectedEnquiry.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Client Contact Info */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
              <strong className="block text-stone-800 font-bold">{selectedEnquiry.customerName}</strong>
              <div className="text-stone-600 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-stone-400" />
                <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 hover:underline">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div className="text-stone-600 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-stone-400" />
                <a href={`tel:${selectedEnquiry.phone}`} className="font-mono">
                  {selectedEnquiry.phone}
                </a>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Message Content
              </span>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Internal Reply / Follow-up Note */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Workshop Follow-up Note
              </span>
              <textarea
                rows={3}
                value={replyNote}
                onChange={(e) => setReplyNote(e.target.value)}
                placeholder="Log internal follow-up, pricing discussed, or material recommendations sent..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 text-xs focus:outline-hidden"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("In Progress")}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100"
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("Resolved")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-2xs"
                >
                  Resolve
                </button>
              </div>

              <a
                href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.subject)}`}
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Open Mailer</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
