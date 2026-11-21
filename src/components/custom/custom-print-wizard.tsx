"use client";

import React, { useState, useEffect } from "react";
import {
  UploadedModelMetadata,
  ReferenceImageMetadata,
  PrintingRequirements,
  CustomerInfo,
  CustomPrintRequest,
  SubmissionResponse,
} from "@/types/custom-print";
import {
  DEFAULT_REQUIREMENTS,
  DEFAULT_CUSTOMER,
  saveDraftToStorage,
  loadDraftFromStorage,
  clearDraftFromStorage,
} from "@/lib/storage/custom-print-storage";
import { StepUpload } from "@/components/custom/step-upload";
import { StepRequirements } from "@/components/custom/step-requirements";
import { StepCustomer } from "@/components/custom/step-customer";
import { RequestSummary } from "@/components/custom/request-summary";
import { SubmissionConfirmation } from "@/components/custom/submission-confirmation";
import {
  FileUp,
  Sliders,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Save,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Upload Model", icon: FileUp },
  { id: 2, label: "Printing Requirements", icon: Sliders },
  { id: 3, label: "Contact Details", icon: UserCheck },
  { id: 4, label: "Review & Submit", icon: CheckCircle2 },
];

export function CustomPrintWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [modelFile, setModelFile] = useState<UploadedModelMetadata | null>(null);
  const [referenceImages, setReferenceImages] = useState<ReferenceImageMetadata[]>([]);
  const [requirements, setRequirements] = useState<PrintingRequirements>(DEFAULT_REQUIREMENTS);
  const [customer, setCustomer] = useState<CustomerInfo>(DEFAULT_CUSTOMER);

  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({});
  const [stepWarning, setStepWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<CustomPrintRequest | null>(null);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Restore draft from localStorage on mount if available
  useEffect(() => {
    const draft = loadDraftFromStorage();
    if (draft) {
      if (draft.modelFile) setModelFile(draft.modelFile);
      if (draft.requirements) setRequirements(draft.requirements);
      if (draft.customer) setCustomer(draft.customer);
      if (draft.activeStep && draft.activeStep >= 1 && draft.activeStep <= 4) {
        // If they had a file, restore their step
        if (draft.modelFile) setCurrentStep(draft.activeStep);
      }
    }
  }, []);

  // Auto-save draft changes
  useEffect(() => {
    if (submittedRequest) return;
    saveDraftToStorage({
      modelFile,
      requirements,
      customer,
      activeStep: currentStep,
    });
  }, [modelFile, requirements, customer, currentStep, submittedRequest]);

  // Validation before step transition
  const validateStep = (step: number): boolean => {
    setStepWarning(null);

    if (step === 1) {
      if (!modelFile) {
        setStepWarning("Please select or upload a 3D model file (.stl, .obj, .3mf, .glb, .gltf) before proceeding.");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!requirements.technology) {
        setStepWarning("Please select a printing technology option.");
        return false;
      }
      return true;
    }

    if (step === 3) {
      const errors: Record<string, string> = {};
      if (!customer.fullName || customer.fullName.trim().length < 2) {
        errors.fullName = "Please enter your full name.";
      }
      if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
        errors.email = "Please enter a valid email address.";
      }
      const cleanPhone = customer.phone.replace(/[\s\-\(\)\+]/g, "");
      if (!customer.phone || cleanPhone.length < 10) {
        errors.phone = "Please enter a valid phone number (minimum 10 digits).";
      }
      if (!customer.consentGiven) {
        errors.consentGiven = "You must agree to the quotation contact consent.";
      }

      setCustomerErrors(errors);
      if (Object.keys(errors).length > 0) {
        setStepWarning("Please correct the highlighted contact information errors.");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStepWarning(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleJumpToStep = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 180, behavior: "smooth" });
    } else if (validateStep(currentStep)) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const handleSaveDraft = () => {
    saveDraftToStorage({
      modelFile,
      requirements,
      customer,
      activeStep: currentStep,
    });
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 4000);
  };

  // Submit quotation request to API
  const handleSubmitRequest = async () => {
    if (!modelFile) {
      setSubmissionError("A 3D model file is required to submit a request.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch("/api/custom-print-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelFile: {
            id: modelFile.id,
            name: modelFile.name,
            size: modelFile.size,
            formattedSize: modelFile.formattedSize,
            extension: modelFile.extension,
            mimeType: modelFile.mimeType,
            uploadedAt: modelFile.uploadedAt,
          },
          referenceImages: referenceImages.map((img) => ({
            id: img.id,
            name: img.name,
            size: img.size,
            formattedSize: img.formattedSize,
          })),
          requirements,
          customer,
        }),
      });

      const data = (await response.json()) as SubmissionResponse;

      if (!response.ok || !data.success || !data.request) {
        throw new Error(data.message || "Failed to submit request.");
      }

      setSubmittedRequest(data.request);
      clearDraftFromStorage();
      setCurrentStep(5); // Success step
      window.scrollTo({ top: 180, behavior: "smooth" });
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmissionError(
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setModelFile(null);
    setReferenceImages([]);
    setRequirements(DEFAULT_REQUIREMENTS);
    setCustomer(DEFAULT_CUSTOMER);
    setSubmittedRequest(null);
    setCustomerErrors({});
    setStepWarning(null);
    setSubmissionError(null);
    clearDraftFromStorage();
    setCurrentStep(1);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Guided Progress Stepper (Only shown during steps 1-4) */}
      {currentStep <= 4 && (
        <nav aria-label="Custom printing steps progress" className="w-full">
          <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.id;
              const isPassed = currentStep > s.id;

              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(s.id)}
                    aria-current={isActive ? "step" : undefined}
                    className={`w-full flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? "border-[var(--primary)] bg-blue-50/70 text-[var(--primary)] shadow-2xs"
                        : isPassed
                        ? "border-emerald-200 bg-emerald-50/50 text-emerald-900 hover:bg-emerald-50"
                        : "border-[var(--border)] bg-white text-[var(--muted-foreground)] opacity-70"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isActive
                          ? "bg-[var(--primary)] text-white"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] uppercase font-bold tracking-wider opacity-70 truncate">
                        Step {s.id}
                      </span>
                      <span className="block text-xs font-bold truncate">
                        {s.label}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Warning Alert Banner */}
      {stepWarning && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 animate-in fade-in"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold">Notice: </strong>
            <span>{stepWarning}</span>
          </div>
        </div>
      )}

      {/* Step Panels */}
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 shadow-xs">
        {currentStep === 1 && (
          <StepUpload
            modelFile={modelFile}
            onModelChange={setModelFile}
            referenceImages={referenceImages}
            onReferenceImagesChange={setReferenceImages}
          />
        )}

        {currentStep === 2 && (
          <StepRequirements
            requirements={requirements}
            onChange={setRequirements}
          />
        )}

        {currentStep === 3 && (
          <StepCustomer
            customer={customer}
            onChange={setCustomer}
            errors={customerErrors}
          />
        )}

        {currentStep === 4 && modelFile && (
          <RequestSummary
            modelFile={modelFile}
            referenceImages={referenceImages}
            requirements={requirements}
            customer={customer}
            onEditStep={handleJumpToStep}
            onSubmit={handleSubmitRequest}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
            draftSavedToast={draftSavedToast}
          />
        )}

        {currentStep === 5 && submittedRequest && (
          <SubmissionConfirmation
            request={submittedRequest}
            onReset={handleReset}
          />
        )}

        {/* Wizard Footer Navigation Controls (Steps 1, 2, 3) */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-[var(--border)] gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-[var(--border)] bg-white hover:bg-stone-50 text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div /> // Spacer
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] text-xs font-bold transition-all shadow-sm cursor-pointer ml-auto"
            >
              <span>{currentStep === 3 ? "Review Request" : "Next Step"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
