"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

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

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fresh vegetables, fruits, grains..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-brand-border text-xs sm:text-sm text-brand-text placeholder:text-brand-muted focus:outline-hidden focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all shadow-2xs"
        />
      </div>
      <button
        type="button"
        onClick={() => router.push("/buyer/explore")}
        aria-label="Filter produce"
        className="h-11 px-3.5 rounded-xl bg-brand-light border border-brand-border/60 text-brand-green flex items-center justify-center hover:bg-brand-light/80 transition-colors shadow-2xs flex-shrink-0"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </form>
  );
}
