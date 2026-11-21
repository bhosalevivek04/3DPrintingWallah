"use client";

import React from "react";
import {
  PrintingRequirements,
  PrintTechnology,
  PrintingColor,
  SurfaceFinish,
  DimensionsUnit,
} from "@/types/custom-print";
import {
  Cpu,
  Layers,
  Palette,
  Sparkles,
  Maximize2,
  HelpCircle,
  Package,
  Info,
} from "lucide-react";

interface StepRequirementsProps {
  requirements: PrintingRequirements;
  onChange: (requirements: PrintingRequirements) => void;
}

const TECHNOLOGIES: {
  id: PrintTechnology;
  name: string;
  badge?: string;
  desc: string;
  bestFor: string;
}[] = [
  {
    id: "resin",
    name: "Resin Printing (SLA/MSLA)",
    badge: "Ultra-High Detail",
    desc: "Photopolymer liquid cured by UV light. Razor-sharp details with almost invisible layer lines.",
    bestFor: "Miniatures, collectibles, jewelry, intricate parts",
  },
  {
    id: "fdm",
    name: "FDM Printing",
    badge: "Durable & Versatile",
    desc: "Thermoplastic filament melted layer by layer. Strong, cost-effective, and functional.",
    bestFor: "Enclosures, brackets, mechanical prototypes, home decor",
  },
  {
    id: "recommend",
    name: "Not Sure — Recommend the Best Option",
    badge: "Expert Assistance",
    desc: "Our engineering team will analyze your 3D mesh geometry and recommend the ideal balance of strength and finish.",
    bestFor: "General inquiries, new projects, complex geometries",
  },
];

const RESIN_MATERIALS = [
  { id: "Standard Resin", label: "Standard Photopolymer Resin (Smooth surface)" },
  { id: "ABS-like Resin", label: "ABS-like Tough Resin (Higher impact resistance)" },
  { id: "Clear / Translucent Resin", label: "Clear / Translucent Resin (Optical transparency)" },
  { id: "Other / Need Recommendation", label: "Other / Need Recommendation" },
];

const FDM_MATERIALS = [
  { id: "PLA / PLA+", label: "PLA / PLA+ (Eco-friendly, best surface detail)" },
  { id: "PETG", label: "PETG (Durable, moisture & heat resistant)" },
  { id: "TPU (Flexible)", label: "TPU (Flexible, rubber-like shock absorption)" },
  { id: "ABS / ASA", label: "ABS / ASA (UV & outdoor weather resistant)" },
  { id: "Other / Need Recommendation", label: "Other / Need Recommendation" },
];

const RECOMMEND_MATERIALS = [
  { id: "Standard Workshop Recommendation", label: "Standard Workshop Recommendation (Most economical)" },
  { id: "High Strength / Engineering Grade", label: "High Strength / Engineering Grade" },
  { id: "Highest Aesthetic Detail", label: "Highest Aesthetic Detail" },
  { id: "Other / Need Recommendation", label: "Other / Need Recommendation" },
];

const COLOR_OPTIONS: PrintingColor[] = [
  "White",
  "Black",
  "Grey",
  "Custom Color",
  "Multiple Colors",
  "Not Sure",
];

const FINISH_OPTIONS: SurfaceFinish[] = [
  "Standard Finish",
  "Smooth Finish",
  "High Detail Finish",
  "Custom Requirement",
];

export function StepRequirements({ requirements, onChange }: StepRequirementsProps) {
  const updateReq = <K extends keyof PrintingRequirements>(
    key: K,
    value: PrintingRequirements[K]
  ) => {
    onChange({
      ...requirements,
      [key]: value,
    });
  };

  const handleTechnologyChange = (tech: PrintTechnology) => {
    let defaultMaterial = "Standard Workshop Recommendation";
    if (tech === "resin") defaultMaterial = "Standard Resin";
    if (tech === "fdm") defaultMaterial = "PLA / PLA+";

    onChange({
      ...requirements,
      technology: tech,
      material: defaultMaterial,
    });
  };

  const materialOptions =
    requirements.technology === "resin"
      ? RESIN_MATERIALS
      : requirements.technology === "fdm"
      ? FDM_MATERIALS
      : RECOMMEND_MATERIALS;

  const showCustomColorInput =
    requirements.color === "Custom Color" || requirements.color === "Multiple Colors";

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Printing Technology */}
      <section aria-labelledby="tech-heading" className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[var(--primary)]" />
          <h3 id="tech-heading" className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            1. Printing Technology
          </h3>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          Choose the printing method that fits your project, or let us inspect your file and recommend one.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {TECHNOLOGIES.map((tech) => (
            <label
              key={tech.id}
              className={`flex flex-col p-4 rounded-xl border transition-all cursor-pointer select-none ${
                requirements.technology === tech.id
                  ? "border-[var(--primary)] bg-blue-50/40 ring-1 ring-[var(--primary)] shadow-xs"
                  : "border-[var(--border)] bg-white hover:border-stone-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  type="radio"
                  name="technology"
                  value={tech.id}
                  checked={requirements.technology === tech.id}
                  onChange={() => handleTechnologyChange(tech.id)}
                  className="h-4 w-4 text-[var(--primary)] border-[var(--border)] focus:ring-[var(--primary)]"
                />
                {tech.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-[var(--foreground)] border border-stone-200">
                    {tech.badge}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-[var(--foreground)] leading-tight">
                {tech.name}
              </span>
              <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
                {tech.desc}
              </p>
              <div className="mt-auto pt-3 border-t border-stone-100 text-[11px] text-[var(--primary)] font-medium">
                Best for: {tech.bestFor}
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* 2. Material Selection */}
      <section aria-labelledby="material-heading" className="flex flex-col gap-3 pt-6 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[var(--primary)]" />
          <h3 id="material-heading" className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            2. Material Selection
          </h3>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          Material availability and exact stock colors are confirmed during quotation preparation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {materialOptions.map((mat) => (
            <label
              key={mat.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                requirements.material === mat.id
                  ? "border-[var(--primary)] bg-blue-50/40 font-semibold text-[var(--foreground)]"
                  : "border-[var(--border)] bg-white hover:bg-stone-50 text-[var(--foreground)]"
              }`}
            >
              <input
                type="radio"
                name="material"
                value={mat.id}
                checked={requirements.material === mat.id}
                onChange={() => updateReq("material", mat.id)}
                className="h-4 w-4 text-[var(--primary)] border-[var(--border)]"
              />
              <span>{mat.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 3. Color & Surface Finish (2 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[var(--border)]">
        {/* Color */}
        <section aria-labelledby="color-heading" className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-[var(--primary)]" />
            <h3 id="color-heading" className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
              3. Color
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_OPTIONS.map((c) => (
              <label
                key={c}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  requirements.color === c
                    ? "border-[var(--primary)] bg-blue-50/40 font-bold text-[var(--foreground)]"
                    : "border-[var(--border)] bg-white hover:bg-stone-50 text-[var(--foreground)]"
                }`}
              >
                <input
                  type="radio"
                  name="color"
                  value={c}
                  checked={requirements.color === c}
                  onChange={() => updateReq("color", c)}
                  className="h-3.5 w-3.5 text-[var(--primary)]"
                />
                <span>{c}</span>
              </label>
            ))}
          </div>

          {showCustomColorInput && (
            <div className="mt-1 flex flex-col gap-1.5 animate-in fade-in">
              <label htmlFor="custom-color-details" className="text-xs font-semibold text-[var(--foreground)]">
                Specify color requirements:
              </label>
              <input
                id="custom-color-details"
                type="text"
                value={requirements.customColorDetails || ""}
                onChange={(e) => updateReq("customColorDetails", e.target.value)}
                placeholder="e.g. Matte Olive Green, Pantone 286C, Dual-tone accent"
                className="px-3.5 py-2 text-xs rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          )}
        </section>

        {/* Surface Finish */}
        <section aria-labelledby="finish-heading" className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <h3 id="finish-heading" className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
              4. Surface Finish
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {FINISH_OPTIONS.map((f) => (
              <label
                key={f}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  requirements.surfaceFinish === f
                    ? "border-[var(--primary)] bg-blue-50/40 font-bold text-[var(--foreground)]"
                    : "border-[var(--border)] bg-white hover:bg-stone-50 text-[var(--foreground)]"
                }`}
              >
                <input
                  type="radio"
                  name="surfaceFinish"
                  value={f}
                  checked={requirements.surfaceFinish === f}
                  onChange={() => updateReq("surfaceFinish", f)}
                  className="h-3.5 w-3.5 text-[var(--primary)]"
                />
                <span>{f}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* 4. Model Dimensions */}
      <section aria-labelledby="dimensions-heading" className="flex flex-col gap-3 pt-6 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-[var(--primary)]" />
            <h3 id="dimensions-heading" className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
              5. Model Dimensions
            </h3>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={requirements.dimensions.useOriginal}
              onChange={(e) =>
                updateReq("dimensions", {
                  ...requirements.dimensions,
                  useOriginal: e.target.checked,
                })
              }
              className="h-4 w-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)]"
            />
            <span>Use original model dimensions</span>
          </label>
        </div>

        {requirements.dimensions.useOriginal ? (
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-[var(--muted-foreground)] flex items-start gap-2">
            <Info className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" />
            <p>
              We will print your model using the exact scale and geometry defined in your uploaded 3D file. No resizing will occur.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-[var(--border)] bg-stone-50/60 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--foreground)]">
                Specify Custom Target Dimensions
              </span>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[var(--muted-foreground)]">Unit:</span>
                {(["mm", "cm", "inches"] as DimensionsUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() =>
                      updateReq("dimensions", {
                        ...requirements.dimensions,
                        unit: u,
                      })
                    }
                    className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      requirements.dimensions.unit === u
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white text-[var(--foreground)] border border-[var(--border)]"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                  Width (X)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={requirements.dimensions.width || ""}
                  onChange={(e) =>
                    updateReq("dimensions", {
                      ...requirements.dimensions,
                      width: parseFloat(e.target.value) || undefined,
                    })
                  }
                  placeholder={`e.g. 80`}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                  Height (Y)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={requirements.dimensions.height || ""}
                  onChange={(e) =>
                    updateReq("dimensions", {
                      ...requirements.dimensions,
                      height: parseFloat(e.target.value) || undefined,
                    })
                  }
                  placeholder={`e.g. 120`}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                  Depth (Z)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={requirements.dimensions.depth || ""}
                  onChange={(e) =>
                    updateReq("dimensions", {
                      ...requirements.dimensions,
                      depth: parseFloat(e.target.value) || undefined,
                    })
                  }
                  placeholder={`e.g. 50`}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)]"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Quantity & Bulk Orders */}
      <section aria-labelledby="quantity-heading" className="flex flex-col gap-3 pt-6 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-[var(--primary)]" />
          <h3 id="quantity-heading" className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            6. Quantity
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center rounded-xl border border-[var(--border)] bg-white h-11">
            <button
              type="button"
              onClick={() => updateReq("quantity", Math.max(1, requirements.quantity - 1))}
              disabled={requirements.quantity <= 1}
              aria-label="Decrease quantity"
              className="px-4 h-full text-base font-bold text-[var(--foreground)] hover:bg-[var(--accent)] disabled:opacity-40 rounded-l-xl transition-colors cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="500"
              value={requirements.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) updateReq("quantity", Math.min(500, val));
              }}
              className="w-16 text-center font-bold text-sm text-[var(--foreground)] border-none focus:outline-none"
            />
            <button
              type="button"
              onClick={() => updateReq("quantity", Math.min(500, requirements.quantity + 1))}
              disabled={requirements.quantity >= 500}
              aria-label="Increase quantity"
              className="px-4 h-full text-base font-bold text-[var(--foreground)] hover:bg-[var(--accent)] rounded-r-xl transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          {requirements.quantity >= 20 ? (
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
              🎉 Bulk batch discount applies to this quotation request!
            </span>
          ) : (
            <span className="text-xs text-[var(--muted-foreground)]">
              Ordering 20 or more units qualifies for volume batch pricing.
            </span>
          )}
        </div>
      </section>

      {/* 6. Additional Requirements */}
      <section aria-labelledby="notes-heading" className="flex flex-col gap-2.5 pt-6 border-t border-[var(--border)]">
        <label htmlFor="additional-requirements" className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
          7. Additional Printing Requirements (Optional)
        </label>
        <p className="text-xs text-[var(--muted-foreground)]">
          Describe any special considerations: mechanical infill percentage, brass threaded inserts, post-processing sanding, tight dimensional tolerances, or target delivery deadlines.
        </p>
        <textarea
          id="additional-requirements"
          rows={3}
          value={requirements.additionalNotes || ""}
          onChange={(e) => updateReq("additionalNotes", e.target.value)}
          placeholder="e.g. Needs high impact strength for outdoor mounting, prefer matte primer finish, need delivery by next Friday."
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-y"
        />
      </section>
    </div>
  );
}
