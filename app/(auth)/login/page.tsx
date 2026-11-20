"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Login failed. Please check your credentials.");
        return;
      }

      setUser(result.user);
      toast.success(`Welcome back, ${result.user.name}!`);

      // Redirect based on role
      const routes: Record<string, string> = {
        FARMER: "/farmer/dashboard",
        BUYER: "/buyer/dashboard",
        BULK_BUYER: "/bulk-buyer/dashboard",
        ADMIN: "/admin/dashboard",
      };
      router.push(routes[result.user.role] || "/buyer/dashboard");
    } catch {
      toast.error("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-brand-text">Welcome back</h1>
          <p className="text-brand-muted text-sm mt-1">
            Sign in to your FarmConnect account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-brand-muted hover:text-brand-text"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            error={errors.password?.message}
            autoComplete="current-password"
            {...register("password")}
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-brand-green hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

        {/* Demo accounts hint */}
        <div className="mt-5 p-3 bg-brand-light rounded-lg">
          <p className="text-xs text-brand-muted font-medium mb-1">Demo accounts:</p>
          <div className="space-y-0.5 text-xs text-brand-muted">
            <p>buyer@demo.com / Demo@1234</p>
            <p>farmer@demo.com / Demo@1234</p>
            <p>admin@demo.com / Demo@1234</p>
          </div>
        </div>

        <p className="text-center text-sm text-brand-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-green font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
