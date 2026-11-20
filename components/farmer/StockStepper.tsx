"use client";

import React, { useState } from "react";
import { Layers, AlertTriangle, CheckCircle, Ban, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export interface StockProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
  harvestDate?: string | Date;
}

interface StockStepperProps {
  product: StockProduct;
  onUpdate?: (updated: StockProduct) => void;
}

export default function StockStepper({ product, onUpdate }: StockStepperProps) {
  const [currentQty, setCurrentQty] = useState(product.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const isUnavailable = currentQty === 0;
  const isLimited = currentQty > 0 && currentQty < 30;

  async function handleAdjust(delta: number) {
    const targetQty = Math.max(0, currentQty + delta);
    if (targetQty === currentQty) return;

    setCurrentQty(targetQty);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: targetQty }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Failed to update stock");
        setCurrentQty(product.quantity); // revert
        return;
      }

      const updatedProduct: StockProduct = {
        ...product,
        quantity: targetQty,
        status: targetQty === 0 ? "UNAVAILABLE" : targetQty < 30 ? "LIMITED" : "AVAILABLE",
      };

      onUpdate?.(updatedProduct);
      toast.success(`${product.name}: stock adjusted to ${targetQty} ${product.unit}`);
    } catch {
      toast.error("Network error while adjusting stock");
      setCurrentQty(product.quantity);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap transition-all hover:border-brand-green/40">
      {/* Product Image & Meta */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-16 h-16 rounded-xl bg-brand-cream border border-brand-border overflow-hidden flex-shrink-0 flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Layers className="w-6 h-6 text-brand-muted" />
          )}

          {isUpdating && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-2xs">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base text-brand-dark truncate">{product.name}</h3>
            <Badge
              variant="secondary"
              className={
                isUnavailable
                  ? "bg-red-50 text-brand-error border-red-100 text-[10px]"
                  : isLimited
                  ? "bg-amber-50 text-amber-700 border-amber-100 text-[10px]"
                  : "bg-brand-light text-brand-green border-brand-green/20 text-[10px]"
              }
            >
              {isUnavailable ? "Sold Out" : isLimited ? "Low Stock" : "In Stock"}
            </Badge>
          </div>

          <p className="text-xs text-brand-muted mt-0.5">
            <span className="font-semibold text-brand-dark">{formatCurrency(product.price)}</span>
            <span> / {product.unit}</span>
            <span> • {product.category}</span>
          </p>

          {product.harvestDate && (
            <p className="text-[11px] text-brand-muted/80 mt-0.5">
              Harvested: {new Date(product.harvestDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </p>
          )}
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <div className="flex items-center bg-brand-cream border border-brand-border rounded-xl p-1 shadow-2xs select-none">
          <button
            onClick={() => handleAdjust(-10)}
            disabled={currentQty <= 0 || isUpdating}
            className="w-10 h-10 rounded-lg bg-white border border-brand-border/60 text-brand-dark font-extrabold text-lg flex items-center justify-center hover:bg-brand-light active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Decrease stock by 10"
          >
            −
          </button>

          <div className="px-3 min-w-[70px] text-center">
            <span className="text-base font-extrabold text-brand-dark tabular-nums">
              {currentQty}
            </span>
            <span className="text-[10px] text-brand-muted ml-1 font-semibold block sm:inline">
              {product.unit}
            </span>
          </div>

          <button
            onClick={() => handleAdjust(10)}
            disabled={isUpdating}
            className="w-10 h-10 rounded-lg bg-white border border-brand-border/60 text-brand-dark font-extrabold text-lg flex items-center justify-center hover:bg-brand-light active:scale-95 disabled:opacity-30 transition-all"
            aria-label="Increase stock by 10"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
