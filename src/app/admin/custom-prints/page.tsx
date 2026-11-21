"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { customPrintService } from "@/services/custom-print-service";
import { CustomPrintRequest, CustomPrintStatus } from "@/types/custom-print";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  Layers,
  Search,
  Filter,
  FileCode,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Send,
  ExternalLink,
  ShieldAlert,
  Info,
  Calendar,
} from "lucide-react";

function CustomPrintsContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref");
  const router = useRouter();

  const [requests, setRequests] = useState<CustomPrintRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedRequest, setSelectedRequest] = useState<CustomPrintRequest | null>(null);

  // Status and Notes
  const [newStatus, setNewStatus] = useState<CustomPrintStatus>("under_review");
  const [adminNote, setAdminNote] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    customPrintService.getAllRequests().then((all) => {
      setRequests(all);
      if (refParam) {
        const found = all.find((r) => r.referenceId.toLowerCase() === refParam.toLowerCase());
        if (found) setSelectedRequest(found);
      }
    });
  }, [refParam]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.referenceId.toLowerCase().includes(q) ||
      r.customer.fullName.toLowerCase().includes(q) ||
      r.customer.email.toLowerCase().includes(q) ||
      r.modelFile.name.toLowerCase().includes(q);

    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (statusToSet: CustomPrintStatus, noteOverride?: string) => {
    if (!selectedRequest) return;
    const note = noteOverride !== undefined ? noteOverride : adminNote;
    const updated = await customPrintService.updateRequestStatus(
      selectedRequest.referenceId,
      statusToSet,
      note || undefined
    );
    if (updated) {
      setSelectedRequest(updated);
      setRequests((prev) => prev.map((r) => (r.referenceId === updated.referenceId ? updated : r)));
      setAdminNote("");
      showToast(`Custom print status updated to "${statusToSet}".`);
    }
  };

  const handleCreateQuotationDraft = () => {
    if (!selectedRequest) return;
    router.push(`/admin/quotations?createFromPrint=${selectedRequest.referenceId}`);
  };

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
            Custom 3D Printing Submissions
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Examine uploaded STL/OBJ CAD geometries, inspect slicing parameters, review materials, and generate customer quotations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
            Total CAD Submissions: {requests.length}
          </span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Reference (NWL-CP-...), File Name, or Customer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Submission Statuses</option>
            <option value="submitted">New Submissions</option>
            <option value="under_review">Under Slicing Review</option>
            <option value="quotation_prepared">Quotation Prepared</option>
            <option value="quotation_sent">Quotation Sent</option>
            <option value="requires_info">Requires More Info</option>
            <option value="accepted">Accepted / In Production</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Requests List & Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table / List (7 cols or 12 cols) */}
        <div className={selectedRequest ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Ref ID & Date</th>
                    <th className="py-3 px-4">Uploaded CAD File</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Material / Tech</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                        No custom printing requests match the search query.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((req) => {
                      const isSelected = selectedRequest?.referenceId === req.referenceId;
                      return (
                        <tr
                          key={req.referenceId}
                          onClick={() => setSelectedRequest(req)}
                          className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-50/70" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[var(--foreground)]">
                            <div>{req.referenceId}</div>
                            <span className="text-[10px] text-stone-400 font-sans block">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded-sm bg-stone-100 font-mono text-[10px] uppercase font-bold text-stone-700">
                                {req.modelFile.extension}
                              </span>
                              <span className="font-semibold text-stone-800 truncate max-w-[150px]">
                                {req.modelFile.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400 block mt-0.5">
                              {req.modelFile.formattedSize} • Qty: {req.requirements.quantity}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <strong className="block text-[var(--foreground)]">{req.customer.fullName}</strong>
                            <span className="text-[10px] text-stone-400">{req.customer.city || "India"}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-stone-800 block">
                              {req.requirements.material}
                            </span>
                            <span className="text-[10px] text-stone-400 uppercase">
                              {req.requirements.technology.toUpperCase()} • {req.requirements.color}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <AdminStatusBadge status={req.status} size="sm" />
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(req);
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
              <span>Showing {filtered.length} of {requests.length} custom submissions</span>
              <span className="text-[11px] text-stone-400">Click any row to open fabrication inspector</span>
            </div>
          </div>
        </div>

        {/* Selected Request Fabrication Inspector (5 cols) */}
        {selectedRequest && (
          <div className="lg:col-span-5 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-lg flex flex-col gap-6 sticky top-20 animate-in fade-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  CAD Fabrication Inspector
                </span>
                <h2 className="text-xl font-extrabold font-mono text-[var(--foreground)] mt-0.5">
                  {selectedRequest.referenceId}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <AdminStatusBadge status={selectedRequest.status} size="sm" />
                  <span className="text-[11px] text-stone-400">
                    Received {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 1. File Metadata (Prototype Notice) */}
            <div className="p-4 rounded-xl bg-stone-50 border border-[var(--border)] flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-blue-600" />
                  <span>3D CAD Model Metadata</span>
                </span>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-sm">
                  {selectedRequest.modelFile.extension.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-white border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">File Name:</span>
                  <strong className="text-stone-800 truncate block">
                    {selectedRequest.modelFile.name}
                  </strong>
                </div>
                <div className="p-2 rounded-lg bg-white border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">File Size:</span>
                  <strong className="text-stone-800">
                    {selectedRequest.modelFile.formattedSize}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Storage Notice:</strong> File metadata logged in local prototype storage. Real R2 binary streaming will be connected during backend integration.
              </div>
            </div>

            {/* 2. Customer Contact */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] text-xs flex flex-col gap-1.5">
              <strong className="text-stone-700 uppercase tracking-wider text-[10px]">Customer Contact</strong>
              <div className="font-bold text-[var(--foreground)]">
                {selectedRequest.customer.fullName}
                {selectedRequest.customer.company && ` (${selectedRequest.customer.company})`}
              </div>
              <div className="text-stone-500">
                <a href={`mailto:${selectedRequest.customer.email}`} className="text-blue-600 hover:underline">
                  {selectedRequest.customer.email}
                </a>{" "}
                • {selectedRequest.customer.phone}
              </div>
              <div className="text-stone-500">
                Location: {selectedRequest.customer.city || "N/A"} - {selectedRequest.customer.pincode || ""}
              </div>
            </div>

            {/* 3. Printing Requirements */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-white text-xs flex flex-col gap-2">
              <strong className="text-stone-700 uppercase tracking-wider text-[10px]">
                Fabrication Requirements
              </strong>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-400 block">Technology:</span>
                  <span className="font-semibold text-stone-800 uppercase">
                    {selectedRequest.requirements.technology}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Material:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedRequest.requirements.material}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Color:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedRequest.requirements.color}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Surface Finish:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedRequest.requirements.surfaceFinish}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Quantity:</span>
                  <span className="font-bold text-stone-900">
                    {selectedRequest.requirements.quantity} unit(s)
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Dimensions:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedRequest.requirements.dimensions.useOriginal
                      ? "Original CAD Scale"
                      : `${selectedRequest.requirements.dimensions.width}×${selectedRequest.requirements.dimensions.height}×${selectedRequest.requirements.dimensions.depth} ${selectedRequest.requirements.dimensions.unit}`}
                  </span>
                </div>
              </div>

              {selectedRequest.requirements.additionalNotes && (
                <div className="mt-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-700">
                  <span className="font-bold block text-stone-900 mb-0.5">Customer Instructions:</span>
                  {selectedRequest.requirements.additionalNotes}
                </div>
              )}
            </div>

            {/* 4. Action: Create Quotation Draft */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">Quotation Generator</span>
                <span className="text-[10px] text-indigo-700 font-semibold">Ready to draft</span>
              </div>
              <p className="text-[11px] text-indigo-900/80">
                Generate an itemized quotation with custom resin/filament material charges, finishing fees, and delivery.
              </p>
              <button
                type="button"
                onClick={handleCreateQuotationDraft}
                className="w-full py-2.5 rounded-xl bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileText className="h-4 w-4" />
                <span>Create Quotation Draft &rarr;</span>
              </button>
            </div>

            {/* 5. Status Management & Internal Notes */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex flex-col gap-3">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Status & Workshop Actions
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("under_review")}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-[11px] font-semibold bg-white hover:bg-stone-100"
                >
                  Mark Under Slicing Review
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("requires_info", "Informed customer that CAD requires manifold wall thickness fix.")}
                  className="px-2.5 py-1.5 rounded-lg border border-orange-300 text-[11px] font-semibold bg-orange-50 text-orange-800 hover:bg-orange-100"
                >
                  Require More Info
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("accepted")}
                  className="px-2.5 py-1.5 rounded-lg border border-emerald-300 text-[11px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                >
                  Approve for Print Bed
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Internal note for this custom model..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-white text-xs placeholder:text-stone-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.status)}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminCustomPrintsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Loading custom prints queue...</div>}>
      <CustomPrintsContent />
    </Suspense>
  );
}
