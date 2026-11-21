"use client";

import React from "react";
import { UploadedModelMetadata, ReferenceImageMetadata } from "@/types/custom-print";
import { CustomModelPreview } from "@/components/custom/custom-model-preview";
import { ModelFileUploader } from "@/components/custom/model-file-uploader";

interface StepUploadProps {
  modelFile: UploadedModelMetadata | null;
  onModelChange: (model: UploadedModelMetadata | null) => void;
  referenceImages: ReferenceImageMetadata[];
  onReferenceImagesChange: (images: ReferenceImageMetadata[]) => void;
}

export function StepUpload({
  modelFile,
  onModelChange,
  referenceImages,
  onReferenceImagesChange,
}: StepUploadProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Desktop two-column layout: 3D Preview on left, Upload controls on right; Mobile: stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Model Preview Viewport (5 cols) */}
        <div className="lg:col-span-5 w-full">
          <CustomModelPreview modelFile={modelFile} />
        </div>

        {/* Right Column: Model File Uploader & Specs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-[var(--foreground)]">
              Upload Your 3D Model
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Select or drag-and-drop your 3D design. We support industry standard mesh and CAD interchange formats.
            </p>
          </div>

          <ModelFileUploader
            modelFile={modelFile}
            onModelChange={onModelChange}
            referenceImages={referenceImages}
            onReferenceImagesChange={onReferenceImagesChange}
          />
        </div>
      </div>
    </div>
  );
}
