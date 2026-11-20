"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/products/ProductCard";
import EmptyState from "@/components/shared/EmptyState";
import { DEMO_PRODUCTS } from "@/data/demo";
import { PRODUCT_CATEGORIES } from "@/data/categories";

const SORT_OPTIONS = [
  { value: "nearest", label: "Nearest" },
  { value: "price_asc", label: "Lowest Price" },
  { value: "price_desc", label: "Highest Price" },
  { value: "newest", label: "Recently Added" },
];

type SortValue = "nearest" | "price_asc" | "price_desc" | "newest";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<SortValue>("newest");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">
          Explore Produce
        </h1>
        <p className="text-brand-muted text-sm">
          Fresh produce from verified local farmers
        </p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search vegetables, fruits, grains..."
            leftIcon={<Search className="w-4 h-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rightIcon={
              query ? (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X className="w-4 h-4" />
                </button>
              ) : undefined
            }
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 flex-shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-green" />
          )}
        </Button>
        <Select
          value={selectedSort}
          onValueChange={(v) => setSelectedSort(v as SortValue)}
        >
          <SelectTrigger className="w-[160px] hidden md:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
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
          className="bg-white border border-brand-border rounded-xl p-5 mb-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-text">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-brand-green hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Max Price */}
          <div>
            <label className="text-sm font-medium text-brand-text block mb-2">
              Max Price per unit
            </label>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 150, 200].map((price) => (
                <button
                  key={price}
                  onClick={() =>
                    setMaxPrice(maxPrice === price ? null : price)
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    maxPrice === price
                      ? "bg-brand-green text-white border-brand-green"
                      : "border-brand-border text-brand-muted hover:border-brand-green"
                  }`}
                >
                  ₹{price}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selectedCategory === "all"
              ? "bg-brand-green text-white border-brand-green"
              : "bg-white border-brand-border text-brand-muted hover:border-brand-green"
          }`}
        >
          All
        </button>
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === cat.id
                ? "bg-brand-green text-white border-brand-green"
                : "bg-white border-brand-border text-brand-muted hover:border-brand-green"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-brand-muted">
          {filtered.length} produce{filtered.length !== 1 ? "s" : ""} available
        </p>
        {/* Mobile sort */}
        <Select
          value={selectedSort}
          onValueChange={(v) => setSelectedSort(v as SortValue)}
        >
          <SelectTrigger className="w-[140px] md:hidden h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No produce found"
          description="Try a different search term or adjust your filters."
          action={{ label: "Clear Filters", onClick: clearFilters }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
