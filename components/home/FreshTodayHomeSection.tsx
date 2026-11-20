"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { DEMO_PRODUCTS } from "@/data/demo";

export default function FreshTodayHomeSection() {
  const freshProducts = DEMO_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-light flex items-center justify-center text-brand-green">
            <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-brand-text">Fresh Today</h2>
          </div>
        </div>
        <Link
          href="/buyer/explore"
          className="text-xs font-semibold text-brand-green hover:text-brand-dark flex items-center gap-1 group"
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
