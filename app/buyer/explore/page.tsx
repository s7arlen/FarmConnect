"use client";

import React, { useState, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Map,
  LayoutGrid,
  Salad,
  Apple,
  Wheat,
  Leaf,
  Carrot,
  Milk,
  Sparkles,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/products/ProductCard";
import EmptyState from "@/components/shared/EmptyState";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { DEMO_PRODUCTS } from "@/data/demo";
import { PRODUCT_CATEGORIES } from "@/data/categories";
import { useLanguageStore } from "@/store/languageStore";

type SortValue = "nearest" | "price_asc" | "price_desc" | "newest";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  vegetables: Salad,
  fruits: Apple,
  grains: Wheat,
  leafy: Leaf,
  roots: Carrot,
  dairy: Milk,
  herbs: Sparkles,
  other: Sprout,
};

function ExploreContent() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<SortValue>("newest");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguageStore();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: DEMO_PRODUCTS.length };
    PRODUCT_CATEGORIES.forEach((c) => {
      counts[c.id] = DEMO_PRODUCTS.filter((p) => p.category === c.id).length;
    });
    return counts;
  }, []);

  const sortOptions = [
    { value: "nearest", label: t("sortNearest") },
    { value: "price_asc", label: t("sortPriceAsc") },
    { value: "price_desc", label: t("sortPriceDesc") },
    { value: "newest", label: t("sortNewest") },
  ];

  const filtered = useMemo(() => {
    let results = [...DEMO_PRODUCTS];

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.farmName?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "all") {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // Max Price
    if (maxPrice !== null) {
      results = results.filter((p) => p.price <= maxPrice);
    }

    // Availability
    results = results.filter((p) => p.status !== "UNAVAILABLE");

    // Sort
    switch (selectedSort) {
      case "nearest":
        results.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
        break;
      case "price_asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return results;
  }, [query, selectedCategory, selectedSort, maxPrice]);

  function clearFilters() {
    setQuery("");
    setSelectedCategory("all");
    setSelectedSort("newest");
    setMaxPrice(null);
  }

  const hasActiveFilters =
    query || selectedCategory !== "all" || maxPrice !== null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-safe">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">
            {t("explore")}
          </h1>
          <p className="text-brand-muted text-sm">
            {t("verifiedFarmersSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <LanguageSwitcher variant="pill" />
          <Link
            href="/buyer/farmers?view=map"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white transition-all text-xs font-bold shadow-2xs"
          >
            <Map className="w-3.5 h-3.5" />
            <span>{t("mapView")}</span>
          </Link>
        </div>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder={t("searchPlaceholder")}
            leftIcon={<Search className="w-4 h-4 text-brand-muted" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white"
            rightIcon={
              query ? (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X className="w-4 h-4 text-brand-muted hover:text-brand-text" />
                </button>
              ) : undefined
            }
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 flex-shrink-0 bg-white"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-green" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-green" />
          )}
        </Button>
        <Select
          value={selectedSort}
          onValueChange={(v) => setSelectedSort(v as SortValue)}
        >
          <SelectTrigger className="w-[170px] hidden md:flex bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-brand-border rounded-xl p-5 mb-5 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-text">Price Range Filter</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-brand-green hover:underline font-bold"
              >
                {t("clearFilters")}
              </button>
            )}
          </div>

          {/* Max Price */}
          <div>
            <label className="text-sm font-medium text-brand-text block mb-2">
              Max Price per unit (₹)
            </label>
            <div className="flex flex-wrap gap-2">
              {[40, 80, 120, 200].map((price) => (
                <button
                  key={price}
                  onClick={() =>
                    setMaxPrice(maxPrice === price ? null : price)
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm border font-medium transition-colors ${
                    maxPrice === price
                      ? "bg-brand-green text-white border-brand-green shadow-xs"
                      : "border-brand-border text-brand-muted hover:border-brand-green bg-zinc-50"
                  }`}
                >
                  ₹{price}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories Filter Bar (Clean Vector Icons + Item Counts, No Emojis) */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide py-1">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all ${
            selectedCategory === "all"
              ? "bg-brand-green text-white border-brand-green shadow-xs"
              : "bg-white border-slate-200 text-slate-700 hover:border-brand-green hover:text-brand-green shadow-2xs"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{t("allCategories") || "All"}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {DEMO_PRODUCTS.length}
          </span>
        </button>

        {PRODUCT_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Sprout;
          const count = categoryCounts[cat.id] || 0;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all ${
                isSelected
                  ? "bg-brand-green text-white border-brand-green shadow-xs"
                  : "bg-white border-slate-200 text-slate-700 hover:border-brand-green hover:text-brand-green shadow-2xs"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-brand-muted font-medium">
          Showing <span className="font-bold text-brand-text">{filtered.length}</span> fresh products
        </p>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No produce found"
          description="Try clearing your filters or searching for something else."
          action={{ label: t("clearFilters"), onClick: clearFilters }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-brand-muted text-sm">Loading produce...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
