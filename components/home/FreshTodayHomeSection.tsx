"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { DEMO_PRODUCTS } from "@/data/demo";

export default function FreshTodayHomeSection() {
  const freshProducts = DEMO_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Today&apos;s Fresh Harvest</h2>
        <Link
          href="/buyer/explore"
          className="text-xs sm:text-sm font-semibold text-brand-green hover:text-brand-dark flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {freshProducts.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </div>
  );
}
