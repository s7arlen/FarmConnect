"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Leaf, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        const err = data.error || "Unable to send reset link. Please check your email.";
        setErrorMessage(err);
        toast.error(err);
        return;
      }

      setSubmitted(true);
      toast.success("Password reset instructions sent!");
    } catch {
      const err = "Network connection error. Please try again.";
      setErrorMessage(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F6EC] text-[#202A20] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#DCE5D5] shadow-xl p-6 sm:p-8 relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#DCE5D5]/60">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-[#53832F] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>

          <Link href="/" className="inline-flex items-center gap-1.5">
            <div className="w-6 h-6 bg-[#53832F] rounded-lg flex items-center justify-center shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-sm text-[#202A20]">FarmConnect</span>
          </Link>
        </div>

        {submitted ? (
          /* SUCCESS STATE */
          <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto text-[#53832F]">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#202A20] tracking-tight">
                Check your inbox
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
                We have sent password reset instructions to: <br />
                <strong className="text-[#202A20] font-bold">{email}</strong>
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Link
                href="/login"
                className="w-full h-12 rounded-2xl bg-[#53832F] hover:bg-[#436E23] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Return to Login</span>
              </Link>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-brand-muted hover:text-[#202A20] underline transition-colors"
              >
                Try another email
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A20] tracking-tight">
                Forgot your password?
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1.5 leading-relaxed font-medium">
                Enter your registered email address and we&apos;ll help you reset your password.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 animate-in fade-in duration-150">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-bold text-[#202A20] mb-1.5"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none">
                    <Mail className="w-4 h-4 text-brand-muted" />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="e.g. farmer@demo.com"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-[#DCE5D5] text-xs sm:text-sm text-[#202A20] placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-[#53832F]/30 focus:border-[#53832F] transition-all shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-12 rounded-2xl bg-[#53832F] hover:bg-[#436E23] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#DCE5D5]/60 text-center">
              <p className="text-xs text-brand-muted">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#53832F] hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
