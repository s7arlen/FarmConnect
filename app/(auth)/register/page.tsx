"use client";

import React, { useState, Suspense } from "react";
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
  User,
  Phone,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  CheckCircle2,
  Tractor,
  Building2,
  ShoppingCart,
} from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const ROLE_OPTIONS = [
  {
    value: "BUYER",
    label: "Individual Buyer",
    shortLabel: "Buyer",
    icon: ShoppingCart,
    description: "Buy vine-ripened produce directly for your family",
  },
  {
    value: "FARMER",
    label: "Farmer / Producer",
    shortLabel: "Farmer",
    icon: Tractor,
    description: "List harvests and sell directly without middleman cuts",
  },
  {
    value: "BULK_BUYER",
    label: "Commercial Buyer",
    shortLabel: "Bulk Buyer",
    icon: Building2,
    description: "Procure quality produce for restaurants, hotels & markets",
  },
] as const;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "oauth_cancelled") {
        setErrorMessage("Google Sign-up was cancelled.");
      } else if (errorParam === "token_exchange_failed") {
        setErrorMessage("Google token verification failed. Please verify your Google Client ID and Secret.");
      } else if (errorParam === "oauth_state_invalid" || errorParam === "oauth_state_mismatch" || errorParam === "oauth_session_expired") {
        setErrorMessage("Sign-up session timed out. Please click Continue with Google again.");
      } else if (errorParam.includes("Google OAuth is not configured")) {
        setErrorMessage(errorParam);
      } else {
        setErrorMessage(`Sign-up error (${errorParam}). Please try again or register with email.`);
      }
    }
  }, [searchParams]);

  const defaultRole =
    (searchParams.get("role") as RegisterInput["role"]) || "BUYER";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const msg = result.error || "Registration failed. Please check your details.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      setUser(result.user);
      toast.success("Account created successfully! Welcome to FarmConnect.");

      const routes: Record<string, string> = {
        FARMER: "/farmer/dashboard",
        BUYER: "/buyer/dashboard",
        BULK_BUYER: "/bulk-buyer/dashboard",
      };
      router.push(routes[result.user.role] || "/buyer/dashboard");
    } catch {
      const msg = "Unable to connect to the server. Please check your network.";
      setErrorMessage(msg);
      toast.error(msg);
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
        {/* Background Image */}
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
            href="/get-started/roles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Role Selection</span>
          </Link>
        </div>

        {/* Hero Narrative */}
        <div className="relative z-10 max-w-lg mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53832F]/30 text-[#D6F0C7] text-xs font-bold uppercase tracking-wider mb-4 border border-[#53832F]/40 backdrop-blur-xs">
            <Leaf className="w-3.5 h-3.5 text-[#D6F0C7] stroke-[2.2]" />
            <span>Direct Marketplace</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-md">
            Join the local food revolution.
          </h2>

          <p className="text-base text-white/90 leading-relaxed drop-shadow-xs font-medium mb-8">
            Create an account to discover vine-ripened produce, trade fairly without middlemen markups, and strengthen regional agriculture.
          </p>

          {/* Value highlights */}
          <div className="space-y-3 pt-4 border-t border-white/15">
            {[
              "Keep 100% of fair value with zero hidden middleman fees",
              "Direct farm pickups, verified freshness, and reliable delivery",
              "Dedicated dashboards tailored to your role as Buyer, Farmer, or Commercial Buyer",
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
          RIGHT FORM CONTAINER (Mobile App Layout on small screens, Split on Desktop)
      ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between lg:h-screen lg:overflow-y-auto">
        
        {/* MOBILE UPPER HERO: Visual Family with Get Started & Login (Hidden on lg+) */}
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
              href="/get-started/roles"
              className="inline-flex items-center gap-1 text-xs font-bold text-white px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-xs border border-white/20 hover:bg-black/40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Roles</span>
            </Link>
          </div>

          {/* Mobile Headline */}
          <div className="relative z-10 mb-2">
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              Create an account
            </h1>
            <p className="text-xs text-white/95 font-medium leading-relaxed max-w-[280px] mt-1 drop-shadow-xs">
              Connect directly with verified farmers near you.
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

        {/* FORM CONTENT */}
        <div className="flex-1 px-5 sm:px-8 lg:px-16 py-6 sm:py-8 max-w-xl mx-auto w-full flex flex-col justify-center">
          
          {/* Desktop Heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-black text-[#202A20] tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-brand-muted mt-1 font-medium">
              Select your role and enter your details to get started.
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium animate-in fade-in duration-200 flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            
            {/* 1. ROLE SELECTION PILLS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                I want to join as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedRole === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue("role", option.value)}
                      className={cn(
                        "p-2.5 sm:p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer relative",
                        isSelected
                          ? "bg-[#53832F] text-white border-[#53832F] shadow-sm font-bold"
                          : "bg-white text-[#202A20] border-[#DCE5D5] hover:border-[#53832F]/50 font-medium"
                      )}
                    >
                      <Icon className={cn("w-5 h-5 mb-1", isSelected ? "text-white" : "text-[#53832F]")} />
                      <span className="text-xs leading-tight block">{option.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.role.message}</p>
              )}
            </div>

            {/* 2. FULL NAME */}
            <div>
              <label className="block text-xs font-bold text-[#202A20] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  className={cn(
                    "w-full h-12 pl-10 pr-4 rounded-xl bg-white border text-sm text-[#202A20] placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-[#53832F] transition-all",
                    errors.name ? "border-red-500" : "border-[#DCE5D5]"
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* 3. EMAIL ADDRESS */}
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
                  placeholder="you@example.com"
                  {...register("email")}
                  className={cn(
                    "w-full h-12 pl-10 pr-4 rounded-xl bg-white border text-sm text-[#202A20] placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-[#53832F] transition-all",
                    errors.email ? "border-red-500" : "border-[#DCE5D5]"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* 4. PHONE NUMBER (OPTIONAL) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#202A20]">
                  Phone Number
                </label>
                <span className="text-[10px] text-brand-muted">Optional</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="10-digit Indian mobile number"
                  {...register("phone")}
                  className={cn(
                    "w-full h-12 pl-10 pr-4 rounded-xl bg-white border text-sm text-[#202A20] placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-[#53832F] transition-all",
                    errors.phone ? "border-red-500" : "border-[#DCE5D5]"
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* 5. PASSWORD */}
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
                  placeholder="At least 8 chars, 1 uppercase, 1 number"
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
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* 6. CONFIRM PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-[#202A20] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  {...register("confirmPassword")}
                  className={cn(
                    "w-full h-12 pl-10 pr-11 rounded-xl bg-white border text-sm text-[#202A20] placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-[#53832F] transition-all",
                    errors.confirmPassword ? "border-red-500" : "border-[#DCE5D5]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-[#202A20] transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-[#53832F] to-[#406E23] hover:from-[#487428] hover:to-[#38621E] active:scale-[0.985] text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social Divider & Google Sign-Up */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DCE5D5]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#F2F6EC] px-3 font-semibold text-brand-muted text-[11px]">
                Or sign up with
              </span>
            </div>
          </div>

          <GoogleSignInButton role={selectedRole} />

          {/* FOOTER NAVIGATION */}
          <div className="mt-8 pt-6 border-t border-[#DCE5D5] text-center space-y-3">
            <p className="text-xs text-brand-muted font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#53832F] font-bold hover:underline underline-offset-4 transition-colors"
              >
                Log In →
              </Link>
            </p>

            <div>
              <Link
                href="/get-started/roles"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-muted hover:text-[#202A20] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Role Selection</span>
              </Link>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F6EC] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4D8B38]" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
