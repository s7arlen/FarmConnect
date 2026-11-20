"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, CheckCircle, Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatCurrency, formatHarvestDate } from "@/lib/utils";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { isToday } from "date-fns";

interface ProductCardProps {
  product: Product;
  showFarmer?: boolean;
  index?: number;
}

export default function ProductCard({
  product,
  showFarmer = true,
  index = 0,
}: ProductCardProps) {
  const { addItem, removeItem, updateQuantity, getItemQuantity, isInCart } =
    useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const inCart = isInCart(product.id);
  const wishlisted = isWishlisted(product.id);
  const qty = getItemQuantity(product.id);
  const isHarvestedToday = product.harvestDate && isToday(new Date(product.harvestDate));
  const isAvailable = product.status !== "UNAVAILABLE";
  const [imgError, setImgError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group bg-white rounded-xl border border-brand-border overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <Link href={`/buyer/products/${product.id}`} className="block relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
          {product.image && !imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50 text-emerald-700">
              <span className="text-3xl mb-1">🌿</span>
              <span className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">Farm Produce</span>
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isHarvestedToday && (
              <Badge variant="fresh" className="text-[10px] font-semibold">
                ✓ Harvested Today
              </Badge>
            )}
            {product.status === "LIMITED" && (
              <Badge variant="limited" className="text-[10px]">
                Limited Stock
              </Badge>
            )}
            {!isAvailable && (
              <Badge variant="unavailable" className="text-[10px]">
                Unavailable
              </Badge>
            )}
          </div>

          {/* Actions & Badges */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm",
                wishlisted
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-white/80 backdrop-blur-sm text-brand-muted hover:text-red-500 hover:bg-white"
              )}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
            </button>
            {product.farmerVerified && (
              <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/buyer/products/${product.id}`}>
          <h3 className="font-semibold text-brand-text text-base leading-tight mb-1 hover:text-brand-green transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-lg font-bold text-brand-green">
            {formatCurrency(product.price)}
          </span>
          <span className="text-xs text-brand-muted">/ {product.unit}</span>
        </div>

        {product.harvestDate && (
          <p className="text-xs text-brand-muted mb-1">
            {formatHarvestDate(product.harvestDate)}
          </p>
        )}

        {showFarmer && product.farmName && (
          <div className="flex items-center justify-between text-xs text-brand-muted mt-1">
            <span className="font-medium text-brand-text/80">
              {product.farmName}
            </span>
            {product.distanceKm !== undefined && (
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {product.distanceKm} km
              </span>
            )}
          </div>
        )}

        {/* Cart Controls */}
        <div className="mt-3">
          {!isAvailable ? (
            <Button variant="outline" size="sm" className="w-full" disabled>
              Unavailable
            </Button>
          ) : inCart ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, qty - 1)}
                className="w-8 h-8 rounded-lg border border-brand-border flex items-center justify-center hover:bg-brand-light transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-brand-text">
                {qty} {product.unit}
              </span>
              <button
                onClick={() => addItem(product, 1)}
                disabled={qty >= product.quantity}
                className={cn(
                  "w-8 h-8 rounded-lg border border-brand-border flex items-center justify-center transition-colors",
                  qty >= product.quantity
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-brand-light"
                )}
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full gap-1.5"
              onClick={() => addItem(product, 1)}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
