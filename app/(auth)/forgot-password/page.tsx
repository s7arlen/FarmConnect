"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Mail, Leaf, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen min-h-[100dvh] bg-[#F2F6EC] text-[#202A20] flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden selection:bg-[#53832F] selection:text-white">
      
      {/* =========================================================================
          DESKTOP LEFT SIDEBAR: Agricultural Landscape Hero (Visible on lg+)
      ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E2E1E] text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lush-crops-sunrise.jpg"
            alt="Lush green organic farmland crops at sunrise"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#192A19]/95 via-[#192A19]/80 to-transparent" />
        </div>

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-[#53832F] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-sm">
              FarmConnect
            </span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>
        </div>

        {/* Hero Narrative */}
        <div className="relative z-10 max-w-lg mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53832F]/30 text-[#D6F0C7] text-xs font-bold uppercase tracking-wider mb-4 border border-[#53832F]/40 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D6F0C7]" />
            <span>Account Security</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-md">
            Reset your password.
          </h2>

          <p className="text-base text-white/90 leading-relaxed drop-shadow-xs font-medium">
            Enter your registered email address and we&apos;ll send you secure instructions to recover your account.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} FarmConnect. Supporting agricultural communities across Karnataka.
        </div>
      </div>

      {/* =========================================================================
          RIGHT FORM CONTAINER
      ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between lg:h-screen lg:overflow-y-auto">
        
        {/* Mobile Upper Hero */}
        <div className="lg:hidden relative h-[30vh] min-h-[220px] max-h-[280px] w-full flex flex-col justify-between p-5 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/lush-crops-sunrise.jpg"
              alt="Lush green organic farmland crops at sunrise"
              fill
              priority
              className="object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />
          </div>

          {/* Mobile Top Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#53832F] rounded-xl flex items-center justify-center shadow-xs">
                <Leaf className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white drop-shadow-sm">
                FarmConnect
              </span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-bold text-white px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-xs border border-white/20 hover:bg-black/40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          </div>

          <div className="relative z-10 mb-2">
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              Reset Password
            </h1>
            <p className="text-xs text-white/95 font-medium leading-relaxed max-w-[280px] mt-1 drop-shadow-xs">
              Recover access to your local farm marketplace.
            </p>
          </div>
        </div>

        {/* Organic Wave Divider on Mobile */}
        <div className="lg:hidden relative w-full overflow-hidden leading-none z-10 -mt-5">
          <svg
            viewBox="0 0 500 40"
            preserveAspectRatio="none"
            className="w-full h-7 text-[#F2F6EC] fill-current"
          >
            <path d="M0,20 C140,42 340,0 500,24 L500,40 L0,40 Z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 sm:px-8 lg:px-16 py-8 max-w-lg mx-auto w-full flex flex-col justify-center">
          
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-black text-[#202A20] tracking-tight">
              Forgot your password?
            </h1>
            <p className="text-sm text-brand-muted mt-1 font-medium">
              Enter your email and we&apos;ll send reset instructions.
            </p>
          </div>

          {submitted ? (
            /* SUCCESS STATE */
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto text-[#53832F] shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#202A20] tracking-tight">
                  Check your inbox
                </h2>
                <p className="text-sm text-brand-muted mt-2 leading-relaxed max-w-sm mx-auto">
                  We have sent password reset instructions to: <br />
                  <strong className="text-[#202A20] font-bold">{email}</strong>
                </p>
              </div>

              <div className="pt-6 space-y-3">
                <Link
                  href="/login"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#53832F] to-[#406E23] hover:from-[#487428] hover:to-[#38621E] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Return to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="text-xs font-semibold text-brand-muted hover:text-[#202A20] transition-colors py-1 cursor-pointer"
                >
                  Try another email address
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium animate-in fade-in duration-200 flex items-start gap-2.5">
                  <span className="text-base leading-none">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#202A20] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className={cn(
                      "w-full h-12 pl-10 pr-4 rounded-xl bg-white border text-sm text-[#202A20] placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-[#53832F] transition-all",
                      errorMessage ? "border-red-500" : "border-[#DCE5D5]"
                    )}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#53832F] to-[#406E23] hover:from-[#487428] hover:to-[#38621E] active:scale-[0.985] text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending instructions...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#DCE5D5] text-center space-y-3">
            <p className="text-xs text-brand-muted font-medium">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="text-[#53832F] font-bold hover:underline underline-offset-4 transition-colors"
              >
                Log In →
              </Link>
            </p>

            <div>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-muted hover:text-[#202A20] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Welcome</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Mobile Home Bar Padding */}
        <div className="lg:hidden pb-3 pt-2 flex justify-center">
          <div className="w-32 h-1 rounded-full bg-black/75" />
        </div>

      </div>
    </div>
  );
}
