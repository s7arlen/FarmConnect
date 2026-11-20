"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "vegetables",
    name: "Vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    itemCount: "24 items",
  },
  {
    id: "fruits",
    name: "Fruits",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80",
    itemCount: "16 items",
  },
  {
    id: "grains",
    name: "Grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    itemCount: "12 items",
  },
  {
    id: "pulses",
    name: "Pulses",
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&q=80",
    itemCount: "8 items",
  },
];

export default function PopularCategories() {
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-light flex items-center justify-center text-brand-green">
            <Leaf className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-brand-text">Popular Categories</h2>
        </div>
        <Link
          href="/buyer/explore"
          className="text-xs font-semibold text-brand-green hover:text-brand-dark flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4 Cards Grid / Scroll */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/buyer/explore?category=${cat.id}`}
            className="flex flex-col items-center group bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-brand-border hover:border-brand-green/40 hover:shadow-xs transition-all text-center"
          >
            <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-brand-light mb-1.5 sm:mb-2">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 25vw, 120px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-brand-text group-hover:text-brand-green transition-colors truncate w-full">
              {cat.name}
            </span>
            <span className="hidden sm:inline text-[10px] text-brand-muted mt-0.5">
              {cat.itemCount}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
