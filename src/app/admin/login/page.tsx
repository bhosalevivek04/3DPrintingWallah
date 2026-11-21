"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Lock, ShieldAlert, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("workshop@newtronlabs.in");
  const [password, setPassword] = useState("••••••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/admin");
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[var(--border)] shadow-xl p-8 flex flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base shadow-sm">
            NL
          </div>
          <h1 className="text-xl font-extrabold text-[var(--foreground)] tracking-tight">
            NewtronLabs Workshop Sign-In
          </h1>
          <span className="text-xs text-[var(--muted-foreground)]">
            Internal Operations Portal Demonstration
          </span>
        </div>

        {/* Prototype Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <strong>Frontend Demonstration:</strong> No real backend authentication check is enforced here.
            Production will integrate NextAuth / OAuth with encrypted HTTP-only session cookies and role-based permissions.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Technician / Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50 font-medium text-xs focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Passcode / Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-stone-50 font-medium text-xs focus:bg-white focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-xs hover:bg-[var(--primary-hover)] transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{isSubmitting ? "Opening Portal..." : "Enter Workshop Dashboard"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[var(--border)] text-center text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-[var(--primary)] font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
