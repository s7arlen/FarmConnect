"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  {
    value: "BUYER",
    label: "Individual Buyer",
    description: "Buy fresh produce for personal use",
  },
  {
    value: "BULK_BUYER",
    label: "Bulk Buyer",
    description: "Restaurant, hotel, institution, or grocery",
  },
  {
    value: "FARMER",
    label: "Farmer",
    description: "List and sell your farm produce",
  },
] as const;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultRole = (searchParams.get("role") as RegisterInput["role"]) || "BUYER";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Registration failed. Please try again.");
        return;
      }

      setUser(result.user);
      toast.success("Account created! Welcome to FarmConnect.");

      const routes: Record<string, string> = {
        FARMER: "/farmer/dashboard",
        BUYER: "/buyer/dashboard",
        BULK_BUYER: "/bulk-buyer/dashboard",
      };
      router.push(routes[result.user.role] || "/buyer/dashboard");
    } catch {
      toast.error("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-brand-text">Create account</h1>
          <p className="text-brand-muted text-sm mt-1">
            Join FarmConnect and access local produce
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              I want to
            </label>
            <div className="grid grid-cols-1 gap-2">
              {ROLE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === option.value
                      ? "border-brand-green bg-brand-light"
                      : "border-brand-border hover:border-brand-green/50"
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-0.5 accent-brand-green"
                    value={option.value}
                    checked={selectedRole === option.value}
                    onChange={() => setValue("role", option.value)}
                  />
                  <div>
                    <div className="text-sm font-semibold text-brand-text">
                      {option.label}
                    </div>
                    <div className="text-xs text-brand-muted">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="text-xs text-brand-error mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          <Input
            label="Full name"
            type="text"
            placeholder="Your full name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            autoComplete="name"
            {...register("name")}
          />

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />

          <Input
            label="Phone number (optional)"
            type="tel"
            placeholder="10-digit mobile number"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            autoComplete="tel"
            {...register("phone")}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-brand-muted hover:text-brand-text"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            autoComplete="new-password"
            {...register("password")}
          />

          <Input
            label="Confirm password"
            type={showPassword ? "text" : "password"}
            placeholder="Repeat your password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full mt-2" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-brand-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-green font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md bg-white rounded-2xl border border-brand-border shadow-sm p-8 animate-pulse h-[600px]" />}>
      <RegisterForm />
    </Suspense>
  );
}
