"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export default function PopularCategories() {
  const { t } = useLanguageStore();

  const categories = [
    {
      id: "vegetables",
      name: t("vegetables"),
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
      itemCount: "24 items",
    },
    {
      id: "fruits",
      name: t("fruits"),
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80",
      itemCount: "16 items",
    },
    {
      id: "grains",
      name: t("grains"),
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
      itemCount: "12 items",
    },
    {
      id: "pulses",
      name: t("pulses"),
      image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&q=80",
      itemCount: "8 items",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-light flex items-center justify-center text-brand-green">
            <Leaf className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-brand-text">
            {t("popularCategories")}
          </h2>
        </div>
        <Link
          href="/buyer/explore"
          className="text-xs font-semibold text-brand-green hover:text-brand-dark flex items-center gap-1 group"
        >
          <span>{t("viewAll")}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {categories.map((cat) => (
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
    </div>
  );
}
