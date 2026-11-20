"use client";

import React from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import EmptyState from "@/components/shared/EmptyState";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">My Wishlist</h1>
          <p className="text-brand-muted text-sm">
            {items.length} {items.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>

        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-brand-muted hover:text-red-500 gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="Nothing saved yet"
          description="Save your favourite farm produce to quickly find and order them."
          action={{ label: "Browse Produce", href: "/buyer/explore" }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
