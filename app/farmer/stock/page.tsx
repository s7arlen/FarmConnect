"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Layers, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import StockStepper, { type StockProduct } from "@/components/farmer/StockStepper";
import { DEMO_PRODUCTS } from "@/data/demo";

export default function FarmerStockPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "AVAILABLE" | "LIMITED" | "UNAVAILABLE">("ALL");

  const [products, setProducts] = useState<StockProduct[]>(
    DEMO_PRODUCTS.filter((p) => p.farmerId === "demo-farmer-1").map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
      unit: p.unit,
      image: p.image,
      status: p.status as "AVAILABLE" | "LIMITED" | "UNAVAILABLE",
      harvestDate: p.harvestDate,
    }))
  );

  function handleProductUpdated(updated: StockProduct) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  const filtered = products.filter((p) => {
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());

    const matchesTab = activeTab === "ALL" ? true : p.status === activeTab;
    return matchesQuery && matchesTab;
  });

  const availableCount = products.filter((p) => p.status === "AVAILABLE").length;
  const limitedCount = products.filter((p) => p.status === "LIMITED").length;
  const outCount = products.filter((p) => p.status === "UNAVAILABLE").length;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-28 pb-safe">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">Stock Management</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Tap + and − to adjust live inventory and prevent overselling
          </p>
        </div>
        <Link href="/farmer/products/add">
          <Button size="sm" className="gap-1.5 bg-brand-green hover:bg-brand-dark text-white font-semibold rounded-xl h-9">
            <Plus className="w-4 h-4" />
            Add New Crop
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-1">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "ALL"
              ? "bg-brand-dark text-white shadow-xs"
              : "bg-white text-brand-muted hover:bg-brand-light border border-brand-border"
          }`}
        >
          All ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("AVAILABLE")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "AVAILABLE"
              ? "bg-brand-green text-white shadow-xs"
              : "bg-white text-brand-muted hover:bg-brand-light border border-brand-border"
          }`}
        >
          In Stock ({availableCount})
        </button>

        <button
          onClick={() => setActiveTab("LIMITED")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "LIMITED"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-brand-muted hover:bg-brand-light border border-brand-border"
          }`}
        >
          Low Stock ({limitedCount})
        </button>

        <button
          onClick={() => setActiveTab("UNAVAILABLE")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "UNAVAILABLE"
              ? "bg-brand-error text-white shadow-xs"
              : "bg-white text-brand-muted hover:bg-brand-light border border-brand-border"
          }`}
        >
          Sold Out ({outCount})
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-5">
        <Input
          placeholder="Search crop name or category..."
          leftIcon={<Search className="w-4 h-4 text-brand-muted" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white border-brand-border rounded-xl"
        />
      </div>

      {/* Stock Cards List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-8 h-8 text-brand-muted" />}
          title="No matching crops found"
          description={query ? "Try adjusting your search query." : "No items in this stock filter."}
          action={query ? { label: "Clear Search", href: "#" } : { label: "Add Produce", href: "/farmer/products/add" }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <StockStepper key={product.id} product={product} onUpdate={handleProductUpdated} />
          ))}
        </div>
      )}
    </div>
  );
}
