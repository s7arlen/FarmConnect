"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  CheckCircle,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Star,
  Calendar,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "@/components/shared/StarRating";
import { useCartStore } from "@/store/cartStore";
import { DEMO_PRODUCTS, DEMO_FARMERS, DEMO_REVIEWS } from "@/data/demo";
import {
  formatCurrency,
  formatHarvestDate,
  formatDate,
  getInitials,
} from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const product = DEMO_PRODUCTS.find((p) => p.id === params.id);

  if (!product) notFound();

  const farmer = DEMO_FARMERS.find((f) => f.id === product.farmerId);
  const reviews = DEMO_REVIEWS.filter((r) => r.productId === product.id);
  const { addItem, updateQuantity, getItemQuantity, isInCart } = useCartStore();
  const inCart = isInCart(product.id);
  const qty = getItemQuantity(product.id);
  const [localQty, setLocalQty] = useState(1);

  const isAvailable = product.status !== "UNAVAILABLE";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-safe pb-28">
      {/* Back */}
      <Link
        href="/buyer/explore"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-green mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-light">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                🌱
              </div>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-5"
        >
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.harvestDate && (
              <Badge variant="fresh">
                ✓ {formatHarvestDate(product.harvestDate)}
              </Badge>
            )}
            {product.status === "LIMITED" && (
              <Badge variant="limited">Limited Stock</Badge>
            )}
            {farmer?.verified && (
              <Badge variant="verified">
                <CheckCircle className="w-3 h-3" />
                Verified Farm
              </Badge>
            )}
          </div>

          {/* Name & Price */}
          <div>
            <h1 className="text-3xl font-bold text-brand-text mb-2">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-brand-green">
                {formatCurrency(product.price)}
              </span>
              <span className="text-brand-muted">/ {product.unit}</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-brand-light rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1">
                <Package className="w-3.5 h-3.5" />
                Available Stock
              </div>
              <p className="font-semibold text-brand-text">
                {product.quantity} {product.unit}
              </p>
            </div>
            {product.harvestDate && (
              <div className="bg-brand-light rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Harvest Date
                </div>
                <p className="font-semibold text-brand-text">
                  {formatDate(product.harvestDate)}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-brand-muted leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Farmer */}
          {farmer && (
            <Link href={`/buyer/farmers/${farmer.id}`}>
              <div className="flex items-center gap-3 p-4 border border-brand-border rounded-xl hover:border-brand-green/50 transition-colors">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-light flex-shrink-0">
                  {farmer.profileImage ? (
                    <Image
                      src={farmer.profileImage}
                      alt={farmer.farmName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-green font-bold">
                      {getInitials(farmer.farmName)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-brand-text text-sm">
                      {farmer.farmName}
                    </p>
                    {farmer.verified && (
                      <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <StarRating rating={Number(farmer.rating)} showValue reviewCount={farmer.reviewCount} />
                    <span className="text-xs text-brand-muted flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {farmer.address.split(",")[0]}
                    </span>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-brand-muted rotate-180" />
              </div>
            </Link>
          )}

          {/* Cart Controls */}
          {isAvailable ? (
            inCart ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-brand-light rounded-xl p-3">
                  <span className="text-sm text-brand-muted flex-1">In cart:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, qty - 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-brand-border flex items-center justify-center hover:bg-brand-light"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-brand-text w-8 text-center">{qty}</span>
                    <button
                      onClick={() => addItem(product, 1)}
                      disabled={qty >= product.quantity}
                      className="w-8 h-8 rounded-lg bg-white border border-brand-border flex items-center justify-center hover:bg-brand-light disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-brand-green">
                    {formatCurrency(qty * product.price)}
                  </span>
                </div>
                <Link href="/buyer/cart">
                  <Button className="w-full gap-2" variant="outline">
                    <ShoppingCart className="w-4 h-4" />
                    View Cart
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-brand-border rounded-xl px-3 py-2">
                    <button
                      onClick={() => setLocalQty(Math.max(1, localQty - 1))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-light"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-brand-text w-8 text-center">{localQty}</span>
                    <button
                      onClick={() => setLocalQty(Math.min(product.quantity, localQty + 1))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-light"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-brand-muted">
                    {formatCurrency(localQty * product.price)} total
                  </p>
                </div>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => addItem(product, localQty)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            )
          ) : (
            <Button className="w-full" disabled variant="outline">
              Currently Unavailable
            </Button>
          )}
        </motion.div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-brand-text mb-5">
            Reviews ({reviews.length})
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand-green font-semibold text-sm flex-shrink-0">
                      {getInitials(review.buyerName || "U")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-brand-text text-sm">
                          {review.buyerName}
                        </p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-brand-muted">
                          {review.comment}
                        </p>
                      )}
                      <p className="text-xs text-brand-muted/60 mt-1">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-brand-border p-3 px-4 shadow-lg flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Total</p>
          <p className="text-base font-extrabold text-brand-dark">
            {formatCurrency(isAvailable ? (inCart ? qty * product.price : localQty * product.price) : 0)}
          </p>
        </div>

        {isAvailable ? (
          inCart ? (
            <Link href="/buyer/cart" className="flex-1 max-w-[200px]">
              <Button className="w-full gap-2 bg-brand-green hover:bg-brand-dark text-white font-bold h-11 rounded-xl shadow-xs">
                <ShoppingCart className="w-4 h-4" />
                Go to Cart ({qty})
              </Button>
            </Link>
          ) : (
            <Button
              className="flex-1 max-w-[200px] gap-2 bg-brand-green hover:bg-brand-dark text-white font-bold h-11 rounded-xl shadow-xs"
              onClick={() => addItem(product, localQty)}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          )
        ) : (
          <Button disabled variant="outline" className="flex-1 max-w-[200px] h-11 rounded-xl">
            Sold Out
          </Button>
        )}
      </div>
    </div>
  );
}
