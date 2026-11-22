"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { authService, AdminRole } from "@/services/auth-service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<AdminRole>("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid technician / administrator email address.");
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.loginDevelopment(email, selectedRole);
      router.push("/admin");
    } catch {
      setErrorMessage("Authentication failed. Please verify your credentials and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[var(--border)] shadow-lg p-8 flex flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base shadow-sm">
            NL
          </div>
          <h1 className="text-xl font-extrabold text-[var(--foreground)] tracking-tight">
            NewtronLabs Operations Sign-In
          </h1>
          <span className="text-xs text-[var(--muted-foreground)]">
            Workshop Management & Logistics Portal
          </span>
        </div>

        {/* Development Environment Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <strong>Development Environment:</strong> Authentication provider boundary active. Enter your authorized workshop credentials and select an RBAC role to initialize an authenticated development session.
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-xs text-[var(--color-danger)]">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Administrator / Staff Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. staff@newtronlabs.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50 font-medium text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Passcode / Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your authorization passcode"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50 font-medium text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Role Delegation (RBAC)</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50 font-medium text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              <option value="owner">Workshop Owner (Full System & Pricing Controls)</option>
              <option value="admin">Administrator (Orders, Catalog, Tracking)</option>
              <option value="operator">Production Operator (Printer Bed Queue & Slicing)</option>
              <option value="viewer">Viewer (Read-Only Analytics)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-xs hover:bg-[var(--primary-hover)] transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Session...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Return to Storefront</span>
          </Link>
          <span className="font-mono text-[10px]">RBAC v1.0</span>
        </div>
      </div>
    </div>
  );
}
