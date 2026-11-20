"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-green mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-brand-green" />
            </div>
            <h2 className="text-xl font-bold text-brand-text mb-2">
              Check your inbox
            </h2>
            <p className="text-brand-muted text-sm">
              If an account exists for <strong>{email}</strong>, you&apos;ll
              receive a reset link shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-brand-text">
                Reset password
              </h1>
              <p className="text-brand-muted text-sm mt-1">
                Enter your email to receive a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
