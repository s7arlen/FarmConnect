"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Map, LayoutGrid, CheckCircle, Star, ArrowRight, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import FarmerCard from "@/components/farmers/FarmerCard";
import EmptyState from "@/components/shared/EmptyState";
import SafeFarmerMap from "@/components/map/DynamicFarmerMap";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { DEMO_FARMERS, DEMO_PRODUCTS } from "@/data/demo";
import { useLanguageStore } from "@/store/languageStore";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

function PublicFarmersContent() {
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") === "map" ? "map" : "list";
  const [viewMode, setViewMode] = useState<"list" | "map">(initialView);
  const [query, setQuery] = useState("");
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const { t } = useLanguageStore();

  const filtered = useMemo(() => {
    if (!query.trim()) return DEMO_FARMERS;
    const q = query.toLowerCase();
    return DEMO_FARMERS.filter(
      (f) =>
        f.farmName.toLowerCase().includes(q) ||
        f.ownerName?.toLowerCase().includes(q) ||
        f.address.toLowerCase().includes(q)
    );
  }, [query]);

  function getProducts(farmerId: string) {
    return DEMO_PRODUCTS.filter((p) => p.farmerId === farmerId).map((p) => p.name);
  }

  return (
    <div className="py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section with Language Switcher and Map/List Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-2">
            {t("localFarmers")}
          </h1>
          <p className="text-brand-muted text-xs sm:text-base">
            {t("verifiedFarmersSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <LanguageSwitcher variant="pill" />

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-brand-border shadow-2xs">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === "list"
                  ? "bg-brand-light text-brand-green shadow-xs"
                  : "text-brand-muted hover:text-brand-text"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t("listView")}</span>
            </button>

            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === "map"
                  ? "bg-brand-green text-white shadow-xs"
                  : "text-brand-muted hover:text-brand-text"
              )}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{t("mapView")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <Input
          placeholder={t("searchFarmsPlaceholder")}
          leftIcon={<Search className="w-4 h-4 text-brand-muted" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white"
          rightIcon={
            query ? (
              <button onClick={() => setQuery("")} className="text-brand-muted hover:text-brand-text">
                <X className="w-4 h-4" />
              </button>
            ) : undefined
          }
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No farmers found"
          description="Try expanding your search query or adjusting your radius filter."
          action={{ label: t("clearFilters"), onClick: () => setQuery("") }}
        />
      ) : viewMode === "list" ? (
        /* List / Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((farmer, i) => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              products={getProducts(farmer.id)}
              index={i}
            />
          ))}
        </div>
      ) : (
        /* Interactive Map View with Farm Cards Sidebar */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 order-1">
            <SafeFarmerMap
              farmers={filtered}
              selectedFarmerId={selectedFarmerId}
              onSelectFarmer={(id) => setSelectedFarmerId(id)}
              className="h-[480px] lg:h-[620px]"
            />
          </div>

          <div className="lg:col-span-4 order-2 space-y-3 lg:max-h-[620px] lg:overflow-y-auto pr-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                {filtered.length} {t("farmsFound")}
              </span>
              <span className="text-[11px] text-brand-green font-semibold">
                Click pin or card to inspect
              </span>
            </div>

            {filtered.map((farmer) => {
              const isSelected = farmer.id === selectedFarmerId;
              const products = getProducts(farmer.id);

              return (
                <div
                  key={farmer.id}
                  onClick={() => setSelectedFarmerId(farmer.id)}
                  className={cn(
                    "p-3 rounded-2xl border transition-all cursor-pointer bg-white text-left",
                    isSelected
                      ? "border-brand-green ring-2 ring-brand-green/20 shadow-sm bg-brand-light/20"
                      : "border-brand-border hover:border-brand-green/40 hover:shadow-2xs"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-light flex-shrink-0">
                      <Image
                        src={
                          farmer.coverImage ||
                          farmer.profileImage ||
                          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80"
                        }
                        alt={farmer.farmName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="text-sm font-bold text-brand-dark truncate">
                          {farmer.farmName}
                        </h3>
                        {farmer.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-brand-green fill-brand-green/20 flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-brand-muted truncate flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-brand-green flex-shrink-0" />
                        <span>{farmer.address}</span>
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>{farmer.rating}</span>
                        </div>
                        <span className="text-[10px] text-brand-muted">
                          ({farmer.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {products.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-brand-border/60 flex items-center justify-between text-[11px]">
                      <span className="text-brand-muted truncate max-w-[190px]">
                        {products.slice(0, 3).join(", ")}
                      </span>
                      <Link
                        href={`/buyer/farmers/${farmer.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-brand-green font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>{t("viewProfile")}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicFarmersPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-brand-muted text-sm">Loading local farmers...</div>}>
      <PublicFarmersContent />
    </Suspense>
  );
}
