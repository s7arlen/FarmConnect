"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

const QUICK_TAGS = [
  { label: "🍅 Fresh Tomatoes", query: "tomato" },
  { label: "🥬 Palak / Spinach", query: "spinach" },
  { label: "🥕 Organic Carrots", query: "carrot" },
  { label: "🥭 Alphonso Mangoes", query: "mango" },
  { label: "🌾 Sona Masoori Rice", query: "rice" },
];

export default function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buyer/explore?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/buyer/explore");
    }
  }

  function handleTagClick(tagQuery: string) {
    router.push(`/buyer/explore?search=${encodeURIComponent(tagQuery)}`);
  }

  return (
    <div className="space-y-2.5">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none group-focus-within:text-brand-dark transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search directly by farm vegetable, fruit, grain, or farmer..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-brand-border/90 text-xs sm:text-sm text-brand-text placeholder:text-brand-muted/70 focus:outline-hidden focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all shadow-sm hover:border-brand-green/50"
          />
        </div>
        <button
          type="button"
          onClick={() => router.push("/buyer/explore")}
          aria-label="Filter produce"
          className="h-12 px-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center gap-1.5 font-medium text-xs hover:bg-emerald-100/70 transition-colors shadow-2xs flex-shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-green" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </form>

      {/* Trending Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex-shrink-0 mr-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Trending:
        </span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => handleTagClick(tag.query)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white/90 hover:bg-emerald-50 border border-brand-border/70 hover:border-emerald-300 text-brand-text text-xs font-medium transition-all shadow-2xs"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
