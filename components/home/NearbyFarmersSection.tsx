"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tractor, ArrowRight, CheckCircle, MapPin, Star, Map } from "lucide-react";
import { DEMO_FARMERS } from "@/data/demo";
import { useLanguageStore } from "@/store/languageStore";

export default function NearbyFarmersSection() {
  const nearbyFarmers = DEMO_FARMERS.slice(0, 3);
  const { t } = useLanguageStore();

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-light flex items-center justify-center text-brand-green">
            <Tractor className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-brand-text">
            {t("nearbyFarmers")}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/buyer/farmers?view=map"
            className="text-xs font-semibold text-brand-green hover:text-brand-dark flex items-center gap-1 group bg-brand-light/70 px-2.5 py-1 rounded-full border border-brand-green/20"
          >
            <Map className="w-3.5 h-3.5" />
            <span>{t("mapView")}</span>
          </Link>
          <Link
            href="/buyer/farmers"
            className="text-xs font-semibold text-brand-muted hover:text-brand-dark flex items-center gap-0.5 group"
          >
            <span>{t("viewAll")}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Farmer Cards List */}
      <div className="space-y-2.5">
        {nearbyFarmers.map((farmer, idx) => {
          const distanceText = idx === 0 ? "Bantwal • 2 km" : idx === 1 ? "Moodbidri • 12 km" : "Mangalore Rural • 18 km";
          return (
            <div
              key={farmer.id}
              className="bg-white rounded-2xl p-3 border border-brand-border hover:shadow-xs transition-shadow flex items-center gap-3"
            >
              {/* Farm Photo Thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-brand-light flex-shrink-0">
                <Image
                  src={farmer.coverImage || farmer.profileImage || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"}
                  alt={farmer.farmName}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              {/* Farmer Info */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-sm font-bold text-brand-dark truncate">{farmer.farmName}</h3>
                  {farmer.verified && (
                    <CheckCircle className="w-4 h-4 text-brand-green fill-brand-green/20 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-brand-muted mb-1.5">
                  <MapPin className="w-3 h-3 text-brand-green flex-shrink-0" />
                  <span className="truncate">{distanceText}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{farmer.rating}</span>
                  </div>
                  <span className="text-[10px] text-brand-muted">({farmer.reviewCount} reviews)</span>
                </div>
              </div>

              {/* View Profile Button */}
              <Link
                href={`/buyer/farmers/${farmer.id}`}
                className="px-3.5 py-2 rounded-xl bg-brand-light text-brand-green text-xs font-bold hover:bg-brand-green hover:text-white transition-all flex-shrink-0 text-center shadow-2xs"
              >
                {t("viewProfile")}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
