"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SellOnFarmConnectCard() {
  return (
    <div className="rounded-xl bg-brand-dark text-white p-6 sm:p-7 shadow-xs">
      <div className="max-w-xl">
        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
          Farmer Partnerships
        </p>

        <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2">
          Sell your harvest directly to local families.
        </h3>

        <p className="text-sm text-white/80 leading-relaxed mb-5">
          Join local farmers in Dakshina Kannada who list their daily produce on FarmConnect.
          Set your own fair prices and receive 100% direct payouts with zero intermediary deductions.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/register?role=FARMER"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-green text-white font-semibold text-sm hover:bg-brand-green/90 transition-colors shadow-xs"
          >
            <span>Register as a Farmer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm text-white/80 hover:text-white font-medium hover:underline"
          >
            Learn How It Works
          </Link>
        </div>
      </div>
    </div>
  );
}
