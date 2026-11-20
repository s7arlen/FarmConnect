"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const setUser = useAuthStore((s) => s.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const msg = result.error || "Incorrect credentials. Please verify your details.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      // Update Zustand state
      setUser(result.user);
      toast.success(`Welcome back, ${result.user.name}!`);

      // Determine destination
      const roleRoutes: Record<string, string> = {
        FARMER: "/farmer/dashboard",
        BUYER: "/buyer/dashboard",
        BULK_BUYER: "/bulk-buyer/dashboard",
        ADMIN: "/admin/dashboard",
      };

      const defaultDestination = roleRoutes[result.user.role] || "/buyer/dashboard";
      const targetDestination = from && from.startsWith("/") ? from : defaultDestination;

      router.push(targetDestination);
    } catch {
      const errorMsg = "Unable to connect to the server. Please check your network.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  // Helper for quick testing demo roles
  function fillDemo(email: string) {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "Demo@1234", { shouldValidate: true });
    setErrorMessage(null);
  }

  return (
    <div className="min-h-screen bg-[#F2F6EC] text-[#202A20] flex flex-col lg:flex-row selection:bg-[#53832F] selection:text-white">
      
      {/* =========================================================================
          DESKTOP LEFT SIDEBAR: Vibrant Emerald Farmland Hero (Visible on lg+)
      ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E2E1E] text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Image: Vibrant Green Crops at Sunrise */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lush-crops-sunrise.jpg"
            alt="Lush green organic farmland crops bathed in morning golden sunrise"
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
            href="/get-started"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Welcome</span>
          </Link>
        </div>

        {/* Hero Narrative */}
        <div className="relative z-10 max-w-lg mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53832F]/30 text-[#D6F0C7] text-xs font-bold uppercase tracking-wider mb-4 border border-[#53832F]/40 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6F0C7]" />
            <span>Local Food Revolution</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-md">
            Welcome back to your local food community.
          </h2>

          <p className="text-base text-white/90 leading-relaxed drop-shadow-xs font-medium mb-8">
            Connect directly with verified local farmers, track harvests in real-time, and bring fresh, seasonal produce to your table.
          </p>

          {/* Value highlights */}
          <div className="space-y-3 pt-4 border-t border-white/15">
            {[
              "100% direct from verified regional growers",
              "Fresh harvest updates and transparent pricing",
              "Fair terms for farmers and fresh food for families",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2.5 text-xs text-white/90 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#D6F0C7] flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} FarmConnect. Supporting agricultural communities across Karnataka.
        </div>
      </div>

      {/* =========================================================================
          RIGHT FORM CONTAINER (App-Type Layout on Mobile, Split on Desktop)
      ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between min-h-screen lg:min-h-auto overflow-y-auto">
        
        {/* MOBILE UPPER HERO (Lush Green Crops at Sunrise) */}
        <div className="lg:hidden relative h-[32vh] min-h-[230px] max-h-[290px] w-full flex flex-col justify-between p-5 overflow-hidden">
          {/* Farm Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/lush-crops-sunrise.jpg"
              alt="Lush green organic farmland crops at sunrise"
              fill
              priority
              className="object-cover object-bottom"
            />
            {/* Natural Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/80" />
          </div>

          {/* Floating Mobile Top Bar */}
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
              href="/get-started"
              className="inline-flex items-center gap-1 text-xs font-bold text-white px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-xs border border-white/20 hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
          </div>

          {/* Mobile Hero Headline */}
          <div className="relative z-10 mb-2">
            <h1 className="text-[30px] font-black text-white leading-tight tracking-tight drop-shadow-md">
              Welcome back!
            </h1>
            <p className="text-xs text-white/95 font-medium leading-relaxed max-w-[280px] mt-1 drop-shadow-xs">
              Your local farm marketplace is just a step away.
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

        {/* LOGIN FORM SECTION */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-16 py-6 max-w-[460px] mx-auto w-full">
          
          {/* Desktop Top Sub-Header */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-[#202A20] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#53832F]" />
              <span>Back to Get Started</span>
            </Link>
            <span className="text-xs text-[#53832F] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Secure Sign In
            </span>
          </div>

          {/* Form Title & Subtitle */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#202A20] tracking-tight">
              Log in to FarmConnect
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 font-medium">
              Enter your registered details to continue.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-in fade-in duration-200 flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            
            {/* Field 1: Email / Phone */}
            <div>
              <label className="block text-xs font-bold text-[#202A20] mb-1.5">
                Email address or phone number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your email or phone number"
                  {...register("email")}
                  className={cn(
                    "w-full h-12 pl-10 pr-4 rounded-xl bg-white border text-sm text-[#202A20] placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-[#53832F] transition-all",
                    errors.email ? "border-red-500" : "border-[#DCE5D5]"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Field 2: Password with Show/Hide */}
            <div>
              <label className="block text-xs font-bold text-[#202A20] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={cn(
                    "w-full h-12 pl-10 pr-11 rounded-xl bg-white border text-sm text-[#202A20] placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-[#53832F] transition-all",
                    errors.password ? "border-red-500" : "border-[#DCE5D5]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-[#202A20] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-border text-[#53832F] focus:ring-[#53832F] accent-[#53832F]"
                />
                <span className="text-xs font-semibold text-brand-muted hover:text-[#202A20] transition-colors">
                  Remember me
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#53832F] hover:text-[#3B621E] hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Primary Login Button: Plush 56px Pill Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 min-h-[56px] rounded-2xl bg-gradient-to-r from-[#53832F] to-[#406E23] hover:from-[#487428] hover:to-[#38621E] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.985] disabled:opacity-65 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Logging In...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* STREAMLINED MINIMAL DEMO ACCOUNTS BAR */}
          <div className="mt-6 pt-4 border-t border-[#DCE5D5]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#202A20] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#53832F]" />
                Quick Demo Fill
              </span>
              <span className="text-[10px] text-brand-muted font-medium">Password: Demo@1234</span>
            </div>

            {/* 4 Sleek Horizontal Role Chips */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { role: "Buyer", email: "buyer@demo.com", icon: "🛒" },
                { role: "Farmer", email: "farmer@demo.com", icon: "👨‍🌾" },
                { role: "Bulk", email: "bulk@demo.com", icon: "🏢" },
                { role: "Admin", email: "admin@demo.com", icon: "🛡️" },
              ].map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => fillDemo(d.email)}
                  className="py-2 px-1 rounded-xl bg-white hover:bg-[#EAF3E4] border border-[#DCE5D5] hover:border-[#53832F]/50 text-center transition-all cursor-pointer shadow-2xs group"
                >
                  <span className="text-sm block mb-0.5">{d.icon}</span>
                  <span className="text-[11px] font-bold text-[#202A20] group-hover:text-[#53832F] block leading-tight">
                    {d.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-[#DCE5D5] text-center space-y-2.5">
            <p className="text-xs text-brand-muted font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/get-started/roles"
                className="text-[#53832F] font-bold hover:underline underline-offset-4 transition-colors"
              >
                Create an account →
              </Link>
            </p>

            <div>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-muted hover:text-[#202A20] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Get Started</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Mobile Home Bar Padding */}
        <div className="lg:hidden pb-3 pt-1 flex justify-center">
          <div className="w-32 h-1 rounded-full bg-black/20" />
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F6EC] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4D8B38]" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
