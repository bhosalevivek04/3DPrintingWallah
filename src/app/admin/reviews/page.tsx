"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { reviewService } from "@/services/review-service";
import { AdminProductReview, ReviewStatus } from "@/types/admin";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminProductReview[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadReviews = () => {
    reviewService.getAllReviews().then(setReviews);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateStatus = async (id: string, status: ReviewStatus) => {
    await reviewService.updateReviewStatus(id, status);
    loadReviews();
    showToast(`Review marked as "${status}".`);
  };

  const handleDelete = async (id: string) => {
    await reviewService.deleteReview(id);
    loadReviews();
    showToast("Review deleted.");
  };

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.productName.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q);

    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
            Product Reviews Moderation
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Approve verified customer feedback, monitor printing satisfaction ratings, and filter spam.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
            Pending Moderation: {reviews.filter((r) => r.status === "Pending").length}
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
            placeholder="Search by Product Name, Reviewer, or Feedback Text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-medium text-[var(--foreground)] placeholder:text-stone-400 focus:outline-hidden"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Moderation States</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved (Public on Store)</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Rating & Title</th>
                <th className="py-3 px-4">Review Content</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                    No reviews found matching the filter.
                  </td>
                </tr>
              ) : (
                filtered.map((rev) => (
                  <tr key={rev.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      <div className="flex items-center gap-2.5">
                        {rev.productImage && (
                          <div className="relative h-9 w-9 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            <Image src={rev.productImage} alt={rev.productName} fill className="object-cover" sizes="36px" />
                          </div>
                        )}
                        <span className="truncate max-w-[140px]">{rev.productName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < rev.rating ? "fill-amber-400" : "text-stone-200"}`}
                          />
                        ))}
                      </div>
                      <strong className="block text-[var(--foreground)] truncate max-w-[160px]">{rev.title}</strong>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-stone-600 line-clamp-2 leading-relaxed text-[11px]">{rev.comment}</p>
                      <span className="text-[10px] text-stone-400 block mt-1">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="block text-[var(--foreground)]">{rev.customerName}</strong>
                      <span className="text-[11px] text-stone-400 block">{rev.customerEmail}</span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold mt-0.5">
                          <Check className="h-2.5 w-2.5" />
                          Verified Buyer
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <AdminStatusBadge status={rev.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== "Approved" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(rev.id, "Approved")}
                            title="Approve Review"
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {rev.status !== "Rejected" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(rev.id, "Rejected")}
                            title="Reject / Mark Spam"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(rev.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-500">
          <span>Approved reviews reflect on individual product details on the storefront.</span>
          <span className="text-[11px] text-stone-400">{filtered.length} total reviews</span>
        </div>
      </div>
    </div>
  );
}
