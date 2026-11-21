"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { categoryService } from "@/services/category-service";
import { AdminCategory } from "@/types/admin";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  X,
  Layers,
  Check,
  Package,
} from "lucide-react";

const SAMPLE_CATEGORY_IMAGES = [
  "/images/product-ribbed-planter.webp",
  "/images/product-desk-tray.webp",
  "/images/product-lowpoly-fox.webp",
  "/images/product-voronoi-lamp.webp",
  "/images/product-mini-dragon.webp",
  "/images/product-controller-stand.webp",
  "/images/hero-workshop.webp",
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "/images/product-ribbed-planter.webp",
    displayOrder: 1,
    isActive: true,
    subcategories: "",
  });

  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  const loadCategories = () => {
    categoryService.getAllCategories().then(setCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "/images/product-ribbed-planter.webp",
      displayOrder: categories.length + 1,
      isActive: true,
      subcategories: "Vessels, Desk Sculptures, Miniature Art",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
      subcategories: cat.subcategories.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const subcats = formData.subcategories.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id, {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: formData.description,
        image: formData.image,
        displayOrder: Number(formData.displayOrder),
        isActive: formData.isActive,
        subcategories: subcats,
      });
      showToast(`Category "${formData.name}" updated successfully.`);
    } else {
      await categoryService.createCategory({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: formData.description,
        image: formData.image,
        displayOrder: Number(formData.displayOrder),
        isActive: formData.isActive,
        subcategories: subcats,
      });
      showToast(`New category "${formData.name}" created.`);
    }

    setIsModalOpen(false);
    loadCategories();
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const newOrder = [...categories];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIdx, 0, moved);

    const updated = await categoryService.reorderCategories(newOrder.map((c) => c.id));
    setCategories(updated);
    showToast("Category display ordering updated.");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await categoryService.deleteCategory(deleteTarget.id);
    loadCategories();
    showToast(`Category "${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
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
            Category & Taxonomy Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Organize product collections, subcategories, storefront carousel cards, and display ordering.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-all shadow-2xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-[var(--border)] text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Subcategories</th>
                <th className="py-3 px-4">Catalog Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold font-mono text-stone-500">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, "up")}
                        className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <span>{cat.displayOrder}</span>
                      <button
                        type="button"
                        disabled={idx === categories.length - 1}
                        onClick={() => handleMove(idx, "down")}
                        className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <strong className="block text-[var(--foreground)]">{cat.name}</strong>
                        <span className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                          {cat.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-stone-500">/{cat.slug}</td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cat.subcategories.map((sub) => (
                        <span key={sub} className="px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-700 text-[10px]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[var(--foreground)]">
                    {cat.productCount ?? 0} items
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-[var(--primary)] hover:bg-stone-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div
            className="w-full max-w-lg rounded-3xl bg-white border border-[var(--border)] shadow-2xl p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-base font-bold text-[var(--foreground)]">
                {editingCategory ? `Edit Category "${editingCategory.name}"` : "Add Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Architectural Planters"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. architectural-planters"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white font-mono text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Collection description displayed on shop cards and hero carousels..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Subcategories (comma-separated)</label>
                <input
                  type="text"
                  value={formData.subcategories}
                  onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                  placeholder="Geometric, Self-Watering, Desktop Pots"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-stone-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>

              {/* Cover Image Choice */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Cover Artwork Image</label>
                <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-stone-50 border border-[var(--border)]">
                  {SAMPLE_CATEGORY_IMAGES.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img })}
                      className={`relative h-12 w-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        formData.image === img ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Thumb" fill className="object-cover" sizes="48px" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-[var(--border)]">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[var(--primary)]"
                  />
                  <span>Active & Visible on Storefront</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        title={`Delete Category "${deleteTarget?.name}"?`}
        description="Removing this category will unassign its products from this taxonomy. This action can be tested safely in this prototype."
        confirmLabel="Delete Category"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
