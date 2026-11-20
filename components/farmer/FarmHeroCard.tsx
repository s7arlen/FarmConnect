"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  Plus,
  Layers,
  ClipboardList,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  return (
    <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-white shadow-sm mb-6 transition-all">
      {/* Visual Header Banner */}
      <div className="relative min-h-[160px] sm:min-h-[175px] w-full bg-brand-dark overflow-hidden flex flex-col justify-between p-4">
        <img
          src={coverImageUrl}
          alt={farmName}
          className="absolute inset-0 w-full h-full object-cover opacity-65 mix-blend-overlay scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <Badge className="bg-brand-green/90 text-white backdrop-blur-sm border-0 gap-1.5 px-2.5 py-1 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Harvest Season Active
          </Badge>

          {verified && (
            <Badge className="bg-white/95 text-brand-dark backdrop-blur-sm border-0 gap-1 px-2.5 py-1 text-[11px] font-bold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
              Verified Farm
            </Badge>
          )}
        </div>

        {/* Farm & Farmer Identity over Cover */}
        <div className="relative z-10 flex items-end justify-between pt-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-13 h-13 sm:w-14 sm:h-14 ring-2 ring-white/90 shadow-md bg-white flex-shrink-0">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={farmerName} className="object-cover" />}
              <AvatarFallback className="bg-brand-light text-brand-dark font-bold text-base">
                {getInitials(farmerName)}
              </AvatarFallback>
            </Avatar>

            <div className="text-white drop-shadow-sm min-w-0">
              <h2 className="text-base sm:text-xl font-bold leading-tight truncate">{farmName}</h2>
              <p className="text-xs text-white/90 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                <span className="font-semibold">{farmerName}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin className="w-3 h-3 text-brand-light flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="p-4 bg-brand-cream/40 border-b border-brand-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white p-3 rounded-xl border border-brand-border/80 shadow-2xs">
            <p className="text-[11px] font-medium text-brand-muted">Active Crops</p>
            <p className="text-xl font-extrabold text-brand-dark mt-0.5">{activeProductsCount}</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-brand-border/80 shadow-2xs">
            <p className="text-[11px] font-medium text-brand-muted">Available Stock</p>
            <p className="text-xl font-extrabold text-brand-green mt-0.5">
              {totalStockUnits} <span className="text-xs font-normal text-brand-muted">units</span>
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-brand-border/80 shadow-2xs">
            <p className="text-[11px] font-medium text-brand-muted">Pending Orders</p>
            <p className="text-xl font-extrabold text-amber-600 mt-0.5">{pendingOrdersCount}</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-brand-border/80 shadow-2xs">
            <p className="text-[11px] font-medium text-brand-muted">Total Sales</p>
            <p className="text-xl font-extrabold text-brand-dark mt-0.5">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Touch Bar */}
      <div className="p-3 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Link href="/farmer/products/add" className="flex-1 min-w-[120px]">
          <Button
            size="sm"
            className="w-full gap-1.5 bg-brand-green hover:bg-brand-dark text-white font-semibold text-xs h-9 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Crop
          </Button>
        </Link>

        <Link href="/farmer/stock" className="flex-1 min-w-[120px]">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 border-brand-border hover:bg-brand-light text-brand-dark font-semibold text-xs h-9 rounded-xl"
          >
            <Layers className="w-4 h-4 text-brand-green" />
            Update Stock
          </Button>
        </Link>

        <Link href="/farmer/orders" className="flex-1 min-w-[110px]">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 border-brand-border hover:bg-brand-light text-brand-dark font-semibold text-xs h-9 rounded-xl"
          >
            <ClipboardList className="w-4 h-4 text-brand-green" />
            Orders ({pendingOrdersCount})
          </Button>
        </Link>
      </div>
    </div>
  );
}
