"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import { DEMO_PRODUCTS } from "@/data/demo";
import { formatCurrency, formatHarvestDate } from "@/lib/utils";
import { toast } from "sonner";

export default function FarmerProductsPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(
    DEMO_PRODUCTS.filter((p) => p.farmerId === "demo-farmer-1")
  );

  const filtered = products.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product removed");
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-brand-text">My Products</h1>
        <Link href="/farmer/products/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="mb-5">
        <Input
          placeholder="Search products..."
          leftIcon={<Search className="w-4 h-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="No products listed"
          description="Add your first product to start receiving orders."
          action={{ label: "Add Product", href: "/farmer/products/add" }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-light flex items-center justify-center text-2xl flex-shrink-0">
                  🌱
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-text truncate">{product.name}</p>
                  <p className="text-xs text-brand-muted capitalize">{product.category}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-semibold text-brand-green">
                      {formatCurrency(product.price)}/{product.unit}
                    </span>
                    <span className="text-xs text-brand-muted">
                      Stock: {product.quantity} {product.unit}
                    </span>
                    {product.harvestDate && (
                      <span className="text-xs text-brand-muted">
                        {formatHarvestDate(product.harvestDate)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant={
                      product.status === "AVAILABLE"
                        ? "default"
                        : product.status === "LIMITED"
                        ? "limited"
                        : "unavailable"
                    }
                  >
                    {product.status}
                  </Badge>
                  <Link href={`/farmer/products/${product.id}`}>
                    <button className="p-2 rounded-lg hover:bg-brand-light text-brand-muted hover:text-brand-green transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-brand-muted hover:text-brand-error transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
