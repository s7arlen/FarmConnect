"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  MapPin,
  ArrowRight,
  Search,
  Boxes,
  TrendingUp,
  Sprout,
  ChevronRight,
  Salad,
  Apple,
  Wheat,
  Milk,
  Flower2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import FarmerCard from "@/components/farmers/FarmerCard";
import { useAuthStore } from "@/store/authStore";
import { DEMO_PRODUCTS, DEMO_FARMERS, DEMO_ORDERS } from "@/data/demo";
import { cn, formatCurrency, getOrderStatusLabel, getOrderStatusColor, formatRelativeTime } from "@/lib/utils";

const CATEGORY_SHORTCUTS = [
  { name: "Vegetables", Icon: Salad, slug: "vegetables", count: 18, color: "text-emerald-700 bg-emerald-50" },
  { name: "Fruits", Icon: Apple, slug: "fruits", count: 12, color: "text-rose-700 bg-rose-50" },
  { name: "Grains", Icon: Wheat, slug: "grains", count: 8, color: "text-amber-700 bg-amber-50" },
  { name: "Dairy", Icon: Milk, slug: "dairy", count: 6, color: "text-sky-700 bg-sky-50" },
  { name: "Herbs", Icon: Flower2, slug: "herbs", count: 5, color: "text-teal-700 bg-teal-50" },
];

export default function BuyerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name?.split(" ")[0] || "Friend";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Check if there are active orders
  const activeOrders = DEMO_ORDERS.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* App Header Greeting & Location */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 flex-wrap gap-2"
      >
        <div>
          <p className="text-xs font-semibold text-brand-muted tracking-tight">{greeting},</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
            {name}
          </h1>
        </div>

        {/* Location Selector Pill */}
        <div className="flex items-center gap-1.5 bg-white border border-brand-border px-3 py-1.5 rounded-full shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
          <span className="text-xs font-bold text-brand-dark">Mangalore, Karnataka</span>
          <span className="text-[10px] text-brand-muted font-medium">(Within 15 km)</span>
        </div>
      </motion.div>

      {/* Quick App Search Bar */}
      <Link href="/buyer/explore" className="block mb-6 group">
        <div className="flex items-center gap-3 bg-white border border-brand-border group-hover:border-brand-green/60 rounded-2xl px-4 py-3.5 shadow-2xs transition-all">
          <Search className="w-4 h-4 text-brand-green stroke-[2.2]" />
          <span className="text-brand-muted text-sm font-medium">Search fresh vegetables, fruits, grains...</span>
        </div>
      </Link>

      {/* Active Order Banner (if any) */}
      {activeOrders.length > 0 && (
        <div className="mb-6">
          <Link href={`/buyer/orders/${activeOrders[0].id}`}>
            <div className="bg-gradient-to-r from-brand-dark to-brand-green text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-light">
                    Active Order in Progress
                  </span>
                </div>
                <p className="text-sm font-bold truncate">
                  {activeOrders[0].farmName} • {activeOrders[0].items?.length || 1} items
                </p>
                <p className="text-xs text-white/80 mt-0.5">
                  Status: {getOrderStatusLabel(activeOrders[0].status)}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/80 flex-shrink-0" />
            </div>
          </Link>
        </div>
      )}

      {/* Category Shortcuts Horizontal Carousel */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-brand-dark">Categories</h2>
          <Link href="/buyer/explore" className="text-xs font-bold text-brand-green hover:underline">
            See All
          </Link>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar sm:grid sm:grid-cols-5 sm:gap-4 pb-1">
          {CATEGORY_SHORTCUTS.map((cat) => {
            const Icon = cat.Icon;
            return (
              <Link
                key={cat.slug}
                href={`/buyer/explore?category=${cat.slug}`}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white rounded-2xl border border-brand-border/80 hover:border-brand-green/50 hover:bg-brand-light/20 transition-all text-center group shadow-2xs select-none flex-1 min-w-[70px] sm:min-w-0"
              >
                <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 shadow-2xs", cat.color)}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-brand-dark tracking-tight leading-tight truncate w-full">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Fresh Today Produce Feed */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Fresh Today
            </h2>
            <p className="text-xs text-brand-muted">Harvested within the last 24 hours</p>
          </div>
          <Link href="/buyer/explore">
            <Button variant="ghost" size="sm" className="gap-1 text-brand-green font-bold text-xs h-8">
              Explore All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DEMO_PRODUCTS.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Nearby Verified Farmers Feed */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark">Nearby Local Farms</h2>
            <p className="text-xs text-brand-muted">Verified smallholder farmers in your region</p>
          </div>
          <Link href="/buyer/farmers">
            <Button variant="ghost" size="sm" className="gap-1 text-brand-green font-bold text-xs h-8">
              All Farms <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_FARMERS.slice(0, 3).map((farmer, i) => (
            <FarmerCard key={farmer.id} farmer={farmer} index={i} />
          ))}
        </div>
      </section>

      {/* Bulk Commercial Procurement Callout */}
      <section>
        <Card className="bg-brand-dark text-white border-0 overflow-hidden relative rounded-2xl shadow-sm">
          <div className="absolute inset-0 opacity-15 bg-gradient-to-br from-brand-green via-transparent to-black" />
          <CardContent className="p-5 sm:p-6 relative z-10">
            <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Boxes className="w-5 h-5 text-brand-light" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-brand-light">
                    Commercial Bulk Procurement
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold mb-1">
                  Buying for a Restaurant, Hostel or Supermarket?
                </h3>
                <p className="text-white/70 text-xs max-w-md">
                  Post requirements in bulk (100 kg+) and get matched algorithmically with verified farmers at direct-from-farm pricing.
                </p>
              </div>

              <Link href="/buyer/bulk" className="flex-shrink-0">
                <Button size="sm" className="bg-brand-green hover:bg-emerald-600 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs">
                  Post Bulk Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
