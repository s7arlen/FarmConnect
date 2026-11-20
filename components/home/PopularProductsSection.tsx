"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { DEMO_PRODUCTS } from "@/data/demo";

export default function PopularProductsSection() {
  const popular = DEMO_PRODUCTS.slice(4, 8);

  if (popular.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-brand-text">Popular Products</h2>
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
        {popular.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </div>
  );
}
