"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export default function PopularCategories() {
  const { t } = useLanguageStore();

  // Desktop extended 8 core categories with authentic produce photography
  const desktopCategories = [
    {
      id: "vegetables",
      name: "Vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80",
      itemCount: "28 items",
    },
    {
      id: "fruits",
      name: "Fruits",
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&q=80",
      itemCount: "19 items",
    },
    {
      id: "grains",
      name: "Grains & Staples",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80",
      itemCount: "14 items",
    },
    {
      id: "leafy",
      name: "Leafy Greens",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80",
      itemCount: "11 items",
    },
    {
      id: "roots",
      name: "Roots & Tubers",
      image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=500&q=80",
      itemCount: "8 items",
    },
    {
      id: "dairy",
      name: "Dairy & Eggs",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80",
      itemCount: "6 items",
    },
    {
      id: "herbs",
      name: "Herbs & Spices",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80",
      itemCount: "9 items",
    },
    {
      id: "pulses",
      name: "Pulses & Dal",
      image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&q=80",
      itemCount: "12 items",
    },
  ];

  // Mobile 4 primary categories (kept exactly as before)
  const mobileCategories = [
    {
      id: "vegetables",
      name: t("vegetables") || "Vegetables",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
      itemCount: "24 items",
    },
    {
      id: "fruits",
      name: t("fruits") || "Fruits",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80",
      itemCount: "16 items",
    },
    {
      id: "grains",
      name: t("grains") || "Grains",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
      itemCount: "12 items",
    },
    {
      id: "pulses",
      name: t("pulses") || "Pulses",
      image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&q=80",
      itemCount: "8 items",
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-light flex items-center justify-center text-brand-green">
            <Leaf className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-brand-text leading-tight">
              {t("popularCategories") || "Popular Categories"}
            </h2>
          </div>
        </div>
        <Link
          href="/buyer/explore"
          className="text-xs font-semibold text-brand-green hover:text-brand-dark flex items-center gap-1 group"
        >
          <span>{t("viewAll") || "View All"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* MOBILE / TABLET VIEW (< 1024px) - Intact & Untouched */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 lg:hidden">
        {mobileCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/buyer/explore?category=${cat.id}`}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-100 shadow-2xs hover:shadow-xs transition-shadow"
          >
            {/* Background Image */}
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Label and Count */}
            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <p className="font-bold text-sm tracking-tight leading-tight">{cat.name}</p>
              <p className="text-[10px] text-white/80 font-medium">{cat.itemCount}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* DESKTOP VIEW (>= 1024px) - Clean, Realistic Marketplace Shelf */}
      <div className="hidden lg:grid grid-cols-4 xl:grid-cols-8 gap-3.5 pt-1">
        {desktopCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/buyer/explore?category=${cat.id}`}
            className="group bg-white rounded-xl border border-slate-200/90 p-3 hover:border-brand-green hover:shadow-sm transition-all duration-200 flex flex-col items-center text-center"
          >
            {/* Real Clean Product Photography Thumbnail */}
            <div className="w-full aspect-square rounded-lg overflow-hidden relative bg-slate-50 border border-slate-100 mb-2.5">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="160px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Category Name & Item Count */}
            <span className="font-semibold text-slate-800 text-sm group-hover:text-brand-green transition-colors line-clamp-1">
              {cat.name}
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5">
              {cat.itemCount}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
