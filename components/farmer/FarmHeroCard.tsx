"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  Plus,
  Layers,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getInitials } from "@/lib/utils";

interface FarmHeroCardProps {
  farmerName: string;
  farmName: string;
  location?: string;
  verified?: boolean;
  avatarUrl?: string;
  coverImageUrl?: string;
  activeProductsCount: number;
  totalStockUnits: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
  totalRevenue?: number;
}

export default function FarmHeroCard({
  farmerName,
  farmName,
  location = "Bantwal, Dakshina Kannada",
  verified = true,
  avatarUrl,
  coverImageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
  activeProductsCount,
  totalStockUnits,
  pendingOrdersCount,
  completedOrdersCount,
  totalRevenue = 0,
}: FarmHeroCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-white shadow-xs mb-6 transition-all">
      {/* Visual Header Banner - Minimal App-Style */}
      <div className="relative w-full bg-[#1B351B] overflow-hidden p-4 sm:p-5">
        {/* Subtle Farmland Background Texture */}
        <img
          src={coverImageUrl}
          alt={farmName}
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172E17]/95 via-[#1E3B1E]/80 to-[#172E17]/90 pointer-events-none" />

        {/* Farmer Identity Row */}
        <div className="relative z-10 flex items-center gap-3.5">
          {/* Avatar with fixed dimensions */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ring-2 ring-white/20 shadow-md overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center">
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={farmerName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-white font-extrabold text-lg sm:text-xl">
                {getInitials(farmerName)}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate leading-tight">
                {farmName}
              </h2>
              {verified && (
                <CheckCircle2
                  className="w-4 h-4 text-emerald-400 flex-shrink-0"
                  aria-label="Verified Farm"
                />
              )}
            </div>

            <p className="text-xs text-emerald-100/80 font-medium flex items-center gap-1.5 mt-0.5 truncate">
              <span>{farmerName}</span>
              <span className="opacity-60">•</span>
              <span className="flex items-center gap-0.5 truncate">
                <MapPin className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="p-3.5 bg-[#FAFBF7] border-b border-brand-border/70">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-white p-3 rounded-xl border border-brand-border/70 shadow-2xs">
            <p className="text-[11px] font-medium text-brand-muted">Active Crops</p>
            <p className="text-lg sm:text-xl font-extrabold text-brand-dark mt-0.5">
              {activeProductsCount}
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-brand-border/70 shadow-2xs">
            <p className="text-[11px] font-medium text-brand-muted">Available Stock</p>
            <p className="text-lg sm:text-xl font-extrabold text-brand-green mt-0.5">
              {totalStockUnits}{" "}
              <span className="text-[11px] font-normal text-brand-muted">units</span>
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-brand-border/70 shadow-2xs">
            <p className="text-[11px] font-medium text-brand-muted">Pending Orders</p>
            <p className="text-lg sm:text-xl font-extrabold text-amber-600 mt-0.5">
              {pendingOrdersCount}
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-brand-border/70 shadow-2xs">
            <p className="text-[11px] font-medium text-brand-muted">Total Sales</p>
            <p className="text-lg sm:text-xl font-extrabold text-brand-dark mt-0.5">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="p-3 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Link href="/farmer/products/add" className="flex-1 min-w-[110px]">
          <Button
            size="sm"
            className="w-full gap-1.5 bg-brand-green hover:bg-brand-dark text-white font-semibold text-xs h-9 rounded-xl shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Crop
          </Button>
        </Link>

        <Link href="/farmer/stock" className="flex-1 min-w-[110px]">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 border-brand-border hover:bg-brand-light text-brand-dark font-semibold text-xs h-9 rounded-xl"
          >
            <Layers className="w-3.5 h-3.5 text-brand-green" />
            Update Stock
          </Button>
        </Link>

        <Link href="/farmer/orders" className="flex-1 min-w-[110px]">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 border-brand-border hover:bg-brand-light text-brand-dark font-semibold text-xs h-9 rounded-xl"
          >
            <ClipboardList className="w-3.5 h-3.5 text-brand-green" />
            Orders ({pendingOrdersCount})
          </Button>
        </Link>
      </div>
    </div>
  );
}
