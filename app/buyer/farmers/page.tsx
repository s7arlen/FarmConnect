"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import FarmerCard from "@/components/farmers/FarmerCard";
import EmptyState from "@/components/shared/EmptyState";
import { DEMO_FARMERS, DEMO_PRODUCTS } from "@/data/demo";

export default function FarmersPage() {
  const [query, setQuery] = useState("");

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
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Local Farmers</h1>
        <p className="text-brand-muted text-sm">
          Verified farmers in your area
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search farms or farmers..."
          leftIcon={<Search className="w-4 h-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rightIcon={
            query ? (
              <button onClick={() => setQuery("")}>
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
          description="Try expanding your search or adjusting your distance."
          action={{ label: "Clear Search", onClick: () => setQuery("") }}
        />
      ) : (
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
      )}
    </div>
  );
}
