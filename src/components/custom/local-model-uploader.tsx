"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileUp,
  Box,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  HardDrive,
  Info,
} from "lucide-react";
import {
  StoredModelRecord,
  getAllStoredModels,
  storeModelFile,
  deleteStoredModel,
  clearAllStoredModels,
  validateModelFile,
  SUPPORTED_EXTENSIONS,
} from "@/lib/storage/model-storage";

export function LocalModelUploader() {
  const [models, setModels] = useState<StoredModelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stored models on mount
  const loadModels = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllStoredModels();
      setModels(data);
    } catch (err) {
      console.error("Failed to load models from IndexedDB:", err);
      setErrorMessage("Could not load locally saved files from your browser storage.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // Handle incoming files (drag-and-drop or file input)
  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsProcessing(true);

    const errors: string[] = [];
    let savedCount = 0;
    const currentModels = [...models];

    for (const file of fileArray) {
      const validation = validateModelFile(file, currentModels);
      if (!validation.valid) {
        errors.push(validation.error || `File ${file.name} is invalid.`);
        continue;
      }

      try {
        const saved = await storeModelFile(file);
        currentModels.unshift(saved);
        savedCount++;
      } catch (err) {
        console.error("IndexedDB store error:", err);
        errors.push(`Failed to save "${file.name}" to browser storage.`);
      }
    }

    setModels(currentModels);
    setIsProcessing(false);

    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
    }

    if (savedCount > 0) {
      setSuccessMessage(
        savedCount === 1
          ? `Saved "${fileArray[0].name}" locally in your browser.`
          : `Saved ${savedCount} files locally in your browser.`
      );
    }

    // Reset file input value so re-selecting the same file later triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving the container itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteStoredModel(id);
      setModels((prev) => prev.filter((m) => m.id !== id));
      setSuccessMessage(`Removed "${name}" from local storage.`);
    } catch (err) {
      console.error("Failed to delete model:", err);
      setErrorMessage(`Failed to remove "${name}" from storage.`);
    }
  };

  const handleClearAll = async () => {
    if (models.length === 0) return;
    try {
      await clearAllStoredModels();
      setModels([]);
      setSuccessMessage("Removed all locally stored models.");
    } catch (err) {
      console.error("Failed to clear models:", err);
      setErrorMessage("Failed to clear local storage.");
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Upload Zone Card */}
      <div
        className={`flex flex-col gap-5 rounded-2xl border-2 transition-all p-6 sm:p-7 ${
          isDragging
            ? "border-[var(--primary)] bg-[var(--muted)] ring-4 ring-[var(--muted)]"
            : "border-[var(--primary)] bg-[var(--accent)]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm">
            <FileUp className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-[var(--primary)] border border-[var(--border)]">
            <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
            IndexedDB Prototype
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
            Upload your 3D model
          </h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)] leading-relaxed">
            Drag & drop files here or browse your device. Files stay private on your computer.
          </p>
        </div>

        {/* Accepted Formats Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-medium text-[var(--muted-foreground)] mr-1">
            Accepted formats:
          </span>
          {SUPPORTED_EXTENSIONS.map((ext) => (
            <span
              key={ext}
              className="px-2 py-0.5 rounded text-xs font-semibold bg-white text-[var(--foreground)] border border-[var(--border)] uppercase"
            >
              {ext.replace(".", "")}
            </span>
          ))}
          <span className="text-xs text-[var(--muted-foreground)] ml-1">
            (up to 50 MB)
          </span>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".stl,.obj,.3mf,.glb,.gltf"
          onChange={handleFileInputChange}
          className="sr-only"
          id="model-file-input"
          aria-label="Upload 3D model files"
        />

        {/* Actions Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={triggerBrowse}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 min-h-[44px] transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving to browser...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4" aria-hidden="true" />
                Select 3D Files
              </>
            )}
          </button>

          <span className="text-xs text-[var(--muted-foreground)] text-center sm:text-left">
            Multiple files supported
          </span>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-2 rounded-lg bg-white/70 border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
          <Info className="h-4 w-4 shrink-0 text-[var(--primary)] mt-0.5" aria-hidden="true" />
          <span>
            <strong>Local privacy notice:</strong> Your files are stored locally in this browser for preview and testing. They are not uploaded to our servers.
          </span>
        </div>
      </div>

      {/* Status Messages */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-semibold text-red-700 hover:text-red-900 underline shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" aria-hidden="true" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-semibold text-green-700 hover:text-green-900 underline shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stored Models Section */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-[var(--foreground)]">
              Saved 3D Models
            </h4>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--muted)] text-[var(--primary)]">
              {models.length}
            </span>
          </div>

          {models.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer py-1 px-2 rounded hover:bg-red-50"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-[var(--muted-foreground)] gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" aria-hidden="true" />
            <span>Loading stored models from IndexedDB...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && models.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)] text-[var(--muted-foreground)] mb-3">
              <Box className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              No 3D models uploaded yet
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm">
              Drag & drop .stl, .obj, .3mf, .glb, or .gltf files into the upload box above to store and test them in your browser.
            </p>
          </div>
        )}

        {/* File List */}
        {!isLoading && models.length > 0 && (
          <ul className="flex flex-col divide-y divide-[var(--border)]" aria-label="List of locally stored 3D models">
            {models.map((model) => (
              <li
                key={model.id}
                className="flex items-center justify-between py-3.5 gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary)] font-bold text-xs uppercase border border-[var(--border)]">
                    {model.extension.replace(".", "") || "3D"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p
                      className="text-sm font-semibold text-[var(--foreground)] truncate"
                      title={model.name}
                    >
                      {model.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-0.5">
                      <span>{model.formattedSize}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        Stored in browser
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        {new Date(model.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(model.id, model.name)}
                  aria-label={`Delete ${model.name}`}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-md text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
