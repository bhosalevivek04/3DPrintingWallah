"use client";

import React, { useState, useRef } from "react";
import {
  FileUp,
  Box,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  HardDrive,
  Info,
} from "lucide-react";
import {
  UploadedModelMetadata,
  ReferenceImageMetadata,
  SUPPORTED_3D_EXTENSIONS,
  MAX_MODEL_FILE_SIZE_BYTES,
  MAX_REFERENCE_IMAGE_SIZE_BYTES,
} from "@/types/custom-print";
import {
  storeModelFile,
  formatBytes,
  getFileExtension,
  isExtensionSupported,
} from "@/lib/storage/model-storage";

interface ModelFileUploaderProps {
  modelFile: UploadedModelMetadata | null;
  onModelChange: (model: UploadedModelMetadata | null) => void;
  referenceImages: ReferenceImageMetadata[];
  onReferenceImagesChange: (images: ReferenceImageMetadata[]) => void;
}

export function ModelFileUploader({
  modelFile,
  onModelChange,
  referenceImages,
  onReferenceImagesChange,
}: ModelFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modelInputRef = useRef<HTMLInputElement>(null);
  const refImageInputRef = useRef<HTMLInputElement>(null);

  // Validate and handle incoming 3D file
  const handleModelFile = async (file: File) => {
    setErrorMessage(null);

    // 1. Empty file
    if (file.size === 0) {
      setErrorMessage(`"${file.name}" is an empty file (0 bytes). Please upload a valid 3D model.`);
      return;
    }

    // 2. Extension check
    const ext = getFileExtension(file.name);
    if (!isExtensionSupported(file.name)) {
      setErrorMessage(
        `"${file.name}" has an unsupported format (${ext || "no extension"}). Supported formats: ${SUPPORTED_3D_EXTENSIONS.join(
          ", "
        )}.`
      );
      return;
    }

    // 3. Size limit check
    if (file.size > MAX_MODEL_FILE_SIZE_BYTES) {
      setErrorMessage(
        `"${file.name}" (${formatBytes(file.size)}) exceeds the maximum allowed limit of 50 MB.`
      );
      return;
    }

    try {
      setIsProcessing(true);
      // Store in IndexedDB for reliable client-side caching & instant reload
      const stored = await storeModelFile(file);

      const metadata: UploadedModelMetadata = {
        id: stored.id,
        name: stored.name,
        size: stored.size,
        formattedSize: stored.formattedSize,
        extension: stored.extension,
        mimeType: stored.mimeType,
        uploadedAt: stored.createdAt,
        blob: stored.blob,
      };

      onModelChange(metadata);
    } catch (err) {
      console.error("Storage error:", err);
      setErrorMessage(`Failed to save "${file.name}" to browser storage. Please try again.`);
    } finally {
      setIsProcessing(false);
      if (modelInputRef.current) {
        modelInputRef.current.value = "";
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleModelFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleModelFile(e.target.files[0]);
    }
  };

  // Reference images handler (optional photos/finish samples)
  const handleRefImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const newImages: ReferenceImageMetadata[] = [...referenceImages];

    for (const f of files) {
      if (newImages.length >= 3) {
        setErrorMessage("You can upload a maximum of 3 reference images.");
        break;
      }
      if (f.size > MAX_REFERENCE_IMAGE_SIZE_BYTES) {
        setErrorMessage(`Image "${f.name}" exceeds 10 MB limit.`);
        continue;
      }
      if (!f.type.startsWith("image/")) {
        setErrorMessage(`"${f.name}" is not a valid image format.`);
        continue;
      }

      newImages.push({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size,
        formattedSize: formatBytes(f.size),
        dataUrl: URL.createObjectURL(f),
      });
    }

    onReferenceImagesChange(newImages);
    if (refImageInputRef.current) refImageInputRef.current.value = "";
  };

  const handleRemoveRefImage = (id: string) => {
    onReferenceImagesChange(referenceImages.filter((img) => img.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden file inputs */}
      <input
        ref={modelInputRef}
        type="file"
        accept=".stl,.obj,.3mf,.glb,.gltf"
        onChange={handleFileInputChange}
        className="sr-only"
        aria-label="Upload 3D model file"
      />
      <input
        ref={refImageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={handleRefImageChange}
        className="sr-only"
        aria-label="Upload reference images"
      />

      {/* Main 3D Model Upload Area or Selected File Card */}
      {!modelFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && modelInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              modelInputRef.current?.click();
            }
          }}
          className={`relative flex flex-col items-center justify-center p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center outline-none ${
            isDragging
              ? "border-[var(--primary)] bg-blue-50/50 scale-[1.01]"
              : "border-stone-300 bg-stone-50/60 hover:border-[var(--primary)] hover:bg-stone-50"
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Validating and reading 3D model...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-stone-200 shadow-xs text-[var(--primary)] mb-4">
                <FileUp className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Drag and drop your 3D model here, or{" "}
                <span className="text-[var(--primary)] underline underline-offset-2">browse</span>
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-2 max-w-md">
                Upload your 3D model in STL, OBJ, 3MF, GLB or GLTF format. Maximum file size: 50 MB.
              </p>

              {/* Supported format badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                {SUPPORTED_3D_EXTENSIONS.map((ext) => (
                  <span
                    key={ext}
                    className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 text-[11px] font-mono font-medium shadow-2xs"
                  >
                    {ext.replace(".", "").toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Selected Model Card */
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Box className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[var(--foreground)] truncate max-w-xs sm:max-w-md">
                  {modelFile.name}
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-stone-100 text-stone-800 border border-stone-200 shrink-0">
                  {modelFile.extension.replace(".", "")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-1">
                <span>{modelFile.formattedSize}</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Validated
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
            <button
              type="button"
              onClick={() => modelInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-stone-600" />
              <span>Replace File</span>
            </button>
            <button
              type="button"
              onClick={() => onModelChange(null)}
              aria-label="Remove model"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 animate-in fade-in"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold">Upload notice: </strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Optional Reference Images Section */}
      <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Reference Images (Optional)
            </span>
          </div>
          {referenceImages.length < 3 && (
            <button
              type="button"
              onClick={() => refImageInputRef.current?.click()}
              className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
            >
              + Add photos ({referenceImages.length}/3)
            </button>
          )}
        </div>

        <p className="text-xs text-[var(--muted-foreground)]">
          Have an inspiration photo, color sample, or assembly sketch? Attach up to 3 images (PNG, JPG, WebP up to 10 MB).
        </p>

        {referenceImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {referenceImages.map((img) => (
              <div
                key={img.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-stone-200 text-xs"
              >
                <span className="truncate text-stone-700 max-w-[140px] font-medium">
                  {img.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveRefImage(img.id)}
                  aria-label={`Remove reference image ${img.name}`}
                  className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start gap-2 text-xs text-[var(--muted-foreground)] bg-stone-50 p-3 rounded-xl border border-stone-200">
        <Info className="h-4 w-4 shrink-0 text-stone-400 mt-0.5" />
        <p>
          Your model is processed and cached locally in this browser. Customer files are strictly protected and never shared with unauthorized third parties.
        </p>
      </div>
    </div>
  );
}
