"use client";
import React, { useState } from "react";
import { Search, Eye, EyeOff, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_PRODUCTS } from "@/data/demo";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [query, setQuery] = useState("");

  const filtered = products.filter(
    (p) => !query || p.name.toLowerCase().includes(query.toLowerCase())
  );

  function toggleVisibility(id: string) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "UNAVAILABLE" ? "AVAILABLE" : "UNAVAILABLE" }
          : p
      )
    );
    const p = products.find((x) => x.id === id);
    toast.success(`${p?.name} ${p?.status === "UNAVAILABLE" ? "shown" : "hidden"}`);
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Products</h1>
        <p className="text-brand-muted text-sm">{products.length} total listings</p>
      </div>
      <div className="mb-4">
        <Input placeholder="Search products..." leftIcon={<Search className="w-4 h-4" />} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="space-y-2">
        {filtered.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 text-brand-green/70 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-text text-sm truncate">{product.name}</p>
                <p className="text-xs text-brand-muted">{product.farmName} · {formatCurrency(product.price)}/{product.unit} · {product.quantity} {product.unit} stock</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={product.status === "AVAILABLE" ? "default" : product.status === "LIMITED" ? "limited" : "unavailable"}>
                  {product.status}
                </Badge>
                <button
                  onClick={() => toggleVisibility(product.id)}
                  className="p-2 rounded-lg hover:bg-brand-light text-brand-muted hover:text-brand-green transition-colors"
                  title={product.status === "UNAVAILABLE" ? "Show listing" : "Hide listing"}
                >
                  {product.status === "UNAVAILABLE" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
