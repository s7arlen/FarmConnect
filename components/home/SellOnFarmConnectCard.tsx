"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";

export default function SellOnFarmConnectCard() {
  return (
    <div className="relative rounded-2xl bg-brand-dark text-white p-5 sm:p-6 overflow-hidden shadow-sm">
      {/* Subtle organic pattern */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-brand-green/20 blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-green/20 text-brand-light text-[10px] font-bold uppercase tracking-wider mb-2.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-light" />
          <span>For Local Farmers</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug mb-1.5">
          Your farm. Your customers. <br />
          <span className="text-brand-light">Your price.</span>
        </h3>

        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4 max-w-md">
          Join 200+ verified farmers across Karnataka selling directly to households and commercial buyers without middlemen.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/register?role=FARMER"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-green text-white font-bold text-xs hover:bg-brand-green/90 transition-all shadow-sm group"
          >
            <span>Start Selling Today</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/how-it-works"
            className="text-xs font-semibold text-white/80 hover:text-white underline-offset-4 hover:underline"
          >
            How it works
          </Link>
        </div>
      </div>
    </div>
  );
}
