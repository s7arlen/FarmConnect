"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, User, Tractor, Building2, CheckCircle2, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    id: "BUYER",
    title: "Individual Buyer",
    badge: "Consumer",
    icon: User,
    iconBg: "bg-blue-50 text-blue-600",
    description: "Buy fresh, farm-picked produce directly for you and your family. Enjoy vine-ripened quality with full traceability.",
    highlights: ["Fresh daily harvests", "Direct pickup or delivery", "Transparent farm pricing"],
    href: "/register?role=BUYER",
  },
  {
    id: "FARMER",
    title: "Farmer",
    badge: "Producer",
    icon: Tractor,
    iconBg: "bg-brand-light text-brand-green",
    description: "List your harvests, set your own fair prices, and sell directly to consumers and businesses without middlemen.",
    highlights: ["Keep 100% of your earnings", "Direct buyer orders", "Live inventory management"],
    href: "/register?role=FARMER",
    popular: true,
  },
  {
    id: "BULK_BUYER",
    title: "Bulk Buyer",
    badge: "Commercial",
    icon: Building2,
    iconBg: "bg-amber-50 text-amber-600",
    description: "Procure quality produce at scale for restaurants, hotels, catering businesses, canteens, and wholesale markets.",
    highlights: ["Post bulk procurement requirements", "5-factor farmer matching", "Contract negotiations"],
    href: "/register?role=BULK_BUYER",
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("BUYER");

  function handleContinue() {
    const role = ROLES.find((r) => r.id === selectedRole);
    if (role) {
      router.push(role.href);
    }
  }

  function handleGuestExplore() {
    document.cookie = "farmconnect_visited=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/?guest=1");
  }

  return (
    <div className="min-h-screen bg-brand-cream/80 flex items-center justify-center p-0 sm:p-4 lg:p-6">
      <div className="w-full sm:max-w-md bg-white sm:rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-screen sm:min-h-[844px] relative border border-brand-border/40">
        
        {/* Top Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-brand-border/60 bg-white">
          <Link
            href="/get-started"
            className="w-8 h-8 rounded-full bg-brand-cream hover:bg-brand-light flex items-center justify-center text-brand-dark transition-colors"
            aria-label="Back to welcome page"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-brand-dark">FarmConnect</span>
          </div>

          <Link href="/login" className="text-xs font-semibold text-brand-green hover:underline">
            Log in
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-1">
                Choose your role
              </h1>
              <p className="text-xs text-brand-muted leading-relaxed">
                Select how you want to participate in the FarmConnect agricultural marketplace.
              </p>
            </motion.div>

            {/* Role Options */}
            <div className="mt-4 space-y-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "relative rounded-2xl p-4 border-2 transition-all cursor-pointer text-left select-none group",
                      isSelected
                        ? "border-brand-green bg-brand-light/30 shadow-xs"
                        : "border-brand-border bg-white hover:border-brand-border hover:bg-brand-cream/50"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs", role.iconBg)}>
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-brand-dark">{role.title}</h3>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-light text-brand-dark">
                              {role.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5",
                          isSelected
                            ? "border-brand-green bg-brand-green text-white"
                            : "border-brand-muted/40"
                        )}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-brand-muted leading-relaxed mb-3">
                      {role.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5">
                      {role.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-[10px] font-medium bg-white border border-brand-border/80 px-2 py-0.5 rounded-md text-brand-text/80"
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-3 border-t border-brand-border/60">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full h-12 rounded-2xl bg-brand-green hover:bg-brand-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Continue Registration</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleGuestExplore}
                className="text-xs font-semibold text-brand-muted hover:text-brand-dark underline underline-offset-4 transition-colors"
              >
                Skip and explore as guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
