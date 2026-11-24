"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Tractor,
  Building2,
  CheckCircle2,
  Leaf,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    id: "BUYER",
    title: "Individual Buyer",
    shortTitle: "Buyer",
    badge: "Consumer",
    icon: ShoppingCart,
    subtitle: "Fresh local produce directly for your home & family",
    href: "/register?role=BUYER",
  },
  {
    id: "FARMER",
    title: "Farmer / Producer",
    shortTitle: "Farmer",
    badge: "Producer",
    icon: Tractor,
    subtitle: "List harvests, set your prices, and keep 100% of earnings",
    href: "/register?role=FARMER",
  },
  {
    id: "BULK_BUYER",
    title: "Bulk Commercial Buyer",
    shortTitle: "Bulk Buyer",
    badge: "Commercial",
    icon: Building2,
    subtitle: "Procure produce at scale for restaurants, hotels & markets",
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
    document.cookie =
      "farmconnect_visited=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/?guest=1");
  }

  const currentRole = ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F2F6EC] flex items-center justify-center p-0 sm:p-4 lg:p-6 py-0 sm:py-6 selection:bg-[#53832F] selection:text-white">
      
      {/* Mobile-App Device Frame (Full Bleed on Mobile, Centered Card on Desktop) */}
      <div className="w-full sm:max-w-[430px] bg-white sm:rounded-[36px] shadow-xl sm:border sm:border-[#DCE5D5] flex flex-col min-h-[100dvh] sm:min-h-0 sm:max-h-[92vh] justify-between overflow-hidden">
        
        {/* =====================================================================
            TOP APP HEADER
        ===================================================================== */}
        <header className="px-5 pt-4 sm:pt-5 pb-3 flex items-center justify-between border-b border-[#E7EFE3] bg-white">
          <Link
            href="/get-started"
            className="w-9 h-9 rounded-full bg-[#F2F6EC] hover:bg-[#E3EFE0] active:scale-95 flex items-center justify-center text-[#202A20] transition-all"
            aria-label="Back to welcome page"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          </Link>

          {/* Centered Brand Mark */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#53832F] rounded-xl flex items-center justify-center shadow-xs">
              <Leaf className="w-4 h-4 text-white stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#202A20]">
              FarmConnect
            </span>
          </div>

          <Link
            href="/login"
            className="text-xs font-bold text-[#4D8337] hover:text-[#28552B] transition-colors"
          >
            Log in
          </Link>
        </header>

        {/* =====================================================================
            MAIN CONTENT AREA (Minimal & Zero-Scroll Layout)
        ===================================================================== */}
        <main className="flex-1 px-5 py-5 flex flex-col justify-between overflow-y-auto">
          
          {/* Title & One-liner Subtitle */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D8337] block mb-1">
                Step 1 of 2
              </span>
              <h1 className="text-2xl sm:text-[26px] font-black text-[#1E2E1E] tracking-tight leading-tight">
                How will you participate?
              </h1>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Select an account type to customize your marketplace experience.
              </p>
            </motion.div>

            {/* The 3 Minimal Role Cards */}
            <div className="mt-5 space-y-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <motion.div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    whileTap={{ scale: 0.985 }}
                    className={cn(
                      "p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-center justify-between gap-3.5",
                      isSelected
                        ? "border-[#53832F] bg-[#F1F7EC] shadow-xs"
                        : "border-[#E4EDE1] bg-white hover:border-[#D0E2CA] hover:bg-[#FAFDF9]"
                    )}
                  >
                    {/* Left: Icon Tile + Title + Subtitle */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-2xs",
                          isSelected
                            ? "bg-[#53832F] text-white"
                            : "bg-[#EAF3E4] text-[#4D8337]"
                        )}
                      >
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3
                            className={cn(
                              "text-sm font-extrabold tracking-tight truncate",
                              isSelected ? "text-[#1C3317]" : "text-[#202A20]"
                            )}
                          >
                            {role.title}
                          </h3>
                        </div>
                        <p className="text-[11px] sm:text-xs text-brand-muted leading-snug line-clamp-2">
                          {role.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right: Sleek Radio Check Indicator */}
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        isSelected
                          ? "border-[#53832F] bg-[#53832F] text-white"
                          : "border-[#BAC8B5] bg-white"
                      )}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current stroke-white stroke-[2.5]" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* =====================================================================
              BOTTOM ACTIONS: Plush Pill CTA & Secondary Link
          ===================================================================== */}
          <div className="pt-4 pb-2 space-y-3">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full h-14 bg-gradient-to-r from-[#53832F] to-[#406E23] hover:from-[#487428] hover:to-[#38621E] active:scale-[0.985] text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <span>Continue as {currentRole?.shortTitle}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={handleGuestExplore}
                className="text-xs font-semibold text-brand-muted hover:text-[#202A20] underline decoration-[#BAC8B5] underline-offset-4 transition-colors cursor-pointer"
              >
                Skip and explore as guest
              </button>
            </div>
          </div>

        </main>


      </div>
    </div>
  );
}
